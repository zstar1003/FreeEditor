import OSS from 'ali-oss'
import { FileItem, FolderItem } from '../types'

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

// 索引文件路径
const INDEX_FILE_PATH = 'freeeditor/backup/index.json'
// 文章内容目录
const ARTICLES_DIR = 'freeeditor/backup/articles/'

// 索引文件结构
interface BackupIndex {
  folders: FolderItem[]
  fileMetadata: Array<{
    id: string
    name: string
    folderId: string | null
    createdAt: string
    updatedAt: string
  }>
  deletedItems?: {
    files: string[]  // 已删除的文件ID列表
    folders: string[] // 已删除的文件夹ID列表
    deletedAt: string // 删除时间
  }
  exportTime: string
  version: string
}

// 智能同步：对比本地和云端，合并数据
export async function syncWithOSS(
  localFiles: FileItem[],
  localFolders: FolderItem[]
): Promise<{ files: FileItem[], folders: FolderItem[], hasChanges: boolean }> {
  const configStr = localStorage.getItem('ossImageBedConfig')
  if (!configStr) {
    throw new Error('请先在设置中配置阿里云OSS')
  }

  const config: OSSConfig = JSON.parse(configStr)

  if (!config.region || !config.accessKeyId || !config.accessKeySecret || !config.bucket) {
    throw new Error('OSS配置不完整，请检查设置')
  }

  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    secure: true,
  })

  let remoteFiles: FileItem[] = []
  let remoteFolders: FolderItem[] = []
  let hasRemoteBackup = false
  let indexData: BackupIndex | null = null

  // 尝试下载云端备份
  try {
    const indexResult = await client.get(INDEX_FILE_PATH)
    const indexText = indexResult.content.toString('utf-8')
    indexData = JSON.parse(indexText)

    // 只要索引文件存在且格式正确，就认为有远程备份
    if (indexData && Array.isArray(indexData.fileMetadata) && Array.isArray(indexData.folders)) {
      hasRemoteBackup = true
      remoteFolders = indexData.folders

      // 并发下载所有文章（即使 fileMetadata 为空数组也继续）
      const downloadPromises = indexData.fileMetadata.map(async (metadata) => {
        const articlePath = `${ARTICLES_DIR}${metadata.id}.json`
        try {
          const articleResult = await client.get(articlePath)
          const articleText = articleResult.content.toString('utf-8')
          const articleData = JSON.parse(articleText)

          return {
            id: metadata.id,
            name: metadata.name,
            content: articleData.content || '',
            folderId: metadata.folderId,
            createdAt: metadata.createdAt,
            updatedAt: metadata.updatedAt
          } as FileItem
        } catch (error) {
          console.error(`Failed to download article ${metadata.id}:`, error)
          return null
        }
      })

      const downloadedFiles = await Promise.all(downloadPromises)
      remoteFiles = downloadedFiles.filter(f => f !== null) as FileItem[]
    }
  } catch (error: any) {
    if (error.code === 'NoSuchKey') {
      hasRemoteBackup = false
    } else {
      throw error
    }
  }

  // 判断本地是否为空
  const localIsEmpty = localFiles.length === 0 && localFolders.length === 0
  const remoteIsEmpty = remoteFiles.length === 0 && remoteFolders.length === 0

  // 如果云端没有备份，直接上传本地数据
  if (!hasRemoteBackup) {
    await uploadToOSS(client, localFiles, localFolders)
    return { files: localFiles, folders: localFolders, hasChanges: false }
  }

  // 关键优化：如果本地为空但云端有数据，直接使用云端数据（避免清空云端）
  if (localIsEmpty && !remoteIsEmpty) {
    console.log('本地为空，直接使用云端数据')
    return { files: remoteFiles, folders: remoteFolders, hasChanges: true }
  }

  // 如果云端为空但本地有数据，上传本地数据
  if (!localIsEmpty && remoteIsEmpty) {
    console.log('云端为空，上传本地数据')
    await uploadToOSS(client, localFiles, localFolders)
    return { files: localFiles, folders: localFolders, hasChanges: false }
  }

  // 合并数据：以最新的 updatedAt 为准
  const mergedFilesMap = new Map<string, FileItem>()
  const mergedFoldersMap = new Map<string, FolderItem>()

  // 获取云端已删除的项目列表
  const remoteDeletedFiles = new Set(indexData?.deletedItems?.files || [])
  const remoteDeletedFolders = new Set(indexData?.deletedItems?.folders || [])

  // 先添加本地文件（排除云端已删除的）
  localFiles.forEach(f => {
    if (!remoteDeletedFiles.has(f.id)) {
      mergedFilesMap.set(f.id, f)
    }
  })
  localFolders.forEach(f => {
    if (!remoteDeletedFolders.has(f.id)) {
      mergedFoldersMap.set(f.id, f)
    }
  })

  // 合并云端文件（如果云端更新，则覆盖）
  remoteFiles.forEach(remoteFile => {
    const localFile = mergedFilesMap.get(remoteFile.id)
    if (!localFile || new Date(remoteFile.updatedAt) > new Date(localFile.updatedAt)) {
      mergedFilesMap.set(remoteFile.id, remoteFile)
    }
  })

  remoteFolders.forEach(remoteFolder => {
    if (!mergedFoldersMap.has(remoteFolder.id)) {
      mergedFoldersMap.set(remoteFolder.id, remoteFolder)
    }
  })

  // 计算本地删除的项目（存在于云端但不在本地的，且不在云端删除列表中的）
  const localDeletedFiles = remoteFiles
    .filter(rf => !localFiles.find(lf => lf.id === rf.id))
    .map(f => f.id)
  const localDeletedFolders = remoteFolders
    .filter(rf => !localFolders.find(lf => lf.id === rf.id))
    .map(f => f.id)

  // 从合并结果中移除本地删除的项目
  localDeletedFiles.forEach(id => mergedFilesMap.delete(id))
  localDeletedFolders.forEach(id => mergedFoldersMap.delete(id))

  const mergedFiles = Array.from(mergedFilesMap.values())
  const mergedFolders = Array.from(mergedFoldersMap.values())

  // 检查是否有变化
  const hasChanges =
    mergedFiles.length !== localFiles.length ||
    mergedFolders.length !== localFolders.length ||
    mergedFiles.some(f => {
      const local = localFiles.find(lf => lf.id === f.id)
      return !local || local.updatedAt !== f.updatedAt
    })

  // 上传合并后的数据到云端，并记录删除的项目
  const allDeletedFiles = new Set([...remoteDeletedFiles, ...localDeletedFiles])
  const allDeletedFolders = new Set([...remoteDeletedFolders, ...localDeletedFolders])

  await uploadToOSS(
    client,
    mergedFiles,
    mergedFolders,
    {
      files: Array.from(allDeletedFiles),
      folders: Array.from(allDeletedFolders),
      deletedAt: new Date().toISOString()
    }
  )

  return { files: mergedFiles, folders: mergedFolders, hasChanges }
}

async function uploadToOSS(
  client: OSS,
  files: FileItem[],
  folders: FolderItem[],
  deletedItems?: { files: string[], folders: string[], deletedAt: string }
): Promise<void> {
  // 准备索引文件
  const indexData: BackupIndex = {
    folders: folders,
    fileMetadata: files.map(f => ({
      id: f.id,
      name: f.name,
      folderId: f.folderId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt
    })),
    deletedItems: deletedItems,
    exportTime: new Date().toISOString(),
    version: '2.0'
  }

  // 上传索引文件
  const indexBlob = new Blob([JSON.stringify(indexData, null, 2)], { type: 'application/json' })
  await client.put(INDEX_FILE_PATH, indexBlob)

  // 并发上传所有文章
  const uploadPromises = files.map(async (file) => {
    const articleData = { id: file.id, content: file.content }
    const articleBlob = new Blob([JSON.stringify(articleData, null, 2)], { type: 'application/json' })
    const articlePath = `${ARTICLES_DIR}${file.id}.json`
    await client.put(articlePath, articleBlob)
  })

  await Promise.all(uploadPromises)
}

export async function backupToOSS(files: FileItem[], folders: FolderItem[]): Promise<void> {
  const configStr = localStorage.getItem('ossImageBedConfig')
  if (!configStr) {
    throw new Error('请先在设置中配置阿里云OSS')
  }

  const config: OSSConfig = JSON.parse(configStr)

  if (!config.region || !config.accessKeyId || !config.accessKeySecret || !config.bucket) {
    throw new Error('OSS配置不完整，请检查设置')
  }

  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    secure: true,
  })

  await uploadToOSS(client, files, folders)
}

export async function restoreFromOSS(): Promise<{ files: FileItem[], folders: FolderItem[] }> {
  const configStr = localStorage.getItem('ossImageBedConfig')
  if (!configStr) {
    throw new Error('请先在设置中配置阿里云OSS')
  }

  const config: OSSConfig = JSON.parse(configStr)

  if (!config.region || !config.accessKeyId || !config.accessKeySecret || !config.bucket) {
    throw new Error('OSS配置不完整，请检查设置')
  }

  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    secure: true,
  })

  try {
    const indexResult = await client.get(INDEX_FILE_PATH)
    const indexText = indexResult.content.toString('utf-8')
    const indexData: BackupIndex = JSON.parse(indexText)

    if (!indexData.fileMetadata || !indexData.folders) {
      throw new Error('备份索引文件格式无效')
    }

    const downloadPromises = indexData.fileMetadata.map(async (metadata) => {
      const articlePath = `${ARTICLES_DIR}${metadata.id}.json`
      try {
        const articleResult = await client.get(articlePath)
        const articleText = articleResult.content.toString('utf-8')
        const articleData = JSON.parse(articleText)

        return {
          id: metadata.id,
          name: metadata.name,
          content: articleData.content || '',
          folderId: metadata.folderId,
          createdAt: metadata.createdAt,
          updatedAt: metadata.updatedAt
        } as FileItem
      } catch (error) {
        console.error(`Failed to download article ${metadata.id}:`, error)
        return {
          id: metadata.id,
          name: metadata.name,
          content: '',
          folderId: metadata.folderId,
          createdAt: metadata.createdAt,
          updatedAt: metadata.updatedAt
        } as FileItem
      }
    })

    const files = await Promise.all(downloadPromises)

    return {
      files: files,
      folders: indexData.folders
    }
  } catch (error: any) {
    if (error.code === 'NoSuchKey') {
      throw new Error('云端暂无备份文件')
    }
    throw error
  }
}

// 扫描并恢复云端孤立的文章文件（当索引文件为空但articles目录有文件时使用）
export async function recoverOrphanedArticles(): Promise<{ files: FileItem[], folders: FolderItem[] }> {
  const configStr = localStorage.getItem('ossImageBedConfig')
  if (!configStr) {
    throw new Error('请先在设置中配置阿里云OSS')
  }

  const config: OSSConfig = JSON.parse(configStr)

  if (!config.region || !config.accessKeyId || !config.accessKeySecret || !config.bucket) {
    throw new Error('OSS配置不完整，请检查设置')
  }

  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    secure: true,
  })

  try {
    // 列出 articles 目录下的所有文件
    const result = await client.list({
      prefix: ARTICLES_DIR,
      'max-keys': 1000
    })

    if (!result.objects || result.objects.length === 0) {
      throw new Error('云端 articles 目录为空，无法恢复数据')
    }

    const recoveredFiles: FileItem[] = []

    // 并发下载所有文章文件
    const downloadPromises = result.objects.map(async (obj) => {
      try {
        const articleResult = await client.get(obj.name)
        const articleText = articleResult.content.toString('utf-8')
        const articleData = JSON.parse(articleText)

        // 从文件名提取 ID
        const fileName = obj.name.split('/').pop()
        const fileId = fileName?.replace('.json', '') || ''

        return {
          id: articleData.id || fileId,
          name: `恢复的文档 ${fileId}`,
          content: articleData.content || '',
          folderId: null,
          createdAt: obj.lastModified || new Date().toISOString(),
          updatedAt: obj.lastModified || new Date().toISOString()
        } as FileItem
      } catch (error) {
        console.error(`Failed to recover article ${obj.name}:`, error)
        return null
      }
    })

    const downloadedFiles = await Promise.all(downloadPromises)
    recoveredFiles.push(...downloadedFiles.filter(f => f !== null) as FileItem[])

    if (recoveredFiles.length === 0) {
      throw new Error('未找到可恢复的文章数据')
    }

    // 重建索引并上传
    await uploadToOSS(client, recoveredFiles, [])

    return {
      files: recoveredFiles,
      folders: []
    }
  } catch (error: any) {
    if (error.code === 'NoSuchKey') {
      throw new Error('云端 articles 目录不存在')
    }
    throw error
  }
}


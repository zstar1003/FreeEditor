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
  exportTime: string
  version: string
}

export async function backupToOSS(files: FileItem[], folders: FolderItem[]): Promise<void> {
  // 从localStorage获取OSS配置
  const configStr = localStorage.getItem('ossImageBedConfig')
  if (!configStr) {
    throw new Error('请先在设置中配置阿里云OSS')
  }

  const config: OSSConfig = JSON.parse(configStr)

  if (!config.region || !config.accessKeyId || !config.accessKeySecret || !config.bucket) {
    throw new Error('OSS配置不完整，请检查设置')
  }

  // 创建OSS客户端
  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    secure: true,
  })

  // 准备索引文件数据
  const indexData: BackupIndex = {
    folders: folders,
    fileMetadata: files.map(f => ({
      id: f.id,
      name: f.name,
      folderId: f.folderId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt
    })),
    exportTime: new Date().toISOString(),
    version: '2.0'
  }

  // 上传索引文件
  const indexBlob = new Blob([JSON.stringify(indexData, null, 2)], { type: 'application/json' })
  await client.put(INDEX_FILE_PATH, indexBlob)

  // 并发上传每篇文章的内容
  const uploadPromises = files.map(async (file) => {
    const articleData = {
      id: file.id,
      content: file.content
    }
    const articleBlob = new Blob([JSON.stringify(articleData, null, 2)], { type: 'application/json' })
    const articlePath = `${ARTICLES_DIR}${file.id}.json`
    await client.put(articlePath, articleBlob)
  })

  await Promise.all(uploadPromises)
}

export async function restoreFromOSS(): Promise<{ files: FileItem[], folders: FolderItem[] }> {
  // 从localStorage获取OSS配置
  const configStr = localStorage.getItem('ossImageBedConfig')
  if (!configStr) {
    throw new Error('请先在设置中配置阿里云OSS')
  }

  const config: OSSConfig = JSON.parse(configStr)

  if (!config.region || !config.accessKeyId || !config.accessKeySecret || !config.bucket) {
    throw new Error('OSS配置不完整，请检查设置')
  }

  // 创建OSS客户端
  const client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    secure: true,
  })

  try {
    // 下载索引文件
    const indexResult = await client.get(INDEX_FILE_PATH)
    const indexText = indexResult.content.toString('utf-8')
    const indexData: BackupIndex = JSON.parse(indexText)

    if (!indexData.fileMetadata || !indexData.folders) {
      throw new Error('备份索引文件格式无效')
    }

    // 并发下载所有文章内容
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
        // 如果单篇文章下载失败，返回空内容
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


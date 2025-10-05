import OSS from 'ali-oss'
import { FileItem, FolderItem } from '../types'

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

// 备份文件名固定为 freeeditor-backup.json
const BACKUP_FILE_NAME = 'freeeditor/backup/freeeditor-backup.json'

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

  // 准备备份数据
  const backupData = {
    files: files,
    folders: folders,
    exportTime: new Date().toISOString(),
    version: '1.0'
  }

  // 转换为JSON字符串
  const jsonStr = JSON.stringify(backupData, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })

  // 上传到OSS
  await client.put(BACKUP_FILE_NAME, blob)
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
    // 从OSS下载备份文件
    const result = await client.get(BACKUP_FILE_NAME)

    // 读取文件内容 - result.content 是 Buffer
    const text = result.content.toString('utf-8')
    const data = JSON.parse(text)

    if (!data.files || !data.folders) {
      throw new Error('备份文件格式无效')
    }

    return {
      files: data.files,
      folders: data.folders
    }
  } catch (error: any) {
    if (error.code === 'NoSuchKey') {
      throw new Error('云端暂无备份文件')
    }
    throw error
  }
}

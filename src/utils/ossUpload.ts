import OSS from 'ali-oss'

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

export async function uploadImageToOSS(file: File): Promise<string> {
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

  // 生成文件名：年月日/时间戳-随机数.扩展名
  const date = new Date()
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = file.name.split('.').pop() || 'png'
  const fileName = `freeeditor/${dateStr}/${timestamp}-${random}.${ext}`

  // 上传文件，设置跨域headers
  const result = await client.put(fileName, file, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT',
    }
  })

  // 返回公共访问URL（不带签名参数）
  // 格式：https://{bucket}.{region}.aliyuncs.com/{fileName}
  return `https://${config.bucket}.${config.region}.aliyuncs.com/${fileName}`
}

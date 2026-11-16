import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { FileItem, FolderItem } from '../types'
import { syncWithOSS, recoverOrphanedArticles } from '../utils/ossBackup'
import './Settings.css'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  files: FileItem[]
  folders: FolderItem[]
  onSyncComplete: (files: FileItem[], folders: FolderItem[]) => void
  syncScrollEnabled: boolean
  onSyncScrollEnabledChange: (enabled: boolean) => void
}

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

interface SyncConfig {
  enabled: boolean
  interval: number // 分钟
}

export default function Settings({ isOpen, onClose, theme, files, folders, onSyncComplete, syncScrollEnabled, onSyncScrollEnabledChange }: SettingsProps) {
  const [syncStatus, setSyncStatus] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [ossConfig, setOssConfig] = useLocalStorage<OSSConfig>('ossImageBedConfig', {
    region: 'oss-cn-hangzhou',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
  })
  const [syncConfig, setSyncConfig] = useLocalStorage<SyncConfig>('autoSyncConfig', {
    enabled: false,
    interval: 5 // 默认5分钟
  })

  const handleSyncNow = async () => {
    setIsSyncing(true)
    setSyncStatus('正在同步...')

    try {
      const result = await syncWithOSS(files, folders)

      if (result.hasChanges) {
        onSyncComplete(result.files, result.folders)
        setSyncStatus('同步成功！已合并本地和云端的最新数据')
        showToast('同步成功')
      } else {
        setSyncStatus('同步成功！本地和云端数据已是最新')
        showToast('数据已是最新')
      }

      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus('同步失败: ' + (error as Error).message)
      showToast('同步失败，请检查OSS配置')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleRecoverData = async () => {
    if (!confirm('此操作将尝试从云端 articles 目录恢复孤立的文章文件。是否继续？')) {
      return
    }

    setIsRecovering(true)
    setSyncStatus('正在扫描云端文件...')

    try {
      const result = await recoverOrphanedArticles()

      if (result.files.length > 0) {
        onSyncComplete(result.files, result.folders)
        setSyncStatus(`恢复成功！找到 ${result.files.length} 个文章文件`)
        showToast(`成功恢复 ${result.files.length} 个文档`)
      } else {
        setSyncStatus('未找到可恢复的文件')
        showToast('未找到可恢复的文件')
      }

      setTimeout(() => setSyncStatus(''), 5000)
    } catch (error) {
      console.error('Recovery error:', error)
      setSyncStatus('恢复失败: ' + (error as Error).message)
      showToast('恢复失败')
    } finally {
      setIsRecovering(false)
    }
  }

  const handleToggleAutoSync = (enabled: boolean) => {
    setSyncConfig({ ...syncConfig, enabled })
    if (enabled) {
      showToast(`已开启自动同步，每${syncConfig.interval}分钟同步一次`)
    } else {
      showToast('已关闭自动同步')
    }
  }

  const handleChangeSyncInterval = (interval: number) => {
    setSyncConfig({ ...syncConfig, interval })
    showToast(`同步间隔已设置为${interval}分钟`)
  }

  const handleSaveOSSConfig = () => {
    setOssConfig(ossConfig)
    showToast('OSS配置已保存')
    setSyncStatus('配置已保存，现在可以使用云端同步和图片上传功能')
    setTimeout(() => setSyncStatus(''), 3000)
  }

  const showToast = (message: string) => {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #07c160;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className={`settings-overlay ${theme}`} onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>设置</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>阿里云 OSS 配置</h3>
            <p className="settings-description">
              配置阿里云OSS后，可实现文档云端同步和图片自动上传。一次配置，两个功能同时启用。
            </p>

            <div className="form-group">
              <label>Region（地域节点）</label>
              <select
                value={ossConfig.region}
                onChange={(e) => setOssConfig({ ...ossConfig, region: e.target.value })}
              >
                <option value="oss-cn-hangzhou">华东1（杭州）</option>
                <option value="oss-cn-shanghai">华东2（上海）</option>
                <option value="oss-cn-qingdao">华北1（青岛）</option>
                <option value="oss-cn-beijing">华北2（北京）</option>
                <option value="oss-cn-zhangjiakou">华北3（张家口）</option>
                <option value="oss-cn-shenzhen">华南1（深圳）</option>
                <option value="oss-cn-guangzhou">华南2（广州）</option>
                <option value="oss-cn-chengdu">西南1（成都）</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bucket Name（存储空间名称）</label>
              <input
                type="text"
                value={ossConfig.bucket}
                onChange={(e) => setOssConfig({ ...ossConfig, bucket: e.target.value })}
                placeholder="请输入Bucket名称"
              />
            </div>

            <div className="form-group">
              <label>AccessKey ID</label>
              <input
                type="text"
                value={ossConfig.accessKeyId}
                onChange={(e) => setOssConfig({ ...ossConfig, accessKeyId: e.target.value })}
                placeholder="请输入AccessKey ID"
              />
            </div>

            <div className="form-group">
              <label>AccessKey Secret</label>
              <input
                type="password"
                value={ossConfig.accessKeySecret}
                onChange={(e) => setOssConfig({ ...ossConfig, accessKeySecret: e.target.value })}
                placeholder="请输入AccessKey Secret"
              />
            </div>

            <div className="settings-help">
              <p>配置步骤：</p>
              <ol>
                <li>访问 <a href="https://oss.console.aliyun.com/" target="_blank" rel="noopener noreferrer">阿里云OSS控制台</a></li>
                <li>创建Bucket，<strong>读写权限选择"公共读"</strong></li>
                <li>配置CORS规则：允许来源 <code>*</code>，允许方法 <code>GET, POST, PUT</code></li>
                <li>在AccessKey管理中创建密钥，记录ID和Secret</li>
                <li>填入上方配置并保存</li>
              </ol>
            </div>

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleSaveOSSConfig}>
                保存配置
              </button>
            </div>
          </div>

          <div className="settings-section" style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #3e3e42' }}>
            <h3>文档云端同步</h3>
            <p className="settings-description">
              智能同步：自动对比本地和云端数据，保留最新版本。采用索引 + 独立文章的存储方式，避免单文件过大。
            </p>

            <div className="backup-info">
              <div className="info-item">
                <div className="info-label">📁 文档总数</div>
                <div className="info-value">{files.length} 个</div>
              </div>
              <div className="info-item">
                <div className="info-label">📂 文件夹</div>
                <div className="info-value">{folders.length} 个</div>
              </div>
            </div>

            <div className="settings-help">
              <p>自动同步配置：</p>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={syncConfig.enabled}
                    onChange={(e) => handleToggleAutoSync(e.target.checked)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  <span>启用自动同步</span>
                </label>
              </div>

              {syncConfig.enabled && (
                <div className="form-group">
                  <label>同步间隔（分钟）</label>
                  <select
                    value={syncConfig.interval}
                    onChange={(e) => handleChangeSyncInterval(Number(e.target.value))}
                  >
                    <option value={1}>1 分钟</option>
                    <option value={3}>3 分钟</option>
                    <option value={5}>5 分钟</option>
                    <option value={10}>10 分钟</option>
                    <option value={15}>15 分钟</option>
                    <option value={30}>30 分钟</option>
                    <option value={60}>60 分钟</option>
                  </select>
                </div>
              )}

              <p style={{ marginTop: '16px', fontSize: '13px', color: '#858585', lineHeight: '1.6' }}>
                <strong>同步规则：</strong><br />
                • 自动对比本地和云端数据<br />
                • 以最新的 updatedAt 时间戳为准<br />
                • 合并后同时更新本地和云端<br />
                • 新增的文件/文件夹会自动合并<br />
                • 删除暂不跨设备同步，本地删除的文档可能从云端重新出现<br />
                • 请勿多设备同时同步；同步前请保留独立备份
              </p>
            </div>

            {syncStatus && (
              <div className={`sync-status ${syncStatus.includes('成功') ? 'success' : syncStatus.includes('失败') ? 'error' : 'info'}`}>
                {syncStatus}
              </div>
            )}

            <div className="settings-actions">
              <button
                className="btn-secondary"
                onClick={handleSyncNow}
                disabled={isSyncing || isRecovering}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                {isSyncing ? '同步中...' : '立即同步'}
              </button>
              <button
                className="btn-secondary"
                onClick={handleRecoverData}
                disabled={isSyncing || isRecovering}
                style={{ marginLeft: '12px' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308c-.12.1-.12.284 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                </svg>
                {isRecovering ? '恢复中...' : '恢复孤立文件'}
              </button>
            </div>
          </div>

          <div className="settings-section" style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #3e3e42' }}>
            <h3>图片上传</h3>
            <p className="settings-description">
              配置OSS后，可在编辑器中直接粘贴或拖拽上传图片，自动获取图片链接插入到文档中。
            </p>

            <div className="settings-help">
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#858585', lineHeight: '1.6' }}>
                💡 使用方法：<br />
                • 在编辑器中按 Ctrl+V 粘贴截图<br />
                • 或直接拖拽图片文件到编辑器<br />
                • 图片会自动上传到 OSS 并插入 Markdown 链接<br />
                • 存储路径：freeeditor/YYYYMMDD/timestamp-random.ext
              </p>
            </div>
          </div>

          <div className="settings-section" style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #3e3e42' }}>
            <h3>编辑器设置</h3>
            <p className="settings-description">
              自定义编辑器的行为和交互方式。
            </p>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={syncScrollEnabled}
                  onChange={(e) => {
                    onSyncScrollEnabledChange(e.target.checked)
                    showToast(e.target.checked ? '已开启同步滚动' : '已关闭同步滚动')
                  }}
                  style={{ width: 'auto', cursor: 'pointer' }}
                />
                <span>编辑时预览区自动滚动</span>
              </label>
            </div>

            <div className="settings-help">
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#858585', lineHeight: '1.6' }}>
                💡 说明：<br />
                • 开启后，编辑区的光标位置变化时，预览区会自动滚动到对应位置<br />
                • 方便实时查看编辑内容的预览效果
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { FileItem, FolderItem } from '../types'
import { backupToOSS, restoreFromOSS } from '../utils/ossBackup'
import './Settings.css'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  files: FileItem[]
  folders: FolderItem[]
  onSyncComplete: (files: FileItem[], folders: FolderItem[]) => void
}

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

export default function Settings({ isOpen, onClose, theme, files, folders, onSyncComplete }: SettingsProps) {
  const [syncStatus, setSyncStatus] = useState<string>('')
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [activeTab, setActiveTab] = useState<'backup' | 'imagebed'>('backup')
  const [ossConfig, setOssConfig] = useLocalStorage<OSSConfig>('ossImageBedConfig', {
    region: 'oss-cn-hangzhou',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
  })

  const handleBackupToCloud = async () => {
    setIsBackingUp(true)
    setSyncStatus('正在备份到云端...')

    try {
      await backupToOSS(files, folders)
      setSyncStatus('备份成功！文档已保存到阿里云OSS')
      showToast('文档已成功备份到云端')
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      console.error('Backup error:', error)
      setSyncStatus('备份失败: ' + (error as Error).message)
      showToast('备份失败，请检查OSS配置')
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleRestoreFromCloud = async () => {
    setIsRestoring(true)
    setSyncStatus('正在从云端恢复...')

    try {
      const { files: restoredFiles, folders: restoredFolders } = await restoreFromOSS()
      onSyncComplete(restoredFiles, restoredFolders)
      setSyncStatus('恢复成功！文档已从云端恢复')
      showToast('文档已从云端恢复')
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      console.error('Restore error:', error)
      setSyncStatus('恢复失败: ' + (error as Error).message)
      showToast('恢复失败，请检查OSS配置')
    } finally {
      setIsRestoring(false)
    }
  }

  const handleExport = () => {
    try {
      const data = {
        files: files,
        folders: folders,
        exportTime: new Date().toISOString(),
        version: '1.0'
      }

      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `freeeditor-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSyncStatus('导出成功')
      showToast('备份文件已下载到本地')
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setSyncStatus('导出失败: ' + (error as Error).message)
      showToast('导出失败，请重试')
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (!data.files || !data.folders) {
          throw new Error('无效的备份文件格式')
        }

        onSyncComplete(data.files, data.folders)

        setSyncStatus('导入成功')
        showToast('文档已从备份恢复')
        setTimeout(() => setSyncStatus(''), 3000)
      } catch (error) {
        console.error('Import error:', error)
        setSyncStatus('导入失败: ' + (error as Error).message)
        showToast('导入失败，请检查文件格式')
      }
    }

    input.click()
  }

  const handleSaveOSSConfig = () => {
    setOssConfig(ossConfig)
    showToast('OSS图床配置已保存')
    setSyncStatus('配置已保存，现在可以在编辑器中上传图片了')
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

        {/* 标签页导航 */}
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            文档备份
          </button>
          <button
            className={`settings-tab ${activeTab === 'imagebed' ? 'active' : ''}`}
            onClick={() => setActiveTab('imagebed')}
          >
            OSS图床配置
          </button>
        </div>

        <div className="settings-content">
          {/* 文档备份标签页 */}
          {activeTab === 'backup' && (
            <div className="settings-section">
              <h3>文档云端备份</h3>
              <p className="settings-description">
                自动备份所有文档到阿里云OSS，随时随地恢复数据。备份文件存储在 freeeditor/backup/freeeditor-backup.json
              </p>

              <div className="backup-info">
                <div className="info-item">
                  <div className="info-label">📁 文档总数</div>
                  <div className="info-value">{files.length} 个文件</div>
                </div>
                <div className="info-item">
                  <div className="info-label">📂 文件夹</div>
                  <div className="info-value">{folders.length} 个</div>
                </div>
              </div>

            <div className="settings-help">
              <p>云端备份说明：</p>
              <ol>
                <li><strong>备份到云端</strong>：点击"备份到云端"按钮，自动将所有文档上传到阿里云OSS</li>
                <li><strong>从云端恢复</strong>：点击"从云端恢复"按钮，自动下载并恢复所有文档</li>
                <li><strong>本地备份</strong>：也可以导出JSON文件到本地，作为额外备份</li>
              </ol>
              <p style={{ marginTop: '12px', color: '#858585', fontSize: '12px' }}>
                💡 提示：云端备份需要先配置阿里云OSS。备份文件会覆盖云端原有备份。
              </p>
            </div>

            {syncStatus && (
              <div className={`sync-status ${syncStatus.includes('成功') ? 'success' : syncStatus.includes('失败') ? 'error' : 'info'}`}>
                {syncStatus}
              </div>
            )}

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleExport}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                导出到本地
              </button>
              <button
                className="btn-secondary"
                onClick={handleRestoreFromCloud}
                disabled={isRestoring}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                {isRestoring ? '恢复中...' : '从云端恢复'}
              </button>
              <button
                className="btn-primary"
                onClick={handleBackupToCloud}
                disabled={isBackingUp}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                  <path d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                {isBackingUp ? '备份中...' : '备份到云端'}
              </button>
            </div>
          </div>
          )}

          {/* OSS图床配置标签页 */}
          {activeTab === 'imagebed' && (
            <div className="settings-section">
              <h3>阿里云OSS图床配置</h3>
              <p className="settings-description">
                配置阿里云OSS后，可以直接在编辑器中粘贴或拖拽上传图片，自动获取图片链接插入到文档中。
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
                  <li>创建Bucket，<strong>读写权限选择"公共读"</strong>（图片需要公网访问）</li>
                  <li>配置CORS规则：允许来源 <code>*</code>，允许方法 <code>GET, POST, PUT</code></li>
                  <li>在AccessKey管理中创建密钥，记录ID和Secret</li>
                  <li>填入上方配置并保存</li>
                </ol>
                <p style={{ marginTop: '12px', color: '#858585', fontSize: '12px' }}>
                  💡 提示：配置后可在编辑器中直接粘贴截图或拖拽图片上传。图片会自动上传到OSS并插入链接。
                </p>
              </div>

              {syncStatus && (
                <div className={`sync-status ${syncStatus.includes('成功') ? 'success' : syncStatus.includes('失败') ? 'error' : 'info'}`}>
                  {syncStatus}
                </div>
              )}

              <div className="settings-actions">
                <button className="btn-primary" onClick={handleSaveOSSConfig}>
                  保存配置
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

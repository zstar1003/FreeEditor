import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { FileItem, FolderItem } from '../types'
import './Settings.css'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  theme: 'dark' | 'light'
  files: FileItem[]
  folders: FolderItem[]
  onSyncComplete: (files: FileItem[], folders: FolderItem[]) => void
}

interface GitHubConfig {
  token: string
  gistId: string
}

export default function Settings({ isOpen, onClose, theme, files, folders, onSyncComplete }: SettingsProps) {
  const [githubConfig, setGithubConfig] = useLocalStorage<GitHubConfig>('githubConfig', {
    token: '',
    gistId: ''
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>('')

  const handleSave = () => {
    setGithubConfig(githubConfig)
    showToast('配置已保存')
  }

  const handleUpload = async () => {
    if (!githubConfig.token) {
      showToast('请先配置GitHub Token')
      return
    }

    setIsSyncing(true)
    setSyncStatus('正在上传到GitHub Gist...')

    try {
      const data = {
        files: files,
        folders: folders,
        lastSync: new Date().toISOString()
      }

      const gistData = {
        description: 'FreeEditor Documents Backup',
        public: false,
        files: {
          'freeeditor-data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      }

      let response
      if (githubConfig.gistId) {
        // 更新现有Gist
        response = await fetch(`https://api.github.com/gists/${githubConfig.gistId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${githubConfig.token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          body: JSON.stringify(gistData)
        })
      } else {
        // 创建新Gist
        response = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubConfig.token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          body: JSON.stringify(gistData)
        })
      }

      if (!response.ok) {
        throw new Error(`GitHub API错误: ${response.status}`)
      }

      const result = await response.json()

      // 保存Gist ID
      if (!githubConfig.gistId) {
        setGithubConfig({ ...githubConfig, gistId: result.id })
      }

      setSyncStatus('上传成功')
      showToast('文档已上传到GitHub Gist')
    } catch (error) {
      setSyncStatus('上传失败: ' + (error as Error).message)
      showToast('上传失败，请检查配置')
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncStatus(''), 3000)
    }
  }

  const handleDownload = async () => {
    if (!githubConfig.token || !githubConfig.gistId) {
      showToast('请先配置GitHub Token和Gist ID')
      return
    }

    setIsSyncing(true)
    setSyncStatus('正在从GitHub Gist下载...')

    try {
      const response = await fetch(`https://api.github.com/gists/${githubConfig.gistId}`, {
        headers: {
          'Authorization': `Bearer ${githubConfig.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      if (!response.ok) {
        throw new Error(`GitHub API错误: ${response.status}`)
      }

      const gist = await response.json()
      const fileContent = gist.files['freeeditor-data.json']?.content

      if (!fileContent) {
        throw new Error('未找到备份数据')
      }

      const data = JSON.parse(fileContent)
      onSyncComplete(data.files, data.folders)

      setSyncStatus('下载成功')
      showToast('文档已从GitHub Gist恢复')
    } catch (error) {
      setSyncStatus('下载失败: ' + (error as Error).message)
      showToast('下载失败，请检查配置')
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncStatus(''), 3000)
    }
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
            <h3>GitHub Gist 云同步</h3>
            <p className="settings-description">
              使用GitHub Gist进行文档云同步。您的所有文档将以私密Gist形式保存到GitHub，支持无限空间和版本历史。
            </p>

            <div className="form-group">
              <label>GitHub Personal Access Token</label>
              <input
                type="password"
                value={githubConfig.token}
                onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                placeholder="请输入GitHub Personal Access Token"
              />
            </div>

            <div className="form-group">
              <label>Gist ID（可选，首次同步后自动生成）</label>
              <input
                type="text"
                value={githubConfig.gistId}
                onChange={(e) => setGithubConfig({ ...githubConfig, gistId: e.target.value })}
                placeholder="首次上传后自动生成"
                disabled={!!githubConfig.gistId}
              />
            </div>

            <div className="settings-help">
              <p>如何获取GitHub Personal Access Token：</p>
              <ol>
                <li>访问 <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Settings → Developer settings → Personal access tokens</a></li>
                <li>点击 "Generate new token (classic)"</li>
                <li>勾选 <code>gist</code> 权限</li>
                <li>生成并复制Token到上方输入框</li>
              </ol>
            </div>

            {syncStatus && (
              <div className={`sync-status ${syncStatus.includes('成功') ? 'success' : syncStatus.includes('失败') ? 'error' : 'info'}`}>
                {syncStatus}
              </div>
            )}

            <div className="settings-actions">
              <button className="btn-secondary" onClick={handleSave}>
                保存配置
              </button>
              <button
                className="btn-secondary"
                onClick={handleDownload}
                disabled={isSyncing || !githubConfig.token || !githubConfig.gistId}
              >
                从云端恢复
              </button>
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={isSyncing || !githubConfig.token}
              >
                {isSyncing ? '同步中...' : '上传到云端'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

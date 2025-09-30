import { useState } from 'react'
import './Sidebar.css'

export default function Sidebar({
  files,
  folders,
  currentFileId,
  onFileSelect,
  onNewFile,
  onNewFolder,
  onDeleteFile,
  onDeleteFolder,
  onUpdateFolder
}) {
  const [expandedFolders, setExpandedFolders] = useState({})
  const [editingFolderId, setEditingFolderId] = useState(null)
  const [editingFolderName, setEditingFolderName] = useState('')

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) return '刚刚'
    if (diff < hour) return Math.floor(diff / minute) + '分钟前'
    if (diff < day) return Math.floor(diff / hour) + '小时前'
    if (diff < 7 * day) return Math.floor(diff / day) + '天前'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  const handleFolderEdit = (folder) => {
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }

  const handleFolderNameSave = (folderId) => {
    if (editingFolderName.trim()) {
      onUpdateFolder(folderId, { name: editingFolderName.trim() })
    }
    setEditingFolderId(null)
  }

  const handleFolderNameKeyDown = (e, folderId) => {
    if (e.key === 'Enter') {
      handleFolderNameSave(folderId)
    } else if (e.key === 'Escape') {
      setEditingFolderId(null)
    }
  }

  // 获取根目录文件（没有文件夹的文件）
  const rootFiles = files.filter(f => !f.folderId)

  // 按更新时间排序文件
  const sortFilesByTime = (fileList) => {
    return [...fileList].sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 32C38 29.7909 39.7909 28 42 28H70L90 48V96C90 98.2091 88.2091 100 86 100H42C39.7909 100 38 98.2091 38 96V32Z"
                  fill="#1890ff" opacity="0.9"/>
            <path d="M70 28V44C70 46.2091 71.7909 48 74 48H90L70 28Z"
                  fill="#1890ff" opacity="0.6"/>
            <line x1="48" y1="58" x2="80" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="48" y1="68" x2="75" y2="68" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="48" y1="78" x2="80" y2="78" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="logo-text">FreeEditor</span>
        </div>
        <div className="header-buttons">
          <button className="btn-icon-small" onClick={onNewFolder} title="新建文件夹">
            📁
          </button>
          <button className="btn-icon" onClick={() => onNewFile(null)} title="新建文档">
            +
          </button>
        </div>
      </div>

      <div className="file-list">
        {/* 文件夹列表 */}
        {folders.map(folder => {
          const folderFiles = sortFilesByTime(files.filter(f => f.folderId === folder.id))
          const isExpanded = expandedFolders[folder.id]

          return (
            <div key={folder.id} className="folder-section">
              <div className="folder-item">
                <div className="folder-header" onClick={() => toggleFolder(folder.id)}>
                  <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
                  {editingFolderId === folder.id ? (
                    <input
                      type="text"
                      className="folder-name-input"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onBlur={() => handleFolderNameSave(folder.id)}
                      onKeyDown={(e) => handleFolderNameKeyDown(e, folder.id)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <span className="folder-name">{folder.name}</span>
                  )}
                  <span className="folder-count">({folderFiles.length})</span>
                </div>
                <div className="folder-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNewFile(folder.id)
                    }}
                    title="新建文档"
                  >
                    +
                  </button>
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFolderEdit(folder)
                    }}
                    title="重命名"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn action-btn-danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteFolder(folder.id)
                    }}
                    title="删除文件夹"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* 文件夹内的文件 */}
              {isExpanded && (
                <div className="folder-files">
                  {folderFiles.map(file => (
                    <div
                      key={file.id}
                      className={`file-item ${file.id === currentFileId ? 'active' : ''}`}
                    >
                      <div className="file-content" onClick={() => onFileSelect(file.id)}>
                        <span className="file-item-name">{file.name}</span>
                        <span className="file-item-time">{formatTime(file.updatedAt)}</span>
                      </div>
                      <button
                        className="file-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteFile(file.id)
                        }}
                        title="删除文档"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* 根目录文件 */}
        {rootFiles.length > 0 && (
          <div className="root-files">
            {sortFilesByTime(rootFiles).map(file => (
              <div
                key={file.id}
                className={`file-item ${file.id === currentFileId ? 'active' : ''}`}
              >
                <div className="file-content" onClick={() => onFileSelect(file.id)}>
                  <span className="file-item-name">{file.name}</span>
                  <span className="file-item-time">{formatTime(file.updatedAt)}</span>
                </div>
                <button
                  className="file-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteFile(file.id)
                  }}
                  title="删除文档"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
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
  onUpdateFolder,
  onMoveFile,
  theme,
  onThemeToggle
}) {
  const [expandedFolders, setExpandedFolders] = useState({})
  const [renamingId, setRenamingId] = useState(null)
  const [renamingName, setRenamingName] = useState('')
  const [renamingType, setRenamingType] = useState(null) // 'file' or 'folder'
  const [contextMenu, setContextMenu] = useState(null)
  const [draggedFileId, setDraggedFileId] = useState(null)
  const [dragOverFolderId, setDragOverFolderId] = useState(null)

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

  // 开始重命名
  const startRename = (id, name, type) => {
    setRenamingId(id)
    setRenamingName(name)
    setRenamingType(type)
  }

  // 完成重命名
  const finishRename = () => {
    if (renamingName.trim() && renamingId) {
      if (renamingType === 'folder') {
        onUpdateFolder(renamingId, { name: renamingName.trim() })
      } else if (renamingType === 'file') {
        const file = files.find(f => f.id === renamingId)
        if (file) {
          // 通过选中文件触发名称更新
          onFileSelect(file.id)
          // 直接调用App的updateFile逻辑
          setTimeout(() => {
            const nameInput = document.querySelector('.file-name-input')
            if (nameInput) {
              nameInput.value = renamingName.trim()
              nameInput.dispatchEvent(new Event('input', { bubbles: true }))
            }
          }, 0)
        }
      }
    }
    setRenamingId(null)
    setRenamingType(null)
  }

  // 处理右键菜单
  const handleContextMenu = (e, id, type, name) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      id,
      type,
      name
    })
  }

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null)
  }

  // 拖拽处理
  const handleDragStart = (e, fileId) => {
    setDraggedFileId(fileId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedFileId(null)
    setDragOverFolderId(null)
  }

  const handleDragOver = (e, folderId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverFolderId(folderId)
  }

  const handleDragLeave = () => {
    setDragOverFolderId(null)
  }

  const handleDrop = (e, targetFolderId) => {
    e.preventDefault()
    if (draggedFileId && draggedFileId !== targetFolderId) {
      onMoveFile(draggedFileId, targetFolderId)
    }
    setDraggedFileId(null)
    setDragOverFolderId(null)
  }

  // 获取根目录文件（没有文件夹的文件）
  const rootFiles = files.filter(f => !f.folderId)

  // 按更新时间排序文件
  const sortFilesByTime = (fileList) => {
    return [...fileList].sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  }

  // 渲染文件图标
  const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.5 1h-12C.675 1 0 1.675 0 2.5v11c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-11c0-.825-.675-1.5-1.5-1.5zM13 13H2V3h11v10z"/>
      <path d="M4 5h7v1H4zm0 2h7v1H4zm0 2h5v1H4z"/>
    </svg>
  )

  // 渲染文件夹图标
  const FolderIcon = ({ isOpen }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      {isOpen ? (
        <path d="M7.5 2L6 4H1.5l-.5.5v8l.5.5h13l.5-.5V5l-.5-.5H8L7.5 2zM7 3h6.5l.5.5v1H2v-1L2.5 3H6l.5 1.5H7V3zm-5 2h12v7H2V5z"/>
      ) : (
        <path d="M7.5 2L6 4H1.5l-.5.5v8l.5.5h13l.5-.5v-7l-.5-.5H8L7.5 2zM7 3h6.5l.5.5V5H2v-.5L2.5 4H6l.5 1.5H7V3z"/>
      )}
    </svg>
  )

  // 渲染展开/折叠箭头
  const ChevronIcon = ({ isExpanded }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="chevron-icon"
      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path d="M6 4l4 4-4 4V4z"/>
    </svg>
  )

  return (
    <div className="sidebar" onClick={closeContextMenu}>
      <div className="sidebar-header">
        <div className="logo-section">
          <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 32C38 29.7909 39.7909 28 42 28H70L90 48V96C90 98.2091 88.2091 100 86 100H42C39.7909 100 38 98.2091 38 96V32Z"
                  fill="#1890ff" opacity="0.9"/>
            <path d="M70 28V44C70 46.2091 71.7909 48 74 48H90L70 28Z"
                  fill="#1890ff" opacity="0.6"/>
            <line x1="48" y1="58" x2="80" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="48" y1="68" x2="75" y2="68" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="48" y1="78" x2="80" y2="78" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="logo-text">FREEEDITOR</span>
        </div>
        <div className="header-actions">
          <button className="action-icon" onClick={() => onNewFile(null)} title="新建文件">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.5 1h-12C.675 1 0 1.675 0 2.5v11c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-11c0-.825-.675-1.5-1.5-1.5zM13 13H2V3h11v10z"/>
              <path d="M7 5h1v6H7z"/>
              <path d="M5 7h6v1H5z"/>
            </svg>
          </button>
          <button className="action-icon" onClick={onNewFolder} title="新建文件夹">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.5 2L6 4H1.5l-.5.5v8l.5.5h13l.5-.5v-7l-.5-.5H8L7.5 2z"/>
              <path d="M7 7h1v4H7z" fill="white"/>
              <path d="M5 8h6v1H5z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="file-list">
        {/* 文件夹列表 */}
        {folders.map(folder => {
          const folderFiles = sortFilesByTime(files.filter(f => f.folderId === folder.id))
          const isExpanded = expandedFolders[folder.id]

          return (
            <div key={folder.id} className="tree-item">
              <div
                className={`tree-node folder-node ${dragOverFolderId === folder.id ? 'drag-over' : ''}`}
                onClick={() => toggleFolder(folder.id)}
                onContextMenu={(e) => handleContextMenu(e, folder.id, 'folder', folder.name)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
              >
                <ChevronIcon isExpanded={isExpanded} />
                <FolderIcon isOpen={isExpanded} />
                {renamingId === folder.id && renamingType === 'folder' ? (
                  <input
                    type="text"
                    className="rename-input"
                    value={renamingName}
                    onChange={(e) => setRenamingName(e.target.value)}
                    onBlur={finishRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishRename()
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span className="tree-label">{folder.name}</span>
                )}
              </div>

              {/* 文件夹内的文件 */}
              {isExpanded && (
                <div className="tree-children">
                  {folderFiles.map(file => (
                    <div
                      key={file.id}
                      className={`tree-node file-node ${file.id === currentFileId ? 'active' : ''} ${draggedFileId === file.id ? 'dragging' : ''}`}
                      onClick={() => onFileSelect(file.id)}
                      onContextMenu={(e) => handleContextMenu(e, file.id, 'file', file.name)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, file.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="tree-indent"></span>
                      <FileIcon />
                      {renamingId === file.id && renamingType === 'file' ? (
                        <input
                          type="text"
                          className="rename-input"
                          value={renamingName}
                          onChange={(e) => setRenamingName(e.target.value)}
                          onBlur={finishRename}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') finishRename()
                            if (e.key === 'Escape') setRenamingId(null)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        <span className="tree-label">{file.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* 根目录文件 */}
        {rootFiles.map(file => (
          <div
            key={file.id}
            className={`tree-node file-node ${file.id === currentFileId ? 'active' : ''} ${draggedFileId === file.id ? 'dragging' : ''}`}
            onClick={() => onFileSelect(file.id)}
            onContextMenu={(e) => handleContextMenu(e, file.id, 'file', file.name)}
            draggable
            onDragStart={(e) => handleDragStart(e, file.id)}
            onDragEnd={handleDragEnd}
          >
            <span className="tree-indent"></span>
            <FileIcon />
            {renamingId === file.id && renamingType === 'file' ? (
              <input
                type="text"
                className="rename-input"
                value={renamingName}
                onChange={(e) => setRenamingName(e.target.value)}
                onBlur={finishRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename()
                  if (e.key === 'Escape') setRenamingId(null)
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span className="tree-label">{file.name}</span>
            )}
          </div>
        ))}
      </div>

      {/* 底部主题切换 */}
      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={onThemeToggle}>
          {theme === 'dark' ? (
            <>
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
              </svg>
              <span>明亮模式</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
              </svg>
              <span>黑夜模式</span>
            </>
          )}
        </button>
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            onClick={() => {
              startRename(contextMenu.id, contextMenu.name, contextMenu.type)
              closeContextMenu()
            }}
          >
            <span>重命名</span>
          </div>
          {contextMenu.type === 'folder' && (
            <div
              className="context-menu-item"
              onClick={() => {
                onNewFile(contextMenu.id)
                closeContextMenu()
              }}
            >
              <span>新建文件</span>
            </div>
          )}
          <div className="context-menu-divider"></div>
          <div
            className="context-menu-item danger"
            onClick={() => {
              if (contextMenu.type === 'folder') {
                onDeleteFolder(contextMenu.id)
              } else {
                onDeleteFile(contextMenu.id)
              }
              closeContextMenu()
            }}
          >
            <span>删除</span>
          </div>
        </div>
      )}
    </div>
  )
}
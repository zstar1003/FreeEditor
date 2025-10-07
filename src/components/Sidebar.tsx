import { useState, DragEvent, MouseEvent, KeyboardEvent } from 'react'
import JSZip from 'jszip'
import { FileItem, FolderItem } from '../types'
import logoImg from '/logo.png'
import './Sidebar.css'

interface SidebarProps {
  files: FileItem[]
  folders: FolderItem[]
  currentFileId: string | null
  onFileSelect: (id: string) => void
  onNewFile: (folderId: string | null) => void
  onNewFolder: () => void
  onDeleteFile: (id: string) => void
  onDeleteFolder: (id: string) => void
  onUpdateFolder: (id: string, updates: Partial<FolderItem>) => void
  onMoveFile: (fileId: string | string[], targetFolderId: string | null) => void
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  onSettingsClick: () => void
}

interface ContextMenuState {
  x: number
  y: number
  id: string | null
  type: 'file' | 'folder' | 'blank'
  name: string
}

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
  onThemeToggle,
  onSettingsClick
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renamingName, setRenamingName] = useState('')
  const [renamingType, setRenamingType] = useState<'file' | 'folder' | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null)

  // 多选功能
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

  const formatTime = (date: string) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) return '刚刚'
    if (diff < hour) return Math.floor(diff / minute) + '分钟前'
    if (diff < day) return Math.floor(diff / hour) + '小时前'
    if (diff < 7 * day) return Math.floor(diff / day) + '天前'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  // 处理文件点击（支持多选）
  const handleFileClick = (fileId: string, event: MouseEvent) => {
    const allFiles = [...files].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    const fileIds = allFiles.map(f => f.id)

    if (event.shiftKey && lastSelectedId) {
      // Shift + 点击：连选
      event.preventDefault()
      const lastIndex = fileIds.indexOf(lastSelectedId)
      const currentIndex = fileIds.indexOf(fileId)
      const start = Math.min(lastIndex, currentIndex)
      const end = Math.max(lastIndex, currentIndex)
      const rangeIds = fileIds.slice(start, end + 1)

      const newSelected = new Set(selectedFileIds)
      rangeIds.forEach(id => newSelected.add(id))
      setSelectedFileIds(newSelected)
      // Shift 选择不打开文件，只选中
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + 点击：多选/取消选择
      event.preventDefault()
      const newSelected = new Set(selectedFileIds)
      if (newSelected.has(fileId)) {
        newSelected.delete(fileId)
        // 如果取消选择的是当前文件，不改变编辑器
      } else {
        newSelected.add(fileId)
      }
      setSelectedFileIds(newSelected)
      setLastSelectedId(fileId)
      // Ctrl 选择不打开文件，只选中
    } else {
      // 普通点击：清除多选，选中并打开当前文件
      setSelectedFileIds(new Set())
      setLastSelectedId(fileId)
      onFileSelect(fileId)
    }
  }

  // 清除多选
  const clearSelection = () => {
    setSelectedFileIds(new Set())
    setLastSelectedId(null)
  }

  // 批量删除选中的文件
  const handleBatchDelete = () => {
    if (selectedFileIds.size === 0) return

    const confirmMsg = `确定要删除选中的 ${selectedFileIds.size} 个文档吗？此操作无法撤销。`
    if (confirm(confirmMsg)) {
      selectedFileIds.forEach(fileId => {
        onDeleteFile(fileId)
      })
      clearSelection()
    }
  }

  // 批量下载选中的文件
  const handleBatchDownload = async () => {
    if (selectedFileIds.size === 0) return

    const selectedFiles = files.filter(f => selectedFileIds.has(f.id))

    if (selectedFiles.length === 1) {
      // 单个文件直接下载
      downloadFile(selectedFiles[0].id)
    } else {
      // 多个文件打包下载
      const zip = new JSZip()

      selectedFiles.forEach(file => {
        zip.file(`${file.name}.md`, file.content)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `批量下载_${selectedFiles.length}个文档.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // 批量移动选中的文件
  const handleBatchMove = (targetFolderId: string | null) => {
    if (selectedFileIds.size === 0) return

    const fileIdsToMove = Array.from(selectedFileIds)
    onMoveFile(fileIdsToMove, targetFolderId)
    clearSelection()
  }

  // 开始重命名
  const startRename = (id: string, name: string, type: 'file' | 'folder') => {
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
            const nameInput = document.querySelector('.file-name-input') as HTMLInputElement
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
  const handleContextMenu = (e: MouseEvent, id: string | null, type: 'file' | 'folder' | 'blank', name: string) => {
    e.preventDefault()
    e.stopPropagation()

    // 如果右键点击的是文件，且该文件不在已选中的列表中，将其加入选中
    if (type === 'file' && id && !selectedFileIds.has(id)) {
      setSelectedFileIds(new Set([id]))
      setLastSelectedId(id)
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      id,
      type,
      name
    })
  }

  // 处理空白区域右键菜单
  const handleBlankContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      id: null,
      type: 'blank',
      name: ''
    })
  }

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null)
  }

  // 下载单个文件为 .md
  const downloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    const blob = new Blob([file.content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 下载文件夹为 ZIP
  const downloadFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return

    const folderFiles = files.filter(f => f.folderId === folderId)
    if (folderFiles.length === 0) {
      alert('文件夹为空，无法下载')
      return
    }

    const zip = new JSZip()

    // 将文件夹中的所有文件添加到 ZIP
    folderFiles.forEach(file => {
      zip.file(`${file.name}.md`, file.content)
    })

    // 生成 ZIP 文件
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${folder.name}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 处理下载
  const handleDownload = async () => {
    if (!contextMenu) return

    if (contextMenu.type === 'file') {
      downloadFile(contextMenu.id)
    } else {
      await downloadFolder(contextMenu.id)
    }
    closeContextMenu()
  }

  // 拖拽处理
  const handleDragStart = (e: DragEvent, fileId: string) => {
    // 如果拖拽的文件不在选中列表中，只拖拽当前文件
    if (!selectedFileIds.has(fileId)) {
      setDraggedFileId(fileId)
      setSelectedFileIds(new Set([fileId]))
    } else {
      // 如果拖拽的是已选中的文件，拖拽所有选中的文件
      setDraggedFileId(fileId)
    }
    e.dataTransfer.effectAllowed = 'move'

    // 创建自定义拖拽图像，显示拖拽的文件数量
    const dragCount = selectedFileIds.has(fileId) ? selectedFileIds.size : 1
    if (dragCount > 1) {
      const dragImage = document.createElement('div')
      dragImage.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        background: #37373d;
        color: #cccccc;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `
      dragImage.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2.5 1.5A1.5 1.5 0 0 1 4 0h5.586a1.5 1.5 0 0 1 1.06.44l2.914 2.914a1.5 1.5 0 0 1 .44 1.06V13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13V2.5zm7.5.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 0-1.5H11V2.75a.75.75 0 0 0-.75-.75h-.25z"/>
        </svg>
        <span>${dragCount} 个文档</span>
      `
      document.body.appendChild(dragImage)
      e.dataTransfer.setDragImage(dragImage, 0, 0)
      setTimeout(() => document.body.removeChild(dragImage), 0)
    }
  }

  const handleDragEnd = () => {
    setDraggedFileId(null)
    setDragOverFolderId(null)
  }

  const handleDragOver = (e: DragEvent, folderId: string | null) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverFolderId(folderId)
  }

  const handleDragLeave = () => {
    setDragOverFolderId(null)
  }

  const handleDrop = (e: DragEvent, targetFolderId: string | null) => {
    e.preventDefault()

    if (draggedFileId) {
      // 如果有多个选中的文件，批量移动
      if (selectedFileIds.size > 1) {
        const fileIdsToMove = Array.from(selectedFileIds).filter(id => id !== targetFolderId)
        onMoveFile(fileIdsToMove, targetFolderId)
        clearSelection()
      } else {
        // 单个文件移动
        if (draggedFileId !== targetFolderId) {
          onMoveFile(draggedFileId, targetFolderId)
        }
      }
    }

    setDraggedFileId(null)
    setDragOverFolderId(null)
  }

  // 获取根目录文件（没有文件夹的文件）
  const rootFiles = files.filter(f => !f.folderId)

  // 按更新时间排序文件
  const sortFilesByTime = (fileList: FileItem[]) => {
    return [...fileList].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
  const FolderIcon = ({ isOpen }: { isOpen?: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      {isOpen ? (
        <path d="M7.5 2L6 4H1.5l-.5.5v8l.5.5h13l.5-.5V5l-.5-.5H8L7.5 2zM7 3h6.5l.5.5v1H2v-1L2.5 3H6l.5 1.5H7V3zm-5 2h12v7H2V5z"/>
      ) : (
        <path d="M7.5 2L6 4H1.5l-.5.5v8l.5.5h13l.5-.5v-7l-.5-.5H8L7.5 2zM7 3h6.5l.5.5V5H2v-.5L2.5 4H6l.5 1.5H7V3z"/>
      )}
    </svg>
  )

  // 渲染展开/折叠箭头
  const ChevronIcon = ({ isExpanded }: { isExpanded?: boolean }) => (
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
    <div className={`sidebar ${theme}`} onClick={closeContextMenu}>
      <div className="sidebar-header">
        <div className="logo-section">
          <img src={logoImg} alt="Logo" width="20" height="20" />
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

      <div className="file-list" onContextMenu={handleBlankContextMenu}>
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
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
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
                  {folderFiles.map(file => {
                    const isSelected = selectedFileIds.has(file.id)
                    const isActive = file.id === currentFileId && selectedFileIds.size === 0
                    return (
                      <div
                        key={file.id}
                        className={`tree-node file-node ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${draggedFileId === file.id ? 'dragging' : ''}`}
                        onClick={(e) => handleFileClick(file.id, e)}
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
                          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
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
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* 根目录文件 */}
        {rootFiles.map(file => {
          const isSelected = selectedFileIds.has(file.id)
          const isActive = file.id === currentFileId && selectedFileIds.size === 0
          return (
            <div
              key={file.id}
              className={`tree-node file-node ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${draggedFileId === file.id ? 'dragging' : ''}`}
              onClick={(e) => handleFileClick(file.id, e)}
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
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
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
          )
        })}
      </div>

      {/* 底部主题切换和设置 */}
      <div className="sidebar-footer">
        <button className="settings-btn" onClick={onSettingsClick} title="设置">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
          </svg>
        </button>
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
          {contextMenu.type === 'blank' ? (
            <>
              <div
                className="context-menu-item"
                onClick={() => {
                  onNewFile(null)
                  closeContextMenu()
                }}
              >
                <span>新建文件</span>
              </div>
              <div
                className="context-menu-item"
                onClick={() => {
                  onNewFolder()
                  closeContextMenu()
                }}
              >
                <span>新建文件夹</span>
              </div>
            </>
          ) : (
            <>
              {/* 如果选中了多个文件，显示批量操作菜单 */}
              {contextMenu.type === 'file' && selectedFileIds.size > 1 ? (
                <>
                  <div
                    className="context-menu-item"
                    onClick={async () => {
                      await handleBatchDownload()
                      closeContextMenu()
                    }}
                  >
                    <span>下载选中的 {selectedFileIds.size} 个文档</span>
                  </div>
                  <div className="context-menu-divider"></div>
                  <div
                    className="context-menu-item danger"
                    onClick={() => {
                      handleBatchDelete()
                      closeContextMenu()
                    }}
                  >
                    <span>删除选中的 {selectedFileIds.size} 个文档</span>
                  </div>
                  <div
                    className="context-menu-item"
                    onClick={() => {
                      clearSelection()
                      closeContextMenu()
                    }}
                  >
                    <span>取消选择</span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="context-menu-item"
                    onClick={() => {
                      if (contextMenu.id) {
                        startRename(contextMenu.id, contextMenu.name, contextMenu.type as 'file' | 'folder')
                      }
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
                  <div
                    className="context-menu-item"
                    onClick={handleDownload}
                  >
                    <span>下载</span>
                  </div>
                  <div className="context-menu-divider"></div>
                  <div
                    className="context-menu-item danger"
                    onClick={() => {
                      if (contextMenu.id) {
                        if (contextMenu.type === 'folder') {
                          onDeleteFolder(contextMenu.id)
                        } else {
                          onDeleteFile(contextMenu.id)
                        }
                      }
                      closeContextMenu()
                    }}
                  >
                    <span>删除</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

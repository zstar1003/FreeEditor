import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Modal from './components/Modal'
import Settings from './components/Settings'
import useLocalStorage from './hooks/useLocalStorage'
import { FileItem, FolderItem, ModalState } from './types'
import { syncWithOSS } from './utils/ossBackup'
import './App.css'

function App() {
  const [files, setFiles] = useLocalStorage<FileItem[]>('mdFiles', [])
  const [folders, setFolders] = useLocalStorage<FolderItem[]>('mdFolders', [])
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null)
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark')
  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', message: '', onConfirm: null })
  const [showSettings, setShowSettings] = useState(false)

  const syncIntervalRef = useRef<number | null>(null)
  const [autoSyncConfig] = useLocalStorage<{ enabled: boolean, interval: number }>('autoSyncConfig', {
    enabled: false,
    interval: 5
  })

  // 初始化：如果没有文件和文件夹，创建默认结构
  useEffect(() => {
    if (files.length === 0 && folders.length === 0) {
      createNewFile(null)
    } else if (currentFileId === null && files.length > 0) {
      setCurrentFileId(files[0].id)
    }
  }, [])

  // 当currentFileId变化时，更新currentFile
  useEffect(() => {
    if (currentFileId) {
      const file = files.find(f => f.id === currentFileId)
      setCurrentFile(file || null)
    }
  }, [currentFileId, files])

  // 自动同步定时器
  useEffect(() => {
    // 清除之前的定时器
    if (syncIntervalRef.current !== null) {
      clearInterval(syncIntervalRef.current)
      syncIntervalRef.current = null
    }

    // 如果启用自动同步，设置定时器
    if (autoSyncConfig.enabled) {
      const performSync = async () => {
        try {
          const result = await syncWithOSS(files, folders)
          if (result.hasChanges) {
            setFiles(result.files)
            setFolders(result.folders)
            console.log('Auto sync completed with changes')
          }
        } catch (error) {
          console.error('Auto sync failed:', error)
        }
      }

      // 立即执行一次同步
      performSync()

      // 设置定时同步
      syncIntervalRef.current = window.setInterval(
        performSync,
        autoSyncConfig.interval * 60 * 1000 // 转换为毫秒
      )
    }

    // 清理函数
    return () => {
      if (syncIntervalRef.current !== null) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [autoSyncConfig.enabled, autoSyncConfig.interval])

  const createNewFile = (folderId: string | null) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: '未命名文档',
      content: '# 新文档\\n\\n开始编写你的内容...',
      folderId: folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setFiles([...files, newFile])
    setCurrentFileId(newFile.id)
  }

  const createNewFolder = () => {
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: '新文件夹',
      createdAt: new Date().toISOString()
    }

    setFolders([...folders, newFolder])
  }

  const updateFile = (fileId: string, updates: Partial<FileItem>) => {
    setFiles(files.map(f =>
      f.id === fileId
        ? { ...f, ...updates, updatedAt: new Date().toISOString() }
        : f
    ))
  }

  const updateFolder = (folderId: string, updates: Partial<FolderItem>) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, ...updates } : f
    ))
  }

  const deleteFile = (fileId: string) => {
    setModal({
      isOpen: true,
      title: '删除文档',
      message: '确定要删除这个文档吗？此操作无法撤销。',
      onConfirm: () => {
        const newFiles = files.filter(f => f.id !== fileId)
        setFiles(newFiles)

        if (fileId === currentFileId) {
          const remainingFiles = newFiles.filter(f => !f.folderId || folders.find(folder => folder.id === f.folderId))
          setCurrentFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null)
          setCurrentFile(null)
        }
        setModal({ ...modal, isOpen: false })
      }
    })
  }

  const deleteFolder = (folderId: string) => {
    const folderFiles = files.filter(f => f.folderId === folderId)
    const message = folderFiles.length > 0
      ? `此文件夹包含 ${folderFiles.length} 个文档，确定要删除吗？此操作无法撤销。`
      : '确定要删除这个文件夹吗？此操作无法撤销。'

    setModal({
      isOpen: true,
      title: '删除文件夹',
      message: message,
      onConfirm: () => {
        // 删除文件夹下的所有文件
        const newFiles = files.filter(f => f.folderId !== folderId)
        setFiles(newFiles)
        setFolders(folders.filter(f => f.id !== folderId))

        // 如果当前文件被删除，切换到其他文件
        if (currentFile && currentFile.folderId === folderId) {
          setCurrentFileId(newFiles.length > 0 ? newFiles[0].id : null)
          setCurrentFile(null)
        }
        setModal({ ...modal, isOpen: false })
      }
    })
  }

  const handleContentChange = (content: string) => {
    if (currentFileId) {
      updateFile(currentFileId, { content })
    }
  }

  const handleNameChange = (name: string) => {
    if (currentFileId) {
      updateFile(currentFileId, { name })
    }
  }

  const moveFileToFolder = (fileId: string, targetFolderId: string | null) => {
    setFiles(files.map(f =>
      f.id === fileId
        ? { ...f, folderId: targetFolderId, updatedAt: new Date().toISOString() }
        : f
    ))
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSyncComplete = (syncedFiles: FileItem[], syncedFolders: FolderItem[]) => {
    setFiles(syncedFiles)
    setFolders(syncedFolders)
    // 如果当前选中的文件不在同步的文件中，清空选择
    if (currentFileId && !syncedFiles.find(f => f.id === currentFileId)) {
      setCurrentFileId(syncedFiles.length > 0 ? syncedFiles[0].id : null)
    }
  }

  return (
    <div className={`app ${theme}`}>
      <Sidebar
        files={files}
        folders={folders}
        currentFileId={currentFileId}
        onFileSelect={setCurrentFileId}
        onNewFile={createNewFile}
        onNewFolder={createNewFolder}
        onDeleteFile={deleteFile}
        onDeleteFolder={deleteFolder}
        onUpdateFolder={updateFolder}
        onMoveFile={moveFileToFolder}
        theme={theme}
        onThemeToggle={toggleTheme}
        onSettingsClick={() => setShowSettings(true)}
      />
      <Editor
        file={currentFile}
        onContentChange={handleContentChange}
        onNameChange={handleNameChange}
      />
      <Preview
        content={currentFile?.content || ''}
        theme={theme}
      />
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ ...modal, isOpen: false })}
      />
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        files={files}
        folders={folders}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  )
}

export default App

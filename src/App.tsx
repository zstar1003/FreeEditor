import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Modal from './components/Modal'
import Settings from './components/Settings'
import useLocalStorage from './hooks/useLocalStorage'
import { FileItem, FolderItem, ModalState, StyleTemplate } from './types'
import { syncWithOSS } from './utils/ossBackup'
import { dbManager } from './utils/indexedDB'
import './App.css'

function App() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null)
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light')
  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', message: '', onConfirm: null })
  const [showSettings, setShowSettings] = useState(false)
  const [styleTemplates, setStyleTemplates] = useState<StyleTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const syncIntervalRef = useRef<number | null>(null)
  const filesRef = useRef<FileItem[]>(files)
  const foldersRef = useRef<FolderItem[]>(folders)

  const [autoSyncConfig] = useLocalStorage<{ enabled: boolean, interval: number }>('autoSyncConfig', {
    enabled: false,
    interval: 5
  })

  // 初始化：从 IndexedDB 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 等待数据库初始化
        await dbManager.init()

        // 尝试从 IndexedDB 加载数据
        const loadedFiles = await dbManager.getAllFiles()
        const loadedFolders = await dbManager.getAllFolders()

        // 如果 IndexedDB 为空，尝试从 localStorage 迁移
        if (loadedFiles.length === 0 && loadedFolders.length === 0) {
          const oldFiles = localStorage.getItem('mdFiles')
          const oldFolders = localStorage.getItem('mdFolders')

          if (oldFiles || oldFolders) {
            console.log('Migrating data from localStorage to IndexedDB...')
            const files = oldFiles ? JSON.parse(oldFiles) : []
            const folders = oldFolders ? JSON.parse(oldFolders) : []

            await dbManager.replaceAllData(files, folders)
            setFiles(files)
            setFolders(folders)

            // 迁移完成后，可以选择清理 localStorage（可选）
            // localStorage.removeItem('mdFiles')
            // localStorage.removeItem('mdFolders')
            console.log('Migration completed')
          } else {
            setFiles([])
            setFolders([])
          }
        } else {
          setFiles(loadedFiles)
          setFolders(loadedFolders)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        // 如果 IndexedDB 失败，回退到 localStorage
        const oldFiles = localStorage.getItem('mdFiles')
        const oldFolders = localStorage.getItem('mdFolders')
        setFiles(oldFiles ? JSON.parse(oldFiles) : [])
        setFolders(oldFolders ? JSON.parse(oldFolders) : [])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 保持 ref 和最新的 files/folders 同步
  useEffect(() => {
    filesRef.current = files
    foldersRef.current = folders
  }, [files, folders])

  // 当 files 或 folders 变化时，保存到 IndexedDB
  useEffect(() => {
    if (isLoading) return // 初始化加载时不保存

    const saveData = async () => {
      try {
        await dbManager.replaceAllData(files, folders)
      } catch (error) {
        console.error('Failed to save data to IndexedDB:', error)
      }
    }

    saveData()
  }, [files, folders, isLoading])

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
          // 使用 ref 获取最新的 files 和 folders
          const result = await syncWithOSS(filesRef.current, foldersRef.current)
          if (result.hasChanges) {
            setFiles(result.files)
            setFolders(result.folders)
            console.log('Auto sync completed with changes')
          } else {
            console.log('Auto sync completed, no changes')
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

      console.log(`Auto sync enabled, interval: ${autoSyncConfig.interval} minutes`)
    } else {
      console.log('Auto sync disabled')
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
      content: '# 新文档',
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

  const deleteFile = (fileId: string | string[]) => {
    // 支持单个或批量删除
    const fileIds = Array.isArray(fileId) ? fileId : [fileId]

    // 批量删除不显示确认框（在 Sidebar 中已经确认过了）
    if (Array.isArray(fileId)) {
      const newFiles = files.filter(f => !fileIds.includes(f.id))
      setFiles(newFiles)

      // 如果当前文件被删除，切换到其他文件
      if (currentFileId && fileIds.includes(currentFileId)) {
        const remainingFiles = newFiles.filter(f => !f.folderId || folders.find(folder => folder.id === f.folderId))
        setCurrentFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null)
        setCurrentFile(null)
      }
    } else {
      // 单个删除显示确认框
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

  const moveFileToFolder = (fileId: string | string[], targetFolderId: string | null) => {
    // 支持单个文件或多个文件
    const fileIds = Array.isArray(fileId) ? fileId : [fileId]

    setFiles(files.map(f =>
      fileIds.includes(f.id)
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

  // 显示加载状态
  if (isLoading) {
    return (
      <div className={`app ${theme}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', color: theme === 'dark' ? '#cccccc' : '#333' }}>
          <div style={{ fontSize: '18px', marginBottom: '12px' }}>加载中...</div>
          <div style={{ fontSize: '14px', color: theme === 'dark' ? '#858585' : '#666' }}>正在从 IndexedDB 读取数据</div>
        </div>
      </div>
    )
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
        theme={theme}
      />
      <Preview
        content={currentFile?.content || ''}
        theme={theme}
        onStyleTemplatesChange={setStyleTemplates}
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

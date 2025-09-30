import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Preview from './components/Preview'
import useLocalStorage from './hooks/useLocalStorage'
import './App.css'

function App() {
  const [files, setFiles] = useLocalStorage('mdFiles', [])
  const [folders, setFolders] = useLocalStorage('mdFolders', [])
  const [currentFileId, setCurrentFileId] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)

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
      setCurrentFile(file)
    }
  }, [currentFileId, files])

  const createNewFile = (folderId) => {
    const newFile = {
      id: Date.now().toString(),
      name: '未命名文档',
      content: '# 新文档\n\n开始编写你的内容...',
      folderId: folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setFiles([...files, newFile])
    setCurrentFileId(newFile.id)
  }

  const createNewFolder = () => {
    const newFolder = {
      id: Date.now().toString(),
      name: '新文件夹',
      createdAt: new Date().toISOString()
    }

    setFolders([...folders, newFolder])
  }

  const updateFile = (fileId, updates) => {
    setFiles(files.map(f =>
      f.id === fileId
        ? { ...f, ...updates, updatedAt: new Date().toISOString() }
        : f
    ))
  }

  const updateFolder = (folderId, updates) => {
    setFolders(folders.map(f =>
      f.id === folderId ? { ...f, ...updates } : f
    ))
  }

  const deleteFile = (fileId) => {
    if (!window.confirm('确定要删除这个文档吗？')) return

    const newFiles = files.filter(f => f.id !== fileId)
    setFiles(newFiles)

    if (fileId === currentFileId) {
      const remainingFiles = newFiles.filter(f => !f.folderId || folders.find(folder => folder.id === f.folderId))
      setCurrentFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null)
      setCurrentFile(null)
    }
  }

  const deleteFolder = (folderId) => {
    const folderFiles = files.filter(f => f.folderId === folderId)

    if (folderFiles.length > 0) {
      if (!window.confirm(`此文件夹包含 ${folderFiles.length} 个文档，确定要删除吗？`)) return
    } else {
      if (!window.confirm('确定要删除这个文件夹吗？')) return
    }

    // 删除文件夹下的所有文件
    const newFiles = files.filter(f => f.folderId !== folderId)
    setFiles(newFiles)
    setFolders(folders.filter(f => f.id !== folderId))

    // 如果当前文件被删除，切换到其他文件
    if (currentFile && currentFile.folderId === folderId) {
      setCurrentFileId(newFiles.length > 0 ? newFiles[0].id : null)
      setCurrentFile(null)
    }
  }

  const handleContentChange = (content) => {
    if (currentFileId) {
      updateFile(currentFileId, { content })
    }
  }

  const handleNameChange = (name) => {
    if (currentFileId) {
      updateFile(currentFileId, { name })
    }
  }

  return (
    <div className="app">
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
      />
      <Editor
        file={currentFile}
        onContentChange={handleContentChange}
        onNameChange={handleNameChange}
      />
      <Preview
        content={currentFile?.content || ''}
      />
    </div>
  )
}

export default App
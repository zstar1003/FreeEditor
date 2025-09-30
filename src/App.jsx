import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Preview from './components/Preview'
import useLocalStorage from './hooks/useLocalStorage'
import './App.css'

function App() {
  const [files, setFiles] = useLocalStorage('mdFiles', [])
  const [currentFileId, setCurrentFileId] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)

  // 初始化：如果没有文件，创建默认文件
  useEffect(() => {
    if (files.length === 0) {
      createNewFile()
    } else if (currentFileId === null) {
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

  const createNewFile = () => {
    const newFile = {
      id: Date.now().toString(),
      name: '未命名文档',
      content: '# 新文档\n\n开始编写你的内容...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setFiles([...files, newFile])
    setCurrentFileId(newFile.id)
  }

  const updateFile = (fileId, updates) => {
    setFiles(files.map(f =>
      f.id === fileId
        ? { ...f, ...updates, updatedAt: new Date().toISOString() }
        : f
    ))
  }

  const deleteFile = (fileId) => {
    if (!window.confirm('确定要删除这个文档吗？')) return

    const newFiles = files.filter(f => f.id !== fileId)
    setFiles(newFiles)

    if (fileId === currentFileId) {
      setCurrentFileId(newFiles.length > 0 ? newFiles[0].id : null)
      if (newFiles.length === 0) {
        createNewFile()
      }
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
        currentFileId={currentFileId}
        onFileSelect={setCurrentFileId}
        onNewFile={createNewFile}
      />
      <Editor
        file={currentFile}
        onContentChange={handleContentChange}
        onNameChange={handleNameChange}
        onDelete={() => currentFileId && deleteFile(currentFileId)}
      />
      <Preview
        content={currentFile?.content || ''}
      />
    </div>
  )
}

export default App
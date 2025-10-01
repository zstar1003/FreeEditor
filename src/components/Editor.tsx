import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { FileItem } from '../types'
import './Editor.css'

interface EditorProps {
  file: FileItem | null
  onContentChange: (content: string) => void
  onNameChange: (name: string) => void
}

export default function Editor({ file, onContentChange, onNameChange }: EditorProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (file) {
      setName(file.name)
      setContent(file.content)
    }
  }, [file?.id])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // 防抖保存
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      onNameChange(newName || '未命名文档')
    }, 500)
  }

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // 防抖保存
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      onContentChange(newContent)
    }, 500)
  }

  const handleSave = () => {
    onNameChange(name || '未命名文档')
    onContentChange(content)
    showToast('保存成功')
  }

  const showToast = (message: string) => {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.className = 'toast'
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 2000)
  }

  if (!file) {
    return (
      <div className="editor-panel">
        <div className="empty-state">请选择或创建一个文档</div>
      </div>
    )
  }

  return (
    <div className="editor-panel">
      <div className="panel-header">
        <input
          type="text"
          className="file-name-input"
          value={name}
          onChange={handleNameChange}
          placeholder="未命名文档"
        />
      </div>
      <textarea
        className="editor-textarea"
        value={content}
        onChange={handleContentChange}
        placeholder="在此输入Markdown内容..."
      />
    </div>
  )
}

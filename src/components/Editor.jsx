import { useState, useEffect, useRef } from 'react'
import './Editor.css'

export default function Editor({ file, onContentChange, onNameChange, onDelete }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (file) {
      setName(file.name)
      setContent(file.content)
    }
  }, [file?.id])

  const handleNameChange = (e) => {
    const newName = e.target.value
    setName(newName)

    // 防抖保存
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onNameChange(newName || '未命名文档')
    }, 500)
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)

    // 防抖保存
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onContentChange(newContent)
    }, 500)
  }

  const handleSave = () => {
    onNameChange(name || '未命名文档')
    onContentChange(content)
    showToast('保存成功')
  }

  const showToast = (message) => {
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
        <div className="toolbar">
          <button className="btn" onClick={handleSave}>保存</button>
          <button className="btn btn-danger" onClick={onDelete}>删除</button>
        </div>
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
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { FileItem } from '../types'
import { uploadImageToOSS } from '../utils/ossUpload'
import './Editor.css'

interface EditorProps {
  file: FileItem | null
  onContentChange: (content: string) => void
  onNameChange: (name: string) => void
}

export default function Editor({ file, onContentChange, onNameChange }: EditorProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newContent = content.substring(0, start) + '   ' + content.substring(end)

      setContent(newContent)
      onContentChange(newContent)

      // 设置光标位置
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3
      }, 0)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // 检查是否是图片
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          await uploadImage(file)
        }
        return
      }
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.indexOf('image') !== -1) {
        await uploadImage(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    showToast('正在上传图片...')

    try {
      const url = await uploadImageToOSS(file)

      // 在光标位置插入图片Markdown语法
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const imageMarkdown = `![${file.name}](${url})`
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end)

        setContent(newContent)
        onContentChange(newContent)

        // 设置光标位置到图片markdown之后
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length
          textarea.focus()
        }, 0)
      }

      showToast('图片上传成功')
    } catch (error) {
      console.error('Upload error:', error)
      showToast('图片上传失败: ' + (error as Error).message)
    } finally {
      setIsUploading(false)
    }
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
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder="在此输入Markdown内容...&#10;&#10;💡 提示：可以直接粘贴或拖拽图片上传到OSS"
        disabled={isUploading}
      />
    </div>
  )
}

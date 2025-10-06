import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { FileItem } from '../types'
import { uploadImageToOSS } from '../utils/ossUpload'
import './Editor.css'

interface EditorProps {
  file: FileItem | null
  onContentChange: (content: string) => void
  onNameChange: (name: string) => void
  theme?: 'dark' | 'light'
}

interface ToolbarPosition {
  top: number
  left: number
}

export default function Editor({ file, onContentChange, onNameChange, theme = 'dark' }: EditorProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({ top: 0, left: 0 })
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

  // 处理文本选择
  const handleSelect = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // 如果有选中文本，显示工具栏
    if (start !== end) {
      const textBeforeCursor = content.substring(0, start)
      const lines = textBeforeCursor.split('\n')
      const currentLineIndex = lines.length - 1
      const currentLineText = lines[currentLineIndex]

      const rect = textarea.getBoundingClientRect()
      const style = window.getComputedStyle(textarea)
      const lineHeight = parseInt(style.lineHeight)
      const fontSize = parseInt(style.fontSize)

      // 估算字符宽度（等宽字体）
      const charWidth = fontSize * 0.6

      // 计算工具栏位置：在选中文本第一个字的上方，稍微靠右靠下
      const topPosition = rect.top + (currentLineIndex * lineHeight) - textarea.scrollTop - 20
      const leftPosition = rect.left + (currentLineText.length * charWidth) + 100

      setToolbarPosition({
        top: topPosition,
        left: leftPosition
      })
      setShowToolbar(true)
    } else {
      setShowToolbar(false)
    }
  }

  // 应用格式化
  const applyFormat = (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    if (!selectedText) return

    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `<u>${selectedText}</u>`
        break
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
    onContentChange(newContent)

    // 恢复光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start
      textarea.selectionEnd = start + formattedText.length
    }, 0)

    setShowToolbar(false)
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
      <div className={`editor-panel ${theme}`}>
        <div className="empty-state">请选择或创建一个文档</div>
      </div>
    )
  }

  return (
    <div className={`editor-panel ${theme}`}>
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
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder="在此输入Markdown内容...&#10;&#10;💡 提示：可以直接粘贴或拖拽图片上传到OSS"
        disabled={isUploading}
      />

      {/* 浮动格式化工具栏 */}
      {showToolbar && (
        <div
          className="format-toolbar"
          style={{
            position: 'fixed',
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            className="format-btn"
            onClick={() => applyFormat('bold')}
            title="加粗 (Ctrl+B)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2h5a3.5 3.5 0 0 1 2.427 6.038A3.5 3.5 0 0 1 9.5 14H4V2zm1.5 1.5v4h4a2 2 0 0 0 0-4h-4zm0 5.5v4h4a2 2 0 0 0 0-4h-4z"/>
            </svg>
          </button>
          <button
            className="format-btn"
            onClick={() => applyFormat('italic')}
            title="斜体 (Ctrl+I)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.5 2h5v1h-2l-3 10h2v1h-5v-1h2l3-10h-2V2z"/>
            </svg>
          </button>
          <button
            className="format-btn"
            onClick={() => applyFormat('underline')}
            title="下划线 (Ctrl+U)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 13c2.761 0 5-2.239 5-5V2H11v6c0 1.654-1.346 3-3 3S5 9.654 5 8V2H3v6c0 2.761 2.239 5 5 5zM3 14h10v1H3v-1z"/>
            </svg>
          </button>
          <button
            className="format-btn"
            onClick={() => applyFormat('strikethrough')}
            title="删除线"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 8h12v1H2V8zm6-6c-2.206 0-4 1.794-4 4h2c0-1.103.897-2 2-2s2 .897 2 2c0 .552-.224 1.052-.586 1.414L8 8.828l1.414 1.414C9.776 9.88 10 9.38 10 8.828c0-2.206-1.794-4-4-4zm0 12c2.206 0 4-1.794 4-4h-2c0 1.103-.897 2-2 2s-2-.897-2-2H4c0 2.206 1.794 4 4 4z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

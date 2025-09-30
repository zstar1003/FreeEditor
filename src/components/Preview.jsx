import { useEffect, useRef } from 'react'
import { marked } from 'marked'
import './Preview.css'

export default function Preview({ content }) {
  const previewRef = useRef(null)

  useEffect(() => {
    if (previewRef.current) {
      try {
        const html = marked.parse(content || '')
        previewRef.current.innerHTML = html
      } catch (error) {
        previewRef.current.innerHTML = `<p style="color: red;">渲染错误: ${error.message}</p>`
      }
    }
  }, [content])

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>预览</h3>
      </div>
      <div ref={previewRef} className="markdown-body"></div>
    </div>
  )
}
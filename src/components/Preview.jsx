import { useEffect, useRef, useState } from 'react'
import { marked } from 'marked'
import './Preview.css'

export default function Preview({ content }) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    const html = content ? marked.parse(content) : ''
    setHtmlContent(html)
  }, [content])

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>预览</h3>
        <button
          className="preview-toggle-btn"
          onClick={() => setIsMobileView(!isMobileView)}
          title={isMobileView ? '桌面预览' : '手机预览'}
        >
          {isMobileView ? (
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-11zM1.5 1a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-13z"/>
              <path d="M0 14.5A1.5 1.5 0 0 1 1.5 13h13a1.5 1.5 0 0 1 1.5 1.5v1a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-1z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
              <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          )}
        </button>
      </div>
      <div className={`preview-container ${isMobileView ? 'mobile-view' : ''}`}>
        {isMobileView ? (
          <div className="phone-frame">
            <div className="phone-content markdown-body" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            <div className="phone-home-indicator"></div>
          </div>
        ) : (
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
        )}
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { marked } from 'marked'
import './Preview.css'

interface PreviewProps {
  content: string
}

export default function Preview({ content }: PreviewProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    const html = content ? marked.parse(content) as string : ''
    setHtmlContent(html)
  }, [content])

  const copyToClipboard = async () => {
    try {
      // 创建带样式的HTML
      const styledHtml = `
<section style="font-size: 15px; color: #333; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
${htmlContent.replace(
  /<h1>/g, '<h1 style="font-size: 24px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; text-align: center; line-height: 1.4;">'
).replace(
  /<h2>/g, '<h2 style="font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;">'
).replace(
  /<h3>/g, '<h3 style="font-size: 18px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;">'
).replace(
  /<h4>/g, '<h4 style="font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;">'
).replace(
  /<p>/g, '<p style="margin-bottom: 14px; color: #333; font-size: 15px; text-align: justify; word-wrap: break-word;">'
).replace(
  /<code>/g, '<code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: Consolas, Monaco, Menlo, monospace; font-size: 14px; color: #d73a49;">'
).replace(
  /<pre>/g, '<pre style="background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; margin-bottom: 14px; border-left: 3px solid #07c160;">'
).replace(
  /<pre><code>/g, '<pre><code style="background: none; padding: 0; color: #333; font-size: 13px;">'
).replace(
  /<blockquote>/g, '<blockquote style="border-left: 4px solid #07c160; padding: 10px 14px; color: #666; margin: 14px 0; background: #f7f7f7; border-radius: 4px;">'
).replace(
  /<ul>/g, '<ul style="margin-bottom: 14px; padding-left: 20px; color: #333;">'
).replace(
  /<ol>/g, '<ol style="margin-bottom: 14px; padding-left: 20px; color: #333;">'
).replace(
  /<li>/g, '<li style="margin-bottom: 6px;">'
).replace(
  /<a /g, '<a style="color: #576b95; text-decoration: none;" '
).replace(
  /<img /g, '<img style="max-width: 100%; height: auto; border-radius: 6px; margin: 14px 0; display: block;" '
).replace(
  /<table>/g, '<table style="border-collapse: collapse; width: 100%; margin-bottom: 14px; font-size: 14px;">'
).replace(
  /<th>/g, '<th style="border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; color: #333; background: #f5f5f5; font-weight: 600;">'
).replace(
  /<td>/g, '<td style="border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; color: #333;">'
).replace(
  /<hr>/g, '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">'
)}
</section>
      `

      // 使用 Clipboard API 复制富文本
      const blob = new Blob([styledHtml], { type: 'text/html' })
      const clipboardItem = new ClipboardItem({ 'text/html': blob })
      await navigator.clipboard.write([clipboardItem])

      // 显示成功提示
      showToast('已复制，可直接粘贴到微信公众号')
    } catch (err) {
      console.error('复制失败:', err)
      showToast('复制失败，请重试')
    }
  }

  const showToast = (message: string) => {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #07c160;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 2000)
  }

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>预览</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="preview-toggle-btn"
            onClick={copyToClipboard}
            title="复制到微信公众号"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
          </button>
          <button
            className="preview-toggle-btn"
            onClick={() => setIsMobileView(!isMobileView)}
            title={isMobileView ? '桌面预览' : '手机预览'}
          >
            {isMobileView ? (
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-11zM1.5 1a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-13z"/>
                <path d="M0 14.5A1.5 1.5 0 0 1 1.5 13h13a1.5 1.5 0 0 1 1.5 1.5v1a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-1z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            )}
          </button>
        </div>
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

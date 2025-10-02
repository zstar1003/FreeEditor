import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { presetThemes, fontFamilies, fontSizes, ThemeStyle, FontConfig } from '../styles/themes'
import './Preview.css'

interface PreviewProps {
  content: string
}

export default function Preview({ content }: PreviewProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<ThemeStyle>(presetThemes[0])
  const [fontConfig, setFontConfig] = useState<FontConfig>({
    fontFamily: fontFamilies[0].value,
    fontSize: 15
  })

  useEffect(() => {
    const html = content ? marked.parse(content) as string : ''
    setHtmlContent(html)
  }, [content])

  // 将样式应用到HTML用于预览显示
  const getStyledHtml = (): string => {
    return applyStylesToHtml(htmlContent)
  }

  const applyStylesToHtml = (html: string): string => {
    const styles = selectedTheme.styles
    const baseFontSize = fontConfig.fontSize
    const fontFamily = fontConfig.fontFamily

    // 计算相对字体大小
    const h1Size = Math.round(baseFontSize * 1.6)
    const h2Size = Math.round(baseFontSize * 1.33)
    const h3Size = Math.round(baseFontSize * 1.2)
    const h4Size = Math.round(baseFontSize * 1.07)
    const codeSize = Math.round(baseFontSize * 0.93)

    return `<section style="${styles.section.replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`).replace(/font-family: [^;]+/, `font-family: ${fontFamily}`)}">
${html.replace(
  /<h1>/g, `<h1 style="${styles.h1.replace(/font-size: \d+px/, `font-size: ${h1Size}px`)}">`
).replace(
  /<h2>/g, `<h2 style="${styles.h2.replace(/font-size: \d+px/, `font-size: ${h2Size}px`)}">`
).replace(
  /<h3>/g, `<h3 style="${styles.h3.replace(/font-size: \d+px/, `font-size: ${h3Size}px`)}">`
).replace(
  /<h4>/g, `<h4 style="${styles.h4.replace(/font-size: \d+px/, `font-size: ${h4Size}px`)}">`
).replace(
  /<p>/g, `<p style="${styles.p.replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`)}">`
).replace(
  /<code>/g, `<code style="${styles.code.replace(/font-size: \d+px/, `font-size: ${codeSize}px`)}">`
).replace(
  /<pre>/g, `<pre style="${styles.pre}">`
).replace(
  /<pre><code>/g, `<pre><code style="${styles.preCode}">`
).replace(
  /<blockquote>/g, `<blockquote style="${styles.blockquote}">`
).replace(
  /<ul>/g, `<ul style="${styles.ul}">`
).replace(
  /<ol>/g, `<ol style="${styles.ol}">`
).replace(
  /<li>/g, `<li style="${styles.li}">`
).replace(
  /<a /g, `<a style="${styles.a}" `
).replace(
  /<img /g, `<img style="${styles.img}" `
).replace(
  /<table>/g, `<table style="${styles.table}">`
).replace(
  /<th>/g, `<th style="${styles.th}">`
).replace(
  /<td>/g, `<td style="${styles.td}">`
).replace(
  /<hr>/g, `<hr style="${styles.hr}">`
)}
</section>`
  }

  const copyToClipboard = async () => {
    try {
      const styledHtml = applyStylesToHtml(htmlContent)

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
          <button
            className="preview-toggle-btn"
            onClick={() => setShowStylePanel(!showStylePanel)}
            title="样式设置"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div className={`preview-container ${isMobileView ? 'mobile-view' : ''}`}>
          {isMobileView ? (
            <div className="phone-frame">
              <div className="phone-content" dangerouslySetInnerHTML={{ __html: getStyledHtml() }}></div>
              <div className="phone-home-indicator"></div>
            </div>
          ) : (
            <div className="desktop-preview" dangerouslySetInnerHTML={{ __html: getStyledHtml() }}></div>
          )}
        </div>

        {showStylePanel && (
          <div className="style-panel-right">
            <div className="style-section">
              <label>样式模板</label>
              <div className="theme-buttons">
                {presetThemes.map(theme => (
                  <button
                    key={theme.id}
                    className={`theme-btn ${selectedTheme.id === theme.id ? 'active' : ''}`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="style-section">
              <label>字体</label>
              <select
                value={fontConfig.fontFamily}
                onChange={(e) => setFontConfig({ ...fontConfig, fontFamily: e.target.value })}
                className="style-select"
              >
                {fontFamilies.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div className="style-section">
              <label>字号</label>
              <div className="font-size-buttons">
                {fontSizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${fontConfig.fontSize === size ? 'active' : ''}`}
                    onClick={() => setFontConfig({ ...fontConfig, fontSize: size })}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

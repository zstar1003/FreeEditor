import { useEffect, useState } from 'react'
import { marked } from 'marked'
import {
  fontFamilies,
  fontSizes,
  FontConfig,
  h1Styles,
  h2Styles,
  h3Styles,
  codeStyles,
  preStyles,
  blockquoteStyles
} from '../styles/themes'
import './Preview.css'

interface PreviewProps {
  content: string
}

interface CustomStyles {
  h1: string
  h2: string
  h3: string
  code: string
  pre: string
  blockquote: string
}

// 默认的基础样式（用于未自定义的元素）
const defaultStyles = {
  section: 'font-size: 15px; color: #333; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;',
  h4: 'font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;',
  p: 'margin-bottom: 14px; color: #333; font-size: 15px; text-align: justify; word-wrap: break-word;',
  preCode: 'background: none; padding: 0; color: #333; font-size: 13px;',
  ul: 'margin-bottom: 14px; padding-left: 20px; color: #333;',
  ol: 'margin-bottom: 14px; padding-left: 20px; color: #333;',
  li: 'margin-bottom: 6px;',
  a: 'color: #576b95; text-decoration: none;',
  img: 'max-width: 100%; height: auto; border-radius: 6px; margin: 14px 0; display: block;',
  table: 'border-collapse: collapse; width: 100%; margin-bottom: 14px; font-size: 14px;',
  th: 'border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; color: #333; background: #f5f5f5; font-weight: 600;',
  td: 'border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; color: #333;',
  hr: 'border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;'
}

export default function Preview({ content }: PreviewProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [fontConfig, setFontConfig] = useState<FontConfig>({
    fontFamily: fontFamilies[0].value,
    fontSize: 15
  })

  // 独立的元素样式选择
  const [customStyles, setCustomStyles] = useState<CustomStyles>({
    h1: h1Styles[0].style,
    h2: h2Styles[0].style,
    h3: h3Styles[0].style,
    code: codeStyles[0].style,
    pre: preStyles[0].style,
    blockquote: blockquoteStyles[0].style
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
    const baseFontSize = fontConfig.fontSize
    const fontFamily = fontConfig.fontFamily

    // 计算相对字体大小
    const h1Size = Math.round(baseFontSize * 1.6)
    const h2Size = Math.round(baseFontSize * 1.33)
    const h3Size = Math.round(baseFontSize * 1.2)
    const h4Size = Math.round(baseFontSize * 1.07)
    const codeSize = Math.round(baseFontSize * 0.93)

    // 使用自定义的独立样式
    return `<section style="${defaultStyles.section.replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`).replace(/font-family: [^;]+/, `font-family: ${fontFamily}`)}">
${html.replace(
  /<h1>/g, `<h1 style="${customStyles.h1.replace(/font-size: \d+px/, `font-size: ${h1Size}px`)}"`
).replace(
  /<h2>/g, `<h2 style="${customStyles.h2.replace(/font-size: \d+px/, `font-size: ${h2Size}px`)}"`
).replace(
  /<h3>/g, `<h3 style="${customStyles.h3.replace(/font-size: \d+px/, `font-size: ${h3Size}px`)}"`
).replace(
  /<h4>/g, `<h4 style="${defaultStyles.h4.replace(/font-size: \d+px/, `font-size: ${h4Size}px`)}"`
).replace(
  /<p>/g, `<p style="${defaultStyles.p.replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`)}"`
).replace(
  /<code>/g, `<code style="${customStyles.code.replace(/font-size: \d+px/, `font-size: ${codeSize}px`)}"`
).replace(
  /<pre>/g, `<pre style="${customStyles.pre}"`
).replace(
  /<pre><code>/g, `<pre><code style="${defaultStyles.preCode}"`
).replace(
  /<blockquote>/g, `<blockquote style="${customStyles.blockquote}"`
).replace(
  /<ul>/g, `<ul style="${defaultStyles.ul}"`
).replace(
  /<ol>/g, `<ol style="${defaultStyles.ol}"`
).replace(
  /<li>/g, `<li style="${defaultStyles.li}"`
).replace(
  /<a /g, `<a style="${defaultStyles.a}" `
).replace(
  /<img /g, `<img style="${defaultStyles.img}" `
).replace(
  /<table>/g, `<table style="${defaultStyles.table}"`
).replace(
  /<th>/g, `<th style="${defaultStyles.th}"`
).replace(
  /<td>/g, `<td style="${defaultStyles.td}"`
).replace(
  /<hr>/g, `<hr style="${defaultStyles.hr}"`
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

  // 将CSS字符串转换为React style对象
  const parseStyleString = (styleString: string): React.CSSProperties => {
    const styleObj: any = {}
    styleString.split(';').forEach(rule => {
      const [key, value] = rule.split(':').map(s => s.trim())
      if (key && value) {
        // 将CSS属性名转换为camelCase
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
        styleObj[camelKey] = value
      }
    })
    return styleObj
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
              <label>一级标题</label>
              <div className="style-gallery">
                {h1Styles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${customStyles.h1 === style.style ? 'active' : ''}`}
                    onClick={() => setCustomStyles({ ...customStyles, h1: style.style })}
                  >
                    <div className="style-card-name">{style.name}</div>
                    <div className="style-card-preview h1-preview">
                      <div style={parseStyleString(style.style)}>标题示例</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="style-section">
              <label>二级标题</label>
              <div className="style-gallery">
                {h2Styles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${customStyles.h2 === style.style ? 'active' : ''}`}
                    onClick={() => setCustomStyles({ ...customStyles, h2: style.style })}
                  >
                    <div className="style-card-name">{style.name}</div>
                    <div className="style-card-preview h2-preview">
                      <div style={parseStyleString(style.style)}>副标题示例</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="style-section">
              <label>三级标题</label>
              <div className="style-gallery">
                {h3Styles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${customStyles.h3 === style.style ? 'active' : ''}`}
                    onClick={() => setCustomStyles({ ...customStyles, h3: style.style })}
                  >
                    <div className="style-card-name">{style.name}</div>
                    <div className="style-card-preview h3-preview">
                      <div style={parseStyleString(style.style)}>小标题示例</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="style-section">
              <label>行内代码</label>
              <div className="style-gallery">
                {codeStyles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${customStyles.code === style.style ? 'active' : ''}`}
                    onClick={() => setCustomStyles({ ...customStyles, code: style.style })}
                  >
                    <div className="style-card-name">{style.name}</div>
                    <div className="style-card-preview code-preview">
                      <code style={parseStyleString(style.style)}>const code = true</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="style-section">
              <label>代码块</label>
              <div className="style-gallery">
                {preStyles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${customStyles.pre === style.style ? 'active' : ''}`}
                    onClick={() => setCustomStyles({ ...customStyles, pre: style.style })}
                  >
                    <div className="style-card-name">{style.name}</div>
                    <div className="style-card-preview pre-preview">
                      <pre style={parseStyleString(style.style)}>function hello() {'{'}
  console.log("Hi");
{'}'}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="style-section">
              <label>引用块</label>
              <div className="style-gallery">
                {blockquoteStyles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${customStyles.blockquote === style.style ? 'active' : ''}`}
                    onClick={() => setCustomStyles({ ...customStyles, blockquote: style.style })}
                  >
                    <div className="style-card-name">{style.name}</div>
                    <div className="style-card-preview blockquote-preview">
                      <blockquote style={parseStyleString(style.style)}>这是一段引用文字</blockquote>
                    </div>
                  </div>
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

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
  theme: 'dark' | 'light'
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

export default function Preview({ content, theme = 'dark' }: PreviewProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [activeTab, setActiveTab] = useState<'heading' | 'code' | 'other'>('heading')
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

    // 根据主题调整颜色
    const isDark = theme === 'dark'
    const textColor = isDark ? '#d4d4d4' : '#333'
    const sectionBg = isDark ? '#2d2d30' : '#fff'

    // 调整样式中的颜色
    const adjustStyleForTheme = (style: string): string => {
      if (isDark) {
        return style
          .replace(/color:\s*#333/g, 'color: #d4d4d4')
          .replace(/color:\s*#1a1a1a/g, 'color: #e0e0e0')
          .replace(/color:\s*#24292f/g, 'color: #d4d4d4')
          .replace(/color:\s*#2e2e2e/g, 'color: #d4d4d4')
          .replace(/color:\s*#1e1e1e/g, 'color: #e0e0e0')
          .replace(/color:\s*#2c3e50/g, 'color: #d4d4d4')
          .replace(/background:\s*#fff/g, 'background: transparent')
          .replace(/background:\s*#f5f5f5/g, 'background: #3e3e42')
          .replace(/background:\s*#f6f6f6/g, 'background: #3e3e42')
          .replace(/background:\s*#f1f1f1/g, 'background: #3e3e42')
          .replace(/background:\s*#f7f7f7/g, 'background: #3a3a3a')
          .replace(/background:\s*#f8f9fa/g, 'background: #3a3a3a')
          .replace(/background:\s*#f9f9f9/g, 'background: #3a3a3a')
          .replace(/background:\s*#f4f5f5/g, 'background: #3a3a3a')
          .replace(/background:\s*#f6f8fa/g, 'background: #3a3a3a')
          .replace(/background:\s*#ecf0f1/g, 'background: #3a3a3a')
          .replace(/border-left:\s*([^;]+)#07c160/g, 'border-left: $1#10a37f')
          .replace(/border-left:\s*([^;]+)#0084ff/g, 'border-left: $1#4a9eff')
          .replace(/border-left:\s*([^;]+)#1e80ff/g, 'border-left: $1#4a9eff')
          .replace(/border-left:\s*([^;]+)#3498db/g, 'border-left: $1#5dade2')
          .replace(/border-bottom:\s*([^;]+)#0084ff/g, 'border-bottom: $1#4a9eff')
          .replace(/border-bottom:\s*([^;]+)#d0d7de/g, 'border-bottom: $1#555')
          .replace(/border-bottom:\s*([^;]+)#e4e6eb/g, 'border-bottom: $1#555')
          .replace(/border:\s*1px solid #e0e0e0/g, 'border: 1px solid #555')
          .replace(/border:\s*1px solid #e4e6eb/g, 'border: 1px solid #555')
          .replace(/border:\s*1px solid #e1e4e8/g, 'border: 1px solid #555')
          .replace(/border:\s*1px solid #d0d7de/g, 'border: 1px solid #555')
      }
      return style
    }

    const sectionStyle = adjustStyleForTheme(defaultStyles.section)
      .replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`)
      .replace(/font-family: [^;]+/, `font-family: ${fontFamily}`)

    // 使用自定义的独立样式
    return `<section style="${sectionStyle}">
${html.replace(
  /<h1>/g, `<h1 style="${adjustStyleForTheme(customStyles.h1).replace(/font-size: \d+px/, `font-size: ${h1Size}px`)}">`
).replace(
  /<h2>/g, `<h2 style="${adjustStyleForTheme(customStyles.h2).replace(/font-size: \d+px/, `font-size: ${h2Size}px`)}">`
).replace(
  /<h3>/g, `<h3 style="${adjustStyleForTheme(customStyles.h3).replace(/font-size: \d+px/, `font-size: ${h3Size}px`)}">`
).replace(
  /<h4>/g, `<h4 style="${adjustStyleForTheme(defaultStyles.h4).replace(/font-size: \d+px/, `font-size: ${h4Size}px`)}">`
).replace(
  /<p>/g, `<p style="${adjustStyleForTheme(defaultStyles.p).replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`)}">`
).replace(
  /<code>/g, `<code style="${adjustStyleForTheme(customStyles.code).replace(/font-size: \d+px/, `font-size: ${codeSize}px`)}">`
).replace(
  /<pre>/g, `<pre style="${adjustStyleForTheme(customStyles.pre)}">`
).replace(
  /<pre><code>/g, `<pre><code style="${adjustStyleForTheme(defaultStyles.preCode)}">`
).replace(
  /<blockquote>/g, `<blockquote style="${adjustStyleForTheme(customStyles.blockquote)}">`
).replace(
  /<ul>/g, `<ul style="${adjustStyleForTheme(defaultStyles.ul)}">`
).replace(
  /<ol>/g, `<ol style="${adjustStyleForTheme(defaultStyles.ol)}">`
).replace(
  /<li>/g, `<li style="${adjustStyleForTheme(defaultStyles.li)}">`
).replace(
  /<a /g, `<a style="${adjustStyleForTheme(defaultStyles.a)}" `
).replace(
  /<img /g, `<img style="${adjustStyleForTheme(defaultStyles.img)}" `
).replace(
  /<table>/g, `<table style="${adjustStyleForTheme(defaultStyles.table)}">`
).replace(
  /<th>/g, `<th style="${adjustStyleForTheme(defaultStyles.th)}">`
).replace(
  /<td>/g, `<td style="${adjustStyleForTheme(defaultStyles.td)}">`
).replace(
  /<hr>/g, `<hr style="${adjustStyleForTheme(defaultStyles.hr)}">`
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
    <div className={`preview-panel ${theme}`}>
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
            {/* 标签页导航 */}
            <div className="style-tabs">
              <button
                className={`style-tab ${activeTab === 'heading' ? 'active' : ''}`}
                onClick={() => setActiveTab('heading')}
              >
                标题
              </button>
              <button
                className={`style-tab ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                代码
              </button>
              <button
                className={`style-tab ${activeTab === 'other' ? 'active' : ''}`}
                onClick={() => setActiveTab('other')}
              >
                其他
              </button>
            </div>

            {/* 标题样式内容 */}
            {activeTab === 'heading' && (
              <div className="style-tab-content">
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
              </div>
            )}

            {/* 代码样式内容 */}
            {activeTab === 'code' && (
              <div className="style-tab-content">
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
              </div>
            )}

            {/* 其他样式内容 */}
            {activeTab === 'other' && (
              <div className="style-tab-content">
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
        )}
      </div>
    </div>
  )
}

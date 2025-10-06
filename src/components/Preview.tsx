import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
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
import useLocalStorage from '../hooks/useLocalStorage'
import { StyleTemplate } from '../types'
import './Preview.css'

interface PreviewProps {
  content: string
  theme: 'dark' | 'light'
  onStyleTemplatesChange?: (templates: StyleTemplate[]) => void
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
  hr: 'border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;',
  strong: 'font-weight: bold; display: inline; margin: 0; padding: 0;',
  em: 'font-style: italic; display: inline; margin: 0; padding: 0;'
}

export default function Preview({ content, theme = 'dark', onStyleTemplatesChange }: PreviewProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [activeTab, setActiveTab] = useState<'heading' | 'code' | 'other' | 'template'>('heading')
  const [fontConfig, setFontConfig] = useState<FontConfig>({
    fontFamily: fontFamilies[0].value,
    fontSize: 15
  })
  const [textAlign, setTextAlign] = useState<'left' | 'right' | 'center' | 'justify'>('justify')

  // 独立的元素样式选择
  const [customStyles, setCustomStyles] = useState<CustomStyles>({
    h1: h1Styles[0].style,
    h2: h2Styles[0].style,
    h3: h3Styles[0].style,
    code: codeStyles[0].style,
    pre: preStyles[0].style,
    blockquote: blockquoteStyles[0].style
  })

  // 模板管理
  const [styleTemplates, setStyleTemplates] = useLocalStorage<StyleTemplate[]>('styleTemplates', [])
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')

  // 配置 marked
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    })
  }, [])

  useEffect(() => {
    let html = content ? marked.parse(content) as string : ''

    // 手动处理代码高亮
    html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
      // 解码 HTML 实体
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      try {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        const highlighted = hljs.highlight(decodedCode, { language }).value
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
      } catch (err) {
        console.error('Highlight error:', err)
        return match
      }
    })

    console.log('Parsed HTML:', html.substring(0, 500))
    setHtmlContent(html)
  }, [content])

  // 通知父组件模板变化
  useEffect(() => {
    if (onStyleTemplatesChange) {
      onStyleTemplatesChange(styleTemplates)
    }
  }, [styleTemplates, onStyleTemplatesChange])

  // 初始化时应用默认模板
  useEffect(() => {
    const defaultTemplate = styleTemplates.find(t => t.isDefault)
    if (defaultTemplate) {
      setFontConfig({
        fontFamily: defaultTemplate.fontFamily,
        fontSize: defaultTemplate.fontSize
      })
      setTextAlign(defaultTemplate.textAlign || 'justify')
      setCustomStyles({
        h1: defaultTemplate.h1Style,
        h2: defaultTemplate.h2Style,
        h3: defaultTemplate.h3Style,
        code: defaultTemplate.codeStyle,
        pre: defaultTemplate.preStyle,
        blockquote: defaultTemplate.blockquoteStyle
      })
    }
  }, [])

  // 将样式应用到HTML用于预览显示
  const getStyledHtml = (): string => {
    const result = applyStylesToHtml(htmlContent)
    console.log('Styled HTML:', result.substring(0, 500))
    return result
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
      .replace(/text-align: [^;]+;/, '') + `text-align: ${textAlign};`

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
  /<p>/g, `<p style="${adjustStyleForTheme(defaultStyles.p).replace(/font-size: \d+px/, `font-size: ${baseFontSize}px`).replace(/text-align: [^;]+;/, '') + `text-align: ${textAlign};`}">`
).replace(
  /<pre>/g, `<pre style="${adjustStyleForTheme(customStyles.pre)}">`
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
).replace(
  /<strong>/g, `<strong style="${adjustStyleForTheme(defaultStyles.strong)}">`
).replace(
  /<em>/g, `<em style="${adjustStyleForTheme(defaultStyles.em)}">`
).replace(
  // 只替换不在 <pre> 中的 <code> 标签（行内代码）
  /<code>(?![^]*<\/pre>)/g,
  function(match, offset, string) {
    // 检查这个 code 标签是否在 pre 标签内
    const beforeCode = string.substring(0, offset)
    const lastPreOpen = beforeCode.lastIndexOf('<pre')
    const lastPreClose = beforeCode.lastIndexOf('</pre>')

    // 如果最近的 pre 是开标签且没有闭合，说明在 pre 内部，不替换
    if (lastPreOpen > lastPreClose && lastPreOpen !== -1) {
      return match
    }

    // 否则是行内代码，添加样式
    return `<code style="${adjustStyleForTheme(customStyles.code).replace(/font-size: \d+px/, `font-size: ${codeSize}px`)}">`
  }
)}
</section>`
  }

  const copyToClipboard = async () => {
    try {
      let styledHtml = applyStylesToHtml(htmlContent)

      // 针对微信公众号优化：处理列表项中的格式化文本
      // 微信会在某些标签后自动插入 section，导致换行
      // 解决方案：将整个列表项内容用一个 p 标签包裹，确保内容在同一行
      styledHtml = styledHtml.replace(
        /<li([^>]*)>([\s\S]*?)<\/li>/g,
        (match, liAttrs, content) => {
          // 将 strong 和 em 替换为带样式的 span
          let processedContent = content.trim()
            .replace(/<strong[^>]*>/g, '<span style="font-weight: bold;">')
            .replace(/<\/strong>/g, '</span>')
            .replace(/<em[^>]*>/g, '<span style="font-style: italic;">')
            .replace(/<\/em>/g, '</span>')

          // 将处理后的内容包裹在一个 p 标签中，防止微信自动分段
          return `<li${liAttrs}><p style="margin: 0; padding: 0; display: inline;">${processedContent}</p></li>`
        }
      )

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

  // 保存当前样式为模板
  const saveCurrentStyleAsTemplate = () => {
    if (!newTemplateName.trim()) {
      showToast('请输入模板名称')
      return
    }

    const newTemplate: StyleTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      fontFamily: fontConfig.fontFamily,
      fontSize: fontConfig.fontSize,
      textAlign: textAlign,
      h1Style: customStyles.h1,
      h2Style: customStyles.h2,
      h3Style: customStyles.h3,
      codeStyle: customStyles.code,
      preStyle: customStyles.pre,
      blockquoteStyle: customStyles.blockquote,
      isDefault: styleTemplates.length === 0,
      createdAt: new Date().toISOString()
    }

    setStyleTemplates([...styleTemplates, newTemplate])
    setNewTemplateName('')
    setShowSaveTemplateDialog(false)
    showToast('模板已保存')
  }

  // 应用模板
  const applyTemplate = (template: StyleTemplate) => {
    setFontConfig({
      fontFamily: template.fontFamily,
      fontSize: template.fontSize
    })
    setTextAlign(template.textAlign || 'justify')
    setCustomStyles({
      h1: template.h1Style,
      h2: template.h2Style,
      h3: template.h3Style,
      code: template.codeStyle,
      pre: template.preStyle,
      blockquote: template.blockquoteStyle
    })
    showToast(`已应用模板: ${template.name}`)
  }

  // 删除模板
  const deleteTemplate = (templateId: string) => {
    setStyleTemplates(styleTemplates.filter(t => t.id !== templateId))
    showToast('模板已删除')
  }

  // 设置为默认模板
  const setDefaultTemplate = (templateId: string) => {
    setStyleTemplates(styleTemplates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    })))
    showToast('已设置为默认模板')
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
              <button
                className={`style-tab ${activeTab === 'template' ? 'active' : ''}`}
                onClick={() => setActiveTab('template')}
              >
                模板
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

                <div className="style-section">
                  <label>对齐方式</label>
                  <div className="font-size-buttons">
                    <button
                      className={`size-btn ${textAlign === 'left' ? 'active' : ''}`}
                      onClick={() => setTextAlign('left')}
                      title="左对齐"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3h12v1H2V3zm0 3h8v1H2V6zm0 3h12v1H2V9zm0 3h8v1H2v-1z"/>
                      </svg>
                    </button>
                    <button
                      className={`size-btn ${textAlign === 'center' ? 'active' : ''}`}
                      onClick={() => setTextAlign('center')}
                      title="居中对齐"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3h12v1H2V3zm2 3h8v1H4V6zm-2 3h12v1H2V9zm2 3h8v1H4v-1z"/>
                      </svg>
                    </button>
                    <button
                      className={`size-btn ${textAlign === 'right' ? 'active' : ''}`}
                      onClick={() => setTextAlign('right')}
                      title="右对齐"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3h12v1H2V3zm4 3h8v1H6V6zm-4 3h12v1H2V9zm4 3h8v1H6v-1z"/>
                      </svg>
                    </button>
                    <button
                      className={`size-btn ${textAlign === 'justify' ? 'active' : ''}`}
                      onClick={() => setTextAlign('justify')}
                      title="两端对齐"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3h12v1H2V3zm0 3h12v1H2V6zm0 3h12v1H2V9zm0 3h12v1H2v-1z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 模板管理内容 */}
            {activeTab === 'template' && (
              <div className="style-tab-content">
                <div className="style-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label>我的模板</label>
                    <button
                      className="btn-save-template"
                      onClick={() => setShowSaveTemplateDialog(true)}
                      style={{
                        padding: '6px 12px',
                        background: '#07c160',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      保存当前样式
                    </button>
                  </div>

                  {styleTemplates.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#858585', fontSize: '14px' }}>
                      暂无保存的模板<br />
                      配置好样式后点击"保存当前样式"创建模板
                    </div>
                  ) : (
                    <div className="template-list">
                      {styleTemplates.map(template => (
                        <div key={template.id} className="template-item" style={{
                          padding: '12px',
                          border: '1px solid #3e3e42',
                          borderRadius: '6px',
                          marginBottom: '12px',
                          background: theme === 'dark' ? '#2d2d30' : '#f5f5f5'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {template.name}
                                {template.isDefault && (
                                  <span style={{
                                    fontSize: '11px',
                                    padding: '2px 6px',
                                    background: '#07c160',
                                    color: 'white',
                                    borderRadius: '3px'
                                  }}>默认</span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#858585' }}>
                                {template.fontFamily.split(',')[0]} · {template.fontSize}px
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => applyTemplate(template)}
                                style={{
                                  padding: '4px 10px',
                                  background: '#0084ff',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                应用
                              </button>
                              {!template.isDefault && (
                                <button
                                  onClick={() => setDefaultTemplate(template.id)}
                                  style={{
                                    padding: '4px 10px',
                                    background: 'transparent',
                                    color: '#858585',
                                    border: '1px solid #3e3e42',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  设为默认
                                </button>
                              )}
                              <button
                                onClick={() => deleteTemplate(template.id)}
                                style={{
                                  padding: '4px 10px',
                                  background: 'transparent',
                                  color: '#f56c6c',
                                  border: '1px solid #f56c6c',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '20px', padding: '12px', background: theme === 'dark' ? '#2d2d30' : '#f0f9ff', borderRadius: '6px', fontSize: '13px', color: '#858585', lineHeight: '1.6' }}>
                    💡 使用说明：<br />
                    • 在其他标签页配置好样式后，保存为模板<br />
                    • 可设置默认模板，新建文件时自动应用<br />
                    • 随时切换和管理已保存的模板
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 保存模板对话框 */}
      {showSaveTemplateDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }} onClick={() => setShowSaveTemplateDialog(false)}>
          <div style={{
            background: theme === 'dark' ? '#2d2d30' : 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90vw'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>保存样式模板</h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="请输入模板名称"
              autoFocus
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${theme === 'dark' ? '#3e3e42' : '#e0e0e0'}`,
                borderRadius: '4px',
                background: theme === 'dark' ? '#1e1e1e' : 'white',
                color: theme === 'dark' ? '#d4d4d4' : '#333',
                fontSize: '14px',
                marginBottom: '16px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveCurrentStyleAsTemplate()
                }
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSaveTemplateDialog(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: `1px solid ${theme === 'dark' ? '#3e3e42' : '#e0e0e0'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: theme === 'dark' ? '#d4d4d4' : '#333'
                }}
              >
                取消
              </button>
              <button
                onClick={saveCurrentStyleAsTemplate}
                style={{
                  padding: '8px 16px',
                  background: '#07c160',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

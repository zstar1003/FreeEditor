import { sanitizeHtml } from '../utils/sanitizeHtml'
import { useState, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import './XiaohongshuCard.css'

interface XiaohongshuCardProps {
  content: string
  isOpen: boolean
  onClose: () => void
  theme: 'dark' | 'light'
}

// 预设渐变背景
const gradientPresets = [
  { id: 1, name: '暖阳橙', gradient: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)' },
  { id: 2, name: '薄荷绿', gradient: 'linear-gradient(135deg, #96E6A1 0%, #DDD6F3 100%)' },
  { id: 3, name: '天空蓝', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 4, name: '蜜桃粉', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 5, name: '清新紫', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 6, name: '柠檬黄', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { id: 7, name: '樱花粉', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { id: 8, name: '森林绿', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 9, name: '珊瑚红', gradient: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)' },
  { id: 10, name: '星空紫', gradient: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)' },
  { id: 11, name: '纯白', gradient: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)' },
  { id: 12, name: '奶茶色', gradient: 'linear-gradient(135deg, #f6e3ce 0%, #d9c5a0 100%)' },
]

// 小红书卡片尺寸预设（3:4比例）
const CARD_WIDTH = 360
const CARD_HEIGHT = 480
const CARD_PADDING = 28

export default function XiaohongshuCard({ content, isOpen, onClose, theme }: XiaohongshuCardProps) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [cardBackground, setCardBackground] = useState(gradientPresets[0].gradient)
  const [isExporting, setIsExporting] = useState(false)
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [titleStyle, setTitleStyle] = useState<'modern' | 'classic' | 'minimal'>('modern')
  const cardContentRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  // 解析 Markdown 为 HTML
  const parseMarkdown = (md: string): string => {
    return sanitizeHtml(marked.parse(md) as string)
  }

  // 将内容分割成多页
  const splitContentIntoPages = useCallback(async () => {
    if (!content || !measureRef.current) return

    const html = parseMarkdown(content)

    // 创建临时元素来测量内容，样式与实际卡片一致
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = sanitizeHtml(html)
    tempDiv.style.cssText = `
      position: absolute;
      visibility: hidden;
      width: ${CARD_WIDTH - CARD_PADDING * 2}px;
      font-size: 14px;
      line-height: 1.7;
      color: #1a1a1a;
    `
    // 添加与卡片内容一致的样式
    tempDiv.querySelectorAll('p').forEach(p => {
      const el = p as HTMLElement
      el.style.marginTop = '0'
      el.style.marginBottom = '8px'
    })
    tempDiv.querySelectorAll('h1, h2, h3').forEach(h => {
      const el = h as HTMLElement
      el.style.marginTop = '12px'
      el.style.marginBottom = '8px'
    })
    tempDiv.querySelectorAll('ul, ol').forEach(list => {
      const el = list as HTMLElement
      el.style.marginTop = '0'
      el.style.marginBottom = '8px'
      el.style.paddingLeft = '18px'
    })
    tempDiv.querySelectorAll('li').forEach(li => {
      const el = li as HTMLElement
      el.style.marginBottom = '4px'
    })
    tempDiv.querySelectorAll('pre').forEach(pre => {
      const el = pre as HTMLElement
      el.style.marginTop = '0'
      el.style.marginBottom = '8px'
    })
    tempDiv.querySelectorAll('blockquote').forEach(bq => {
      const el = bq as HTMLElement
      el.style.marginTop = '8px'
      el.style.marginBottom = '8px'
    })
    tempDiv.querySelectorAll('img').forEach(img => {
      const el = img as HTMLElement
      el.style.marginTop = '6px'
      el.style.marginBottom = '6px'
      el.style.maxWidth = '100%'
      el.style.height = 'auto'
      el.style.display = 'block'
    })

    document.body.appendChild(tempDiv)

    // 等待图片加载完成
    const images = tempDiv.querySelectorAll('img')
    await Promise.all(Array.from(images).map(img => {
      return new Promise<void>(resolve => {
        if ((img as HTMLImageElement).complete) {
          resolve()
        } else {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }
      })
    }))

    // 将元素展开为更细粒度的单元（拆分列表）
    interface FlatItem {
      element: HTMLElement
      html: string
      height: number
      isListItem?: boolean
      listTag?: string
    }

    const flattenElements = (): FlatItem[] => {
      const result: FlatItem[] = []
      const allElements = Array.from(tempDiv.children) as HTMLElement[]

      for (const element of allElements) {
        const tagName = element.tagName.toLowerCase()
        const style = window.getComputedStyle(element)
        const marginTop = parseFloat(style.marginTop) || 0
        const marginBottom = parseFloat(style.marginBottom) || 0
        const height = element.offsetHeight + marginTop + marginBottom

        // 拆分列表为单独的列表项
        if (tagName === 'ul' || tagName === 'ol') {
          const listItems = Array.from(element.children) as HTMLElement[]
          for (const li of listItems) {
            const liStyle = window.getComputedStyle(li)
            const liMarginTop = parseFloat(liStyle.marginTop) || 0
            const liMarginBottom = parseFloat(liStyle.marginBottom) || 0
            const liHeight = li.offsetHeight + liMarginTop + liMarginBottom
            result.push({
              element: li,
              html: li.outerHTML,
              height: liHeight,
              isListItem: true,
              listTag: tagName
            })
          }
        } else {
          result.push({
            element,
            html: element.outerHTML,
            height
          })
        }
      }
      return result
    }

    const flatElements = flattenElements()
    const pageContents: string[] = []
    const maxHeight = CARD_HEIGHT - CARD_PADDING * 2 - 20 // 最小预留空间
    const titleHeight = 40 // 第一页标题空间

    // 严格按顺序填充，允许轻微溢出
    let isFirstPage = true
    let currentPageContent = ''
    let currentHeight = 0
    let availableHeight = maxHeight - titleHeight

    // 追踪当前是否在列表中
    let inList = false
    let currentListTag = ''

    for (let i = 0; i < flatElements.length; i++) {
      const item = flatElements[i]
      let itemHeight = item.height

      if (item.isListItem && !inList) {
        itemHeight += 2 // 列表开始额外空间
      }

      // 检查是否能放下（允许溢出 10px）
      const canFit = currentHeight + itemHeight <= availableHeight + 10

      if (!canFit && currentPageContent !== '') {
        // 放不下，先关闭当前列表
        if (inList) {
          currentPageContent += `</${currentListTag}>`
          inList = false
        }
        // 保存当前页
        pageContents.push(currentPageContent)
        currentPageContent = ''
        currentHeight = 0
        isFirstPage = false
        availableHeight = maxHeight
      }

      // 处理列表项
      if (item.isListItem) {
        if (!inList) {
          currentPageContent += `<${item.listTag}>`
          inList = true
          currentListTag = item.listTag!
        } else if (currentListTag !== item.listTag) {
          currentPageContent += `</${currentListTag}>`
          currentPageContent += `<${item.listTag}>`
          currentListTag = item.listTag!
        }
        currentPageContent += item.html

        // 检查下一个元素是否是同类型列表项
        const nextItem = flatElements[i + 1]
        if (!nextItem || !nextItem.isListItem || nextItem.listTag !== currentListTag) {
          currentPageContent += `</${currentListTag}>`
          inList = false
        }
      } else {
        if (inList) {
          currentPageContent += `</${currentListTag}>`
          inList = false
        }
        currentPageContent += item.html
      }

      currentHeight += itemHeight
    }

    // 关闭未关闭的列表
    if (inList) {
      currentPageContent += `</${currentListTag}>`
    }

    // 添加最后一页
    if (currentPageContent) {
      pageContents.push(currentPageContent)
    }

    // 如果没有内容，至少显示一个空页
    if (pageContents.length === 0) {
      pageContents.push('<p>暂无内容</p>')
    }

    document.body.removeChild(tempDiv)
    setPages(pageContents.map(sanitizeHtml))
    setCurrentPage(0)
  }, [content])

  useEffect(() => {
    if (isOpen && content) {
      // 延迟执行以确保 DOM 已渲染
      setTimeout(splitContentIntoPages, 100)
    }
  }, [isOpen, content, splitContentIntoPages])

  // 获取文章标题（第一个 h1 或第一行）
  const getTitle = (): string => {
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) return h1Match[1]

    const firstLine = content.split('\n')[0]
    return firstLine.replace(/^#+\s*/, '').slice(0, 20) || '小红书卡片'
  }

  // 将图片转换为 base64
  const convertImageToBase64 = async (img: HTMLImageElement): Promise<string> => {
    if (img.src.startsWith('data:')) {
      return img.src
    }

    // 如果图片已经加载完成，直接用 canvas 转换
    if (img.complete && img.naturalWidth > 0) {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          return canvas.toDataURL('image/png')
        }
      } catch (e) {
        // 跨域错误，尝试其他方法
      }
    }

    // 尝试重新加载图片
    return new Promise((resolve) => {
      const tempImg = new Image()

      // 先尝试不带 crossOrigin
      const tryWithoutCORS = () => {
        const img2 = new Image()
        img2.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = img2.naturalWidth
            canvas.height = img2.naturalHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img2, 0, 0)
              resolve(canvas.toDataURL('image/png'))
            } else {
              resolve(img.src)
            }
          } catch (e) {
            resolve(img.src)
          }
        }
        img2.onerror = () => resolve(img.src)
        img2.src = img.src
      }

      tempImg.crossOrigin = 'anonymous'
      tempImg.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = tempImg.naturalWidth
          canvas.height = tempImg.naturalHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(tempImg, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          } else {
            resolve(img.src)
          }
        } catch (e) {
          // crossOrigin 方式失败，尝试不带 crossOrigin
          tryWithoutCORS()
        }
      }
      tempImg.onerror = () => tryWithoutCORS()

      // 添加时间戳避免缓存
      const separator = img.src.includes('?') ? '&' : '?'
      tempImg.src = img.src + separator + '_t=' + Date.now()

      // 超时处理
      setTimeout(() => resolve(img.src), 5000)
    })
  }

  // 导出当前页为图片
  const exportCurrentPage = async () => {
    const cardElement = document.querySelector('.xhs-card-preview') as HTMLElement
    if (!cardElement) return

    setIsExporting(true)

    try {
      // 等待图片加载并转换为 base64
      const images = cardElement.querySelectorAll('img')
      for (const img of Array.from(images)) {
        const imgEl = img as HTMLImageElement
        if (!imgEl.src.startsWith('data:')) {
          const base64 = await convertImageToBase64(imgEl)
          imgEl.src = base64
        }
      }

      // 等待一下确保图片已更新
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `xiaohongshu-card-${currentPage + 1}.png`
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (error) {
      console.error('导出图片失败:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // 收集并转换所有图片为 base64
  const collectImageBase64Map = async (): Promise<Map<string, string>> => {
    const imageMap = new Map<string, string>()
    const processedUrls = new Set<string>()

    // 从所有 pages HTML 中提取图片 URL
    for (const pageHtml of pages) {
      // 使用 DOM 解析来提取图片
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = sanitizeHtml(pageHtml)
      const images = tempDiv.querySelectorAll('img')

      for (const img of Array.from(images)) {
        const imgEl = img as HTMLImageElement
        const src = imgEl.getAttribute('src') || ''

        if (src && !src.startsWith('data:') && !processedUrls.has(src)) {
          processedUrls.add(src)

          // 创建可见的临时图片来加载
          const loadImg = document.createElement('img')
          loadImg.style.cssText = 'position: fixed; left: -9999px; top: 0; opacity: 0;'
          loadImg.src = src
          document.body.appendChild(loadImg)

          // 等待图片加载
          await new Promise<void>(resolve => {
            if (loadImg.complete && loadImg.naturalWidth > 0) {
              resolve()
            } else {
              loadImg.onload = () => resolve()
              loadImg.onerror = () => resolve()
              setTimeout(resolve, 3000)
            }
          })

          // 转换为 base64
          if (loadImg.complete && loadImg.naturalWidth > 0) {
            const base64 = await convertImageToBase64(loadImg)
            if (base64.startsWith('data:')) {
              imageMap.set(src, base64)
            }
          }

          // 清理临时图片
          document.body.removeChild(loadImg)
        }
      }
    }

    return imageMap
  }

  // 替换 HTML 中的图片 src 为 base64
  const replaceImagesWithBase64 = (html: string, imageMap: Map<string, string>): string => {
    let result = html
    imageMap.forEach((base64, originalSrc) => {
      // 转义特殊字符用于正则
      const escapedSrc = originalSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      result = result.replace(new RegExp(`src="${escapedSrc}"`, 'g'), `src="${base64}"`)
    })
    return result
  }

  // 导出所有页为图片（打包成zip）
  const exportAllPages = async () => {
    setIsExporting(true)
    const zip = new JSZip()

    try {
      // 先收集所有图片并转换为 base64
      const imageMap = await collectImageBase64Map()

      // 创建隐藏的渲染容器
      const hiddenContainer = document.createElement('div')
      hiddenContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${CARD_WIDTH}px;
        height: ${CARD_HEIGHT}px;
      `
      document.body.appendChild(hiddenContainer)

      for (let i = 0; i < pages.length; i++) {
        // 创建卡片元素
        const cardDiv = document.createElement('div')
        cardDiv.className = 'xhs-card-preview'
        cardDiv.style.cssText = `
          width: ${CARD_WIDTH}px;
          height: ${CARD_HEIGHT}px;
          border-radius: 16px;
          overflow: hidden;
          background: ${cardBackground};
        `

        const contentDiv = document.createElement('div')
        contentDiv.className = `xhs-card-content title-style-${titleStyle}`
        contentDiv.style.cssText = `
          width: 100%;
          height: 100%;
          padding: ${CARD_PADDING}px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        `

        // 添加标题（仅第一页）
        if (i === 0) {
          const titleDiv = document.createElement('div')
          titleDiv.className = 'xhs-card-title'
          const heading = document.createElement('h1')
          heading.textContent = getTitle()
          titleDiv.appendChild(heading)
          contentDiv.appendChild(titleDiv)
        }

        // 添加内容 - 使用替换后的 HTML
        const bodyDiv = document.createElement('div')
        bodyDiv.className = 'xhs-card-body'
        bodyDiv.innerHTML = sanitizeHtml(replaceImagesWithBase64(pages[i], imageMap))
        contentDiv.appendChild(bodyDiv)

        // 添加页码
        const footerDiv = document.createElement('div')
        footerDiv.className = 'xhs-card-footer'
        footerDiv.innerHTML = `<span class="xhs-page-indicator">${i + 1} / ${pages.length}</span>`
        contentDiv.appendChild(footerDiv)

        cardDiv.appendChild(contentDiv)
        hiddenContainer.innerHTML = ''
        hiddenContainer.appendChild(cardDiv)

        // 等待图片加载完成
        const images = cardDiv.querySelectorAll('img')
        await Promise.all(Array.from(images).map(img => {
          return new Promise<void>(resolve => {
            if ((img as HTMLImageElement).complete) {
              resolve()
            } else {
              img.onload = () => resolve()
              img.onerror = () => resolve()
              setTimeout(resolve, 1000)
            }
          })
        }))

        // 等待一小段时间确保渲染完成
        await new Promise(resolve => setTimeout(resolve, 50))

        const canvas = await html2canvas(cardDiv, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 0,
        })

        // 将 canvas 转换为 blob 并添加到 zip
        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              zip.file(`xiaohongshu-card-${i + 1}.png`, blob)
            }
            resolve()
          }, 'image/png')
        })
      }

      // 清理隐藏容器
      document.body.removeChild(hiddenContainer)

      // 生成并下载 zip 文件
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.download = `xiaohongshu-cards-${Date.now()}.zip`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('导出图片失败:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(currentPage - 1)
      } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentPage, pages.length, onClose])

  if (!isOpen) return null

  const title = getTitle()

  return (
    <div className="xhs-overlay" onClick={onClose}>
      <div className={`xhs-container ${theme}`} onClick={(e) => e.stopPropagation()}>
        {/* 左侧：卡片预览 */}
        <div className="xhs-preview-section">
          <div
            className="xhs-card-preview"
            style={{ background: cardBackground }}
            ref={cardContentRef}
          >
            <div className={`xhs-card-content title-style-${titleStyle}`}>
              {/* 标题（仅第一页显示） */}
              {currentPage === 0 && (
                <div className="xhs-card-title">
                  <h1>{title}</h1>
                </div>
              )}

              {/* 内容区域 */}
              <div
                className="xhs-card-body"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(pages[currentPage] || '') }}
              />

              {/* 页码 */}
              <div className="xhs-card-footer">
                <span className="xhs-page-indicator">
                  {currentPage + 1} / {pages.length}
                </span>
              </div>
            </div>
          </div>

          {/* 页面导航 */}
          <div className="xhs-navigation">
            <button
              className="xhs-nav-btn"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
            <div className="xhs-page-dots">
              {pages.map((_, index) => (
                <button
                  key={index}
                  className={`xhs-page-dot ${index === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>
            <button
              className="xhs-nav-btn"
              onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
              disabled={currentPage === pages.length - 1}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 右侧：样式控制面板 */}
        <div className={`xhs-style-panel ${showStylePanel ? 'visible' : ''}`}>
          <div className="xhs-panel-header">
            <h3>卡片样式</h3>
            <button className="xhs-close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>

          <div className="xhs-panel-content">
            {/* 背景选择 */}
            <div className="xhs-panel-section">
              <label>背景颜色</label>
              <div className="xhs-gradient-grid">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.id}
                    className={`xhs-gradient-btn ${cardBackground === preset.gradient ? 'active' : ''}`}
                    style={{ background: preset.gradient }}
                    onClick={() => setCardBackground(preset.gradient)}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* 标题样式 */}
            <div className="xhs-panel-section">
              <label>标题样式</label>
              <div className="xhs-title-style-options">
                <button
                  className={`xhs-style-option ${titleStyle === 'modern' ? 'active' : ''}`}
                  onClick={() => setTitleStyle('modern')}
                >
                  现代风
                </button>
                <button
                  className={`xhs-style-option ${titleStyle === 'classic' ? 'active' : ''}`}
                  onClick={() => setTitleStyle('classic')}
                >
                  经典风
                </button>
                <button
                  className={`xhs-style-option ${titleStyle === 'minimal' ? 'active' : ''}`}
                  onClick={() => setTitleStyle('minimal')}
                >
                  极简风
                </button>
              </div>
            </div>

            {/* 页面信息 */}
            <div className="xhs-panel-section">
              <label>页面信息</label>
              <div className="xhs-page-info">
                <span>共 {pages.length} 页</span>
                <span>当前第 {currentPage + 1} 页</span>
              </div>
            </div>

            {/* 导出按钮 */}
            <div className="xhs-panel-section xhs-export-section">
              <button
                className="xhs-export-btn"
                onClick={exportCurrentPage}
                disabled={isExporting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.5 1a.5.5 0 0 0-1 0v8.793L4.354 6.646a.5.5 0 1 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0-.708-.708L8.5 9.793V1z"/>
                  <path d="M3 13h10a1 1 0 0 0 1-1V9.5a.5.5 0 0 0-1 0V12H3V9.5a.5.5 0 0 0-1 0V12a1 1 0 0 0 1 1z"/>
                </svg>
                导出当前页
              </button>
              <button
                className="xhs-export-btn xhs-export-all"
                onClick={exportAllPages}
                disabled={isExporting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm0-1h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                  <path d="M4.5 11.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v5.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                </svg>
                {isExporting ? '导出中...' : `导出全部 (${pages.length}页)`}
              </button>
            </div>

          </div>
        </div>

        {/* 移动端样式面板切换按钮 */}
        <button
          className="xhs-toggle-panel-btn"
          onClick={() => setShowStylePanel(!showStylePanel)}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
          </svg>
        </button>
      </div>

      {/* 用于测量内容高度的隐藏元素 */}
      <div ref={measureRef} style={{ position: 'absolute', visibility: 'hidden', width: CARD_WIDTH - CARD_PADDING * 2 }} />
    </div>
  )
}

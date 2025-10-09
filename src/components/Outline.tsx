import { useState, useEffect } from 'react'
import './Outline.css'

interface OutlineProps {
  content: string
  theme?: 'dark' | 'light'
  onHeadingClick: (lineNumber: number) => void
}

interface HeadingItem {
  level: number
  text: string
  lineNumber: number
}

export default function Outline({ content, theme = 'dark', onHeadingClick }: OutlineProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // 提取所有标题
    const lines = content.split('\n')
    const extractedHeadings: HeadingItem[] = []

    lines.forEach((line, index) => {
      // 匹配 Markdown 标题格式 (# 到 ######)
      const match = line.match(/^(#{1,6})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        extractedHeadings.push({
          level,
          text,
          lineNumber: index
        })
      }
    })

    setHeadings(extractedHeadings)
  }, [content])

  const handleHeadingClick = (lineNumber: number) => {
    onHeadingClick(lineNumber)
  }

  return (
    <div className={`outline-panel ${theme} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="outline-header">
        <h3>大纲</h3>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? '展开' : '收起'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            {isCollapsed ? (
              <path d="M6 12l4-4-4-4v8z"/>
            ) : (
              <path d="M4 6l4 4 4-4H4z"/>
            )}
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <div className="outline-content">
          {headings.length === 0 ? (
            <div className="outline-empty">
              暂无标题
            </div>
          ) : (
            <ul className="outline-list">
              {headings.map((heading, index) => (
                <li
                  key={index}
                  className={`outline-item level-${heading.level}`}
                  onClick={() => handleHeadingClick(heading.lineNumber)}
                  title={heading.text}
                >
                  <span className="outline-text">{heading.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

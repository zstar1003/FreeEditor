import { useState, useEffect } from 'react'
import './Outline.css'

interface OutlineProps {
  content: string
  theme?: 'dark' | 'light'
  onHeadingClick: (lineNumber: number) => void
  isVisible?: boolean
}

interface HeadingItem {
  level: number
  text: string
  lineNumber: number
}

export default function Outline({ content, theme = 'dark', onHeadingClick, isVisible = true }: OutlineProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])

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

  // 如果不可见，直接返回 null
  if (!isVisible) {
    return null
  }

  const handleHeadingClick = (lineNumber: number) => {
    onHeadingClick(lineNumber)
  }

  return (
    <div className={`outline-panel ${theme}`}>
      <div className="outline-header">
        <h3>大纲</h3>
      </div>

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
    </div>
  )
}

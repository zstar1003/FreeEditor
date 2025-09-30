import './Sidebar.css'

export default function Sidebar({ files, currentFileId, onFileSelect, onNewFile }) {
  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) return '刚刚'
    if (diff < hour) return Math.floor(diff / minute) + '分钟前'
    if (diff < day) return Math.floor(diff / hour) + '小时前'
    if (diff < 7 * day) return Math.floor(diff / day) + '天前'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  const sortedFiles = [...files].sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 32C38 29.7909 39.7909 28 42 28H70L90 48V96C90 98.2091 88.2091 100 86 100H42C39.7909 100 38 98.2091 38 96V32Z"
                  fill="#1890ff" opacity="0.9"/>
            <path d="M70 28V44C70 46.2091 71.7909 48 74 48H90L70 28Z"
                  fill="#1890ff" opacity="0.6"/>
            <line x1="48" y1="58" x2="80" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="48" y1="68" x2="75" y2="68" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="48" y1="78" x2="80" y2="78" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="logo-text">FreeEditor</span>
        </div>
        <button className="btn-icon" onClick={onNewFile} title="新建文档">
          +
        </button>
      </div>
      <div className="file-list">
        {sortedFiles.map(file => (
          <div
            key={file.id}
            className={`file-item ${file.id === currentFileId ? 'active' : ''}`}
            onClick={() => onFileSelect(file.id)}
          >
            <span className="file-item-name">{file.name}</span>
            <span className="file-item-time">{formatTime(file.updatedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
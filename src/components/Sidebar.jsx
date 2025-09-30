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
        <h3>文档列表</h3>
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
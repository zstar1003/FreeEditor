import './Modal.css'

export default function Modal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onCancel}>
            取消
          </button>
          <button className="modal-btn modal-btn-danger" onClick={onConfirm}>
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
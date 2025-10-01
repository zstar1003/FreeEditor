import { MouseEvent } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: (() => void) | null
  onCancel: () => void
}

export default function Modal({ isOpen, title, message, onConfirm, onCancel }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e: MouseEvent) => e.stopPropagation()}>
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
          <button className="modal-btn modal-btn-danger" onClick={onConfirm || undefined}>
            删除
          </button>
        </div>
      </div>
    </div>
  )
}

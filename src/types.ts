export interface FileItem {
  id: string
  name: string
  content: string
  folderId: string | null
  createdAt: string
  updatedAt: string
}

export interface FolderItem {
  id: string
  name: string
  createdAt: string
}

export interface ModalState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: (() => void) | null
}

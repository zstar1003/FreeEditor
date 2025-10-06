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

export interface Template {
  id: string
  name: string
  content: string
  createdAt: string
  isDefault: boolean
}

export interface StyleTemplate {
  id: string
  name: string
  fontFamily: string
  fontSize: number
  textAlign: 'left' | 'right' | 'center' | 'justify'
  h1Style: string
  h2Style: string
  h3Style: string
  codeStyle: string
  preStyle: string
  blockquoteStyle: string
  isDefault: boolean
  createdAt: string
}

export interface StyleConfig {
  fontFamily: string
  fontSize: number
  textAlign: 'left' | 'right' | 'center' | 'justify'
  h1: string
  h2: string
  h3: string
  code: string
  pre: string
  blockquote: string
}

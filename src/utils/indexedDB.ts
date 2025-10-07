import { FileItem, FolderItem } from '../types'

const DB_NAME = 'MarkdownEditorDB'
const DB_VERSION = 1
const FILES_STORE = 'files'
const FOLDERS_STORE = 'folders'
const CONFIG_STORE = 'config'

class IndexedDBManager {
  private db: IDBDatabase | null = null

  // 初始化数据库
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建 files 存储
        if (!db.objectStoreNames.contains(FILES_STORE)) {
          const filesStore = db.createObjectStore(FILES_STORE, { keyPath: 'id' })
          filesStore.createIndex('folderId', 'folderId', { unique: false })
          filesStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }

        // 创建 folders 存储
        if (!db.objectStoreNames.contains(FOLDERS_STORE)) {
          db.createObjectStore(FOLDERS_STORE, { keyPath: 'id' })
        }

        // 创建 config 存储（用于存储配置信息）
        if (!db.objectStoreNames.contains(CONFIG_STORE)) {
          db.createObjectStore(CONFIG_STORE, { keyPath: 'key' })
        }
      }
    })
  }

  // 确保数据库已初始化
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  // ==================== Files 操作 ====================

  async getAllFiles(): Promise<FileItem[]> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILES_STORE, 'readonly')
      const store = transaction.objectStore(FILES_STORE)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getFile(id: string): Promise<FileItem | undefined> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILES_STORE, 'readonly')
      const store = transaction.objectStore(FILES_STORE)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveFile(file: FileItem): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILES_STORE, 'readwrite')
      const store = transaction.objectStore(FILES_STORE)
      const request = store.put(file)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async saveFiles(files: FileItem[]): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILES_STORE, 'readwrite')
      const store = transaction.objectStore(FILES_STORE)

      let completed = 0
      const total = files.length

      if (total === 0) {
        resolve()
        return
      }

      files.forEach(file => {
        const request = store.put(file)
        request.onsuccess = () => {
          completed++
          if (completed === total) {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  async deleteFile(id: string): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILES_STORE, 'readwrite')
      const store = transaction.objectStore(FILES_STORE)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearFiles(): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILES_STORE, 'readwrite')
      const store = transaction.objectStore(FILES_STORE)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // ==================== Folders 操作 ====================

  async getAllFolders(): Promise<FolderItem[]> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FOLDERS_STORE, 'readonly')
      const store = transaction.objectStore(FOLDERS_STORE)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getFolder(id: string): Promise<FolderItem | undefined> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FOLDERS_STORE, 'readonly')
      const store = transaction.objectStore(FOLDERS_STORE)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveFolder(folder: FolderItem): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FOLDERS_STORE, 'readwrite')
      const store = transaction.objectStore(FOLDERS_STORE)
      const request = store.put(folder)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async saveFolders(folders: FolderItem[]): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FOLDERS_STORE, 'readwrite')
      const store = transaction.objectStore(FOLDERS_STORE)

      let completed = 0
      const total = folders.length

      if (total === 0) {
        resolve()
        return
      }

      folders.forEach(folder => {
        const request = store.put(folder)
        request.onsuccess = () => {
          completed++
          if (completed === total) {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  async deleteFolder(id: string): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FOLDERS_STORE, 'readwrite')
      const store = transaction.objectStore(FOLDERS_STORE)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearFolders(): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FOLDERS_STORE, 'readwrite')
      const store = transaction.objectStore(FOLDERS_STORE)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // ==================== Config 操作 ====================

  async getConfig<T>(key: string): Promise<T | null> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CONFIG_STORE, 'readonly')
      const store = transaction.objectStore(CONFIG_STORE)
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.value : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async setConfig<T>(key: string, value: T): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CONFIG_STORE, 'readwrite')
      const store = transaction.objectStore(CONFIG_STORE)
      const request = store.put({ key, value })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteConfig(key: string): Promise<void> {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CONFIG_STORE, 'readwrite')
      const store = transaction.objectStore(CONFIG_STORE)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // ==================== 批量操作 ====================

  async replaceAllData(files: FileItem[], folders: FolderItem[]): Promise<void> {
    await this.clearFiles()
    await this.clearFolders()
    await this.saveFiles(files)
    await this.saveFolders(folders)
  }

  // ==================== 迁移工具 ====================

  // 从 localStorage 迁移数据到 IndexedDB
  async migrateFromLocalStorage(): Promise<{ files: number, folders: number }> {
    try {
      // 读取 localStorage 中的数据
      const filesStr = localStorage.getItem('markdownFiles')
      const foldersStr = localStorage.getItem('folders')

      const files: FileItem[] = filesStr ? JSON.parse(filesStr) : []
      const folders: FolderItem[] = foldersStr ? JSON.parse(foldersStr) : []

      // 保存到 IndexedDB
      await this.replaceAllData(files, folders)

      return { files: files.length, folders: folders.length }
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }
}

// 导出单例
export const dbManager = new IndexedDBManager()

// 初始化数据库
dbManager.init().catch(err => {
  console.error('Failed to initialize IndexedDB:', err)
})

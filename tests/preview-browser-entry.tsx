import React from 'react'
import { createRoot } from 'react-dom/client'
import Preview from '../src/components/Preview'
import XiaohongshuCard from '../src/components/XiaohongshuCard'
import { sanitizeHtml } from '../src/utils/sanitizeHtml'

const root = createRoot(document.getElementById('root')!)
Object.assign(window, {
  sanitizeHtml,
  renderTest: (mode: string, content: string) => {
    root.render(mode === 'card'
      ? <XiaohongshuCard content={content} isOpen={true} onClose={() => {}} theme="light" />
      : <Preview content={content} theme="light" />)
  },
})

import JSZip from 'jszip'

// Flat, portable names: titles must never become ZIP paths or Windows devices.
export function safeExportName(name: string): string {
  let safe = name.normalize('NFC').replace(/[\x00-\x1f\x7f/\\<>:"|?*]/g, '_')
    .trim().replace(/[. ]+$/g, '')
  safe = Array.from(safe).slice(0, 60).join('').replace(/[. ]+$/g, '')
  if (!safe || safe === '.' || safe === '..') safe = '未命名'
  if (/^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(safe)) safe = `_${safe}`
  return safe
}

// Preserve every selected article, including duplicates across different folders.
// Case/Unicode-equivalent names also collide on common extraction filesystems.
export function createMarkdownZip(files: readonly { name: string; content: string }[]): JSZip {
  const zip = new JSZip()
  const used = new Set<string>()
  for (const file of files) {
    const base = safeExportName(file.name)
    let name = `${base}.md`
    let suffix = 2
    while (used.has(name.normalize('NFKC').toUpperCase().toLowerCase())) name = `${base} (${suffix++}).md`
    used.add(name.normalize('NFKC').toUpperCase().toLowerCase())
    zip.file(name, file.content)
  }
  return zip
}

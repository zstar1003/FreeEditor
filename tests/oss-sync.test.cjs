const { test } = require('node:test')
const assert = require('node:assert/strict')
const { buildSync } = require('esbuild')
const vm = require('node:vm')
const indexPath = 'freeeditor/backup/index.json'
const articlePath = id => `freeeditor/backup/articles/${id}.json`
const file = id => ({ id, name: id, content: id, folderId: null, createdAt: '2026-01-01', updatedAt: '2026-01-01' })
const code = buildSync({ entryPoints: [process.env.OSS_SOURCE || 'src/utils/ossBackup.ts'], bundle: true, platform: 'node', format: 'cjs', external: ['ali-oss'], write: false }).outputFiles[0].text
function setup(files = [], folders = [], options = {}) {
  const objects = new Map([[indexPath, JSON.stringify({ fileMetadata: files, folders, deletedItems: options.deletedItems })], ...files.map(f => [articlePath(f.id), JSON.stringify({ id: f.id, content: f.content })])])
  const writes = []
  const headers = []
  const reads = []
  let aclChecks = 0
  class OSS {
    async getBucketACL() {
      aclChecks++
      if (options.aclError) throw new Error('ACL unavailable')
      return { acl: options.acl || 'private' }
    }
    async get(key) {
      reads.push(key)
      if (options.errorKey === key) throw new Error('synthetic network failure')
      if (options.fail === key || !objects.has(key)) throw Object.assign(new Error('missing'), { code: 'NoSuchKey' })
      return { content: Buffer.from(objects.get(key)) }
    }
    async put(key, blob, config) { headers.push(config?.headers); writes.push(key); objects.set(key, await blob.text()) }
  }
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports: module.exports, require: () => OSS, Blob, Buffer, console, localStorage: { getItem: key => key === 'ossBackupConfig' ? (options.noBackup ? null : JSON.stringify({ region: 'test', accessKeyId: 'synthetic', accessKeySecret: 'synthetic', bucket: 'backup-test' })) : JSON.stringify({ bucket: options.sameBucket ? 'backup-test' : 'image-test' }) } })
  return { sync: module.exports.syncWithOSS, api:module.exports, objects, writes, headers, reads, aclChecks:()=>aclChecks }
}
test('remote-only document B is merged, not tombstoned', async () => {
  const s = setup([file('A'), file('B')]); const result = await s.sync([file('A')], [])
  assert.deepEqual(Array.from(result.files, f => f.id), ['A', 'B'])
  assert.equal(result.hasChanges, true)
  const index = JSON.parse(s.objects.get(indexPath))
  assert.equal(index.fileMetadata.length, 2); assert.equal(index.deletedItems, undefined)
})
test('remote-only folders are retained', async () => {
  const s = setup([file('A')], [{ id: 'folder', name: 'folder', createdAt: '2026-01-01' }]); const result = await s.sync([file('A')], [])
  assert.equal(result.folders.length, 1)
})
test('untrusted legacy tombstones do not delete local data', async () => {
  const s = setup([file('B')], [], { deletedItems: { files: ['A'], folders: ['folder'] } })
  const result = await s.sync([file('A')], [{ id: 'folder', name: 'folder', createdAt: '2026-01-01' }])
  assert.equal(result.files.length, 2); assert.equal(result.folders.length, 1)
})
test('missing remote article aborts before any upload', async () => {
  const s = setup([file('A'), file('B')], [], { fail: articlePath('B') })
  await assert.rejects(s.sync([file('A')], [])); assert.equal(s.writes.length, 0)
})
test('invalid article content aborts instead of replacing it with empty content', async () => {
  const s = setup([file('A')]); s.objects.set(articlePath('A'), '{}')
  await assert.rejects(s.sync([file('A')], [])); assert.equal(s.writes.length, 0)
})
test('invalid index aborts before any upload', async () => {
  const s = setup(); s.objects.set(indexPath, '{}')
  await assert.rejects(s.sync([file('A')], [])); assert.equal(s.writes.length, 0)
})
test('first backup still uploads when index alone is missing', async () => {
  const s = setup(); s.objects.delete(indexPath)
  await s.sync([file('A')], []); assert.equal(JSON.parse(s.objects.get(indexPath)).fileMetadata.length, 1)
})
test('empty local state downloads without writes', async () => {
  const s = setup([file('A')]); const result = await s.sync([], [])
  assert.equal(result.files.length, 1); assert.equal(s.writes.length, 0)
})
test('newer remote content wins and empty string is valid', async () => {
  const s = setup([{ ...file('A'), content: '', updatedAt: '2026-02-01' }]); const result = await s.sync([file('A')], [])
  assert.equal(result.files[0].content, '')
})

for (const key of [indexPath, articlePath('A')]) {
  test('network failure aborts without writes: ' + key, async () => {
    const s = setup([file('A')], [], { errorKey: key })
    await assert.rejects(s.sync([file('A')], [])); assert.equal(s.writes.length, 0)
  })
  test('malformed JSON aborts without writes: ' + key, async () => {
    const s = setup([file('A')]); s.objects.set(key, '{broken')
    await assert.rejects(s.sync([file('A')], [])); assert.equal(s.writes.length, 0)
  })
}

for (const options of [{noBackup:true},{sameBucket:true},{acl:'public-read'},{acl:'public-read-write'},{aclError:true}]) {
  for (const method of ['syncWithOSS','backupToOSS','restoreFromOSS','recoverOrphanedArticles']) {
    test('privacy guard prevents data IO: ' + method + ' ' + JSON.stringify(options), async()=>{
      const s=setup([],[],options)
      await assert.rejects(s.api[method]([file('A')],[]))
      assert.equal(s.writes.length,0); assert.equal(s.reads.length,0)
    })
  }
}
test('private backup writes explicit private ACL for index and content',async()=>{
  const s=setup(); s.objects.delete(indexPath)
  await s.sync([file('A')],[])
  assert.equal(s.aclChecks(),1)
  assert.equal(s.headers.length,2)
  assert.ok(s.headers.every(h=>h['x-oss-object-acl']==='private'))
})

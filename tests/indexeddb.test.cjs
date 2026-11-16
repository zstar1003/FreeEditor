const { test } = require('node:test')
const assert = require('node:assert/strict')
const { buildSync } = require('esbuild')
const { IDBFactory, IDBObjectStore } = require('fake-indexeddb')
const vm = require('node:vm')
const source = process.env.DB_SOURCE || 'src/utils/indexedDB.ts'
const code = buildSync({ entryPoints:[source], bundle:true, format:'cjs', platform:'node', write:false }).outputFiles[0].text
function setup() {
  const indexedDB = new IDBFactory()
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports:module.exports, indexedDB, console })
  return { manager:module.exports.dbManager, Manager:module.exports.dbManager.constructor, indexedDB }
}
const file = id => ({ id, name:id, content:id, createdAt:'2026-01-01', updatedAt:'2026-01-01', folderId:null })
const folder = id => ({ id, name:id, createdAt:'2026-01-01' })
const ids = items => Array.from(items, x=>x.id)
test('failed replacement rolls back clears and both stores, including after reopening', async () => {
  const { manager, Manager } = setup()
  await manager.replaceAllData([file('old')],[folder('old-folder')])
  const original = IDBObjectStore.prototype.put
  IDBObjectStore.prototype.put = function(value,...args) {
    if (value.id === 'bad') throw new Error('injected failure')
    return original.call(this,value,...args)
  }
  try { await assert.rejects(manager.replaceAllData([file('new')],[folder('bad')])) }
  finally { IDBObjectStore.prototype.put = original }
  const reopened = new Manager()
  assert.deepEqual(ids(await reopened.getAllFiles()),['old'])
  assert.deepEqual(ids(await reopened.getAllFolders()),['old-folder'])
})
test('asynchronous request error rolls back, never reports success', async () => {
  const { manager } = setup()
  await manager.replaceAllData([file('old')],[folder('old-folder')])
  const db = manager.db
  // Unique index creates an asynchronous ConstraintError after earlier requests succeed.
  db.close()
  // Use duplicate IDs plus add instead of put to inject a request error without changing source.
  manager.db = null
  const original = IDBObjectStore.prototype.put
  IDBObjectStore.prototype.put = function(value) { return this.add(value) }
  try { await assert.rejects(manager.replaceAllData([file('dup'),file('dup')],[])) }
  finally { IDBObjectStore.prototype.put = original }
  assert.deepEqual(ids(await manager.getAllFiles()),['old'])
  assert.deepEqual(ids(await manager.getAllFolders()),['old-folder'])
})
test('overlapping replacements commit complete snapshots in call order', async () => {
  const { manager } = setup()
  await Promise.all([
    manager.replaceAllData([file('first')],[folder('first')]),
    manager.replaceAllData([file('last')],[folder('last')])
  ])
  const result = await manager.getAllData()
  assert.deepEqual(ids(result.files),['last']); assert.deepEqual(ids(result.folders),['last'])
})
test('empty replacement commits both stores', async () => {
  const { manager } = setup()
  await manager.replaceAllData([file('old')],[folder('old')])
  await manager.replaceAllData([],[])
  const result = await manager.getAllData()
  assert.equal(result.files.length,0); assert.equal(result.folders.length,0)
})
test('read transaction abort rejects rather than returning partial data', async () => {
  const { manager } = setup(); await manager.init()
  const original = manager.db.transaction.bind(manager.db)
  manager.db.transaction = (...args) => {
    const transaction = original(...args)
    setImmediate(()=>transaction.abort())
    return transaction
  }
  await assert.rejects(manager.getAllData())
})

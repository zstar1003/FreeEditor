const { test } = require('node:test')
const assert = require('node:assert/strict')
const { build } = require('esbuild')
const vm = require('node:vm')
const React = require('react')
const { act, create } = require('react-test-renderer')
global.IS_REACT_ACT_ENVIRONMENT = true
async function setup(db, legacy = null, strict = false) {
  let syncs = 0
  const result = await build({
    entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',
    external:['react','react/jsx-runtime'],
    plugins:[{name:'boundaries',setup(build){
      build.onResolve({filter:/components\/|hooks\/useLocalStorage|utils\/ossBackup|utils\/indexedDB|\.css$/},a=>({path:a.path,namespace:'stub'}))
      build.onLoad({filter:/.*/,namespace:'stub'},a=>{
        if(a.path.includes('indexedDB')) return {contents:'export const dbManager = globalThis.testDB'}
        if(a.path.includes('ossBackup')) return {contents:'export const syncWithOSS = globalThis.testSync'}
        if(a.path.includes('useLocalStorage')) return {contents:'export default (key, value) => [key === "autoSyncConfig" ? {enabled:true,interval:5} : value, () => {}]'}
        if(a.path.endsWith('.css'))return {contents:''}
        return {contents:'export default () => null'}
      })
    }}]
  })
  const module={exports:{}}
  const window={ addEventListener(){},removeEventListener(){},setInterval:()=>1,clearInterval(){},location:{reload(){}} }
  const context={module,exports:module.exports,require,console,window,clearInterval(){},testDB:db,testSync:async()=>{syncs++;return {hasChanges:false}},localStorage:{getItem:()=>legacy}}
  vm.runInNewContext(result.outputFiles[0].text,context)
  let root
  await act(async()=>{root=create(strict ? React.createElement(React.StrictMode, null, React.createElement(module.exports.default)) : React.createElement(module.exports.default)); await new Promise(r=>setTimeout(r,20))})
  return {root, syncs:()=>syncs}
}
test('read failure blocks autosave, auto-sync and editing, without stale fallback', async()=>{
  let writes=0
  const s=await setup({init:async()=>{},getAllData:async()=>{throw Error('read failure')},replaceAllData:async()=>{writes++}},'[]')
  assert.equal(writes,0);assert.equal(s.syncs(),0)
  assert.match(JSON.stringify(s.root.toJSON()),/本地数据读取失败/)
  await act(async()=>s.root.unmount())
})
test('initial load pending cannot auto-sync empty state', async()=>{
  let resolve
  let writes=0
  const pending=new Promise(r=>resolve=r)
  const s=await setup({init:async()=>{},getAllData:()=>pending,replaceAllData:async()=>{writes++}})
  assert.equal(writes,0);assert.equal(s.syncs(),0)
  await act(async()=>{resolve({files:[],folders:[]}); await new Promise(r=>setTimeout(r,20))})
  assert.equal(writes,1);assert.equal(s.syncs(),1)
  await act(async()=>s.root.unmount())
})
test('failed autosave is visible instead of silently reporting success',async()=>{
  const s=await setup({init:async()=>{},getAllData:async()=>({files:[],folders:[]}),replaceAllData:async()=>{throw Error('quota')}})
  assert.match(JSON.stringify(s.root.toJSON()),/本地保存失败/)
  await act(async()=>s.root.unmount())
})

test('StrictMode obsolete initialization cannot read, migrate or lock current UI', async()=>{
  let rejectOld, reads=0, writes=0, calls=0
  const old=new Promise((_,reject)=>rejectOld=reject)
  const s=await setup({
    init:()=>++calls===1?old:Promise.resolve(),
    getAllData:async()=>{reads++;return {files:[],folders:[]}},
    replaceAllData:async()=>{writes++}
  },null,true)
  assert.equal(reads,1)
  await act(async()=>{rejectOld(Error('obsolete open failure')); await new Promise(r=>setTimeout(r,10))})
  assert.doesNotMatch(JSON.stringify(s.root.toJSON()),/本地数据读取失败/)
  assert.equal(reads,1); assert.equal(writes,1)
  await act(async()=>s.root.unmount())
})

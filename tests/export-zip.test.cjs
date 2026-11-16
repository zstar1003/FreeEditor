const {test}=require('node:test')
const assert=require('node:assert/strict')
const {buildSync}=require('esbuild')
const vm=require('node:vm')
const JSZip=require('jszip')
const mod={exports:{}}
const code=buildSync({entryPoints:['src/utils/exportZip.ts'],bundle:true,packages:'external',format:'cjs',platform:'node',write:false}).outputFiles[0].text
vm.runInNewContext(code,{module:mod,exports:mod.exports,require})
const {createMarkdownZip,safeExportName}=mod.exports
const articles=names=>names.map((name,i)=>Object.freeze({name,content:`synthetic article ${i}\n# 正文\n\0${i}`,folderId:i%2?'A':'B'}))
async function reopen(files){
 const bytes=await createMarkdownZip(files).generateAsync({type:'nodebuffer'})
 const archive=await JSZip.loadAsync(bytes,{checkCRC32:true})
 const entries=Object.values(archive.files)
 assert.equal(entries.length,files.length)
 assert.ok(entries.every(e=>!e.dir))
 assert.deepEqual((await Promise.all(entries.map(e=>e.async('string')))).sort(),files.map(f=>f.content).sort())
 const names=entries.map(e=>e.name)
 assert.equal(new Set(names.map(n=>n.normalize('NFKC').toUpperCase().toLowerCase())).size,names.length)
 for(const name of names){
  assert.ok(!/[\x00-\x1f\x7f/\\<>:"|?*]/.test(name),name)
  assert.ok(!/^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(name),name)
  assert.ok(Buffer.byteLength(name)<=255,name)
 }
 return names
}
test('baseline: previous same-title ZIP silently loses first article',async()=>{
 const zip=new JSZip();zip.file('same.md','first');zip.file('same.md','second')
 const reopened=await JSZip.loadAsync(await zip.generateAsync({type:'nodebuffer'}))
 assert.equal(Object.keys(reopened.files).length,1)
 assert.equal(await reopened.file('same.md').async('string'),'second')
})
test('duplicates, existing suffixes and cross-folder selection preserve all content',async()=>{
 const names=await reopen(articles(['same','same','same (2)','Same','same']))
 assert.equal(names[0],'same.md');assert.equal(names[1],'same (2).md')
})
test('folder filtering exports only requested folder; independent archives reset suffixes',async()=>{
 const files=articles(['same','same','same','same'])
 assert.deepEqual(await reopen(files.filter(f=>f.folderId==='A')),['same.md','same (2).md'])
 assert.deepEqual(await reopen(files.filter(f=>f.folderId==='B')),['same.md','same (2).md'])
})
test('paths, empty titles, reserved devices, normalization and truncation collisions are safe',async()=>{
 await reopen(articles(['../escape','..\\escape','/absolute','C:\\drive','a/b','a\\b','',' ','.','..','con','NUL.txt','COM1','LPT¹','foo.','foo ','Foo','é','e\u0301','Ａ','A','Σ','σ','ς','I','i','ı','ß','SS','a\0b','a\nb','文'.repeat(200),'文'.repeat(201),'😀'.repeat(100),'😀'.repeat(101)]))
})
test('normal titles are preserved and input is not mutated; empty ZIP is valid',async()=>{
 const files=Object.freeze(articles(['中文标题','Article 1','a.b']))
 assert.deepEqual(await reopen(files),['中文标题.md','Article 1.md','a.b.md'])
 await reopen([])
 assert.equal(safeExportName('../folder'),'.._folder')
})
test('large duplicate group never overwrites generated suffixes',async()=>{
 await reopen(articles(Array.from({length:500},(_,i)=>i%3?'same':'same (2)')))
})

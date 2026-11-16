const { test } = require('node:test')
const assert = require('node:assert/strict')
const { build } = require('esbuild')
const { chromium } = require('playwright-core')
const http = require('node:http')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')

test('isolated Chromium: previews, final clipboard and card export reject active markup', async()=>{
  const out=await fs.mkdtemp(path.join(os.tmpdir(),'freeeditor-preview-'))
  await build({
    entryPoints:['tests/preview-browser-entry.tsx'],bundle:true,outdir:out,format:'iife',jsx:'automatic',
    loader:{'.woff':'file','.woff2':'file','.ttf':'file'},
    plugins:[{name:'fake-image-export',setup(b){
      b.onResolve({filter:/^html2canvas$/},()=>({path:'canvas',namespace:'mock'}))
      b.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:`
        export default async function(element) {
          window.__exports = [...(window.__exports || []), element.outerHTML];
          const canvas = document.createElement('canvas'); canvas.width=10;canvas.height=10;
          return canvas;
        }`}))
    }}]
  })
  const server=http.createServer(async(req,res)=>{
    if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end('<link rel="stylesheet" href="/preview-browser-entry.css"><div id="root"></div><script src="/preview-browser-entry.js"></script>');return}
    try {const name=path.basename(req.url.split('?')[0]);const data=await fs.readFile(path.join(out,name));if(name.endsWith('.css'))res.setHeader('Content-Type','text/css');if(name.endsWith('.js'))res.setHeader('Content-Type','text/javascript');res.end(data)}
    catch {res.statusCode=404;res.end('missing')}
  })
  await new Promise(r=>server.listen(0,'127.0.0.1',r))
  const origin='http://127.0.0.1:'+server.address().port
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']}).catch(async error=>{await new Promise(r=>server.close(r));throw error})
  try {
    const page=await browser.newPage()
    await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort())
    await page.goto(origin)
    await page.evaluate(()=>{
      localStorage.setItem('syntheticKey','SYNTHETIC-NOT-A-REAL-SECRET')
      localStorage.setItem('styleTemplates', JSON.stringify([{id:'synthetic',name:'synthetic',isDefault:true,
        fontFamily:'sans-serif',fontSize:15,textAlign:'left',
        h1Style:'color:red;\"><img src=/missing onerror="window.__leak=1"><h1 style="',
        h2Style:'',h3Style:'',codeStyle:'',preStyle:'',blockquoteStyle:''}]))
      Object.defineProperty(navigator,'clipboard',{value:{write:async(items)=>{window.__clipboard=await (await items[0].getType('text/html')).text()}}})
    })
    // Baseline proves that unsanitized marked output is active in this exact browser.
    await page.evaluate(()=>{
      const d=document.createElement('div')
      d.innerHTML='<img src="/missing" onerror="window.__baseline=localStorage.getItem(\'syntheticKey\')">'
      document.body.appendChild(d)
    })
    await page.waitForFunction(()=>window.__baseline==='SYNTHETIC-NOT-A-REAL-SECRET')
    await page.evaluate(()=>{ document.querySelector('body > div:not(#root)')?.remove() })
    const attack='<img src="/missing" onerror="window.__leak=localStorage.getItem(\'syntheticKey\')"><svg onload="window.__leak=1"></svg><iframe srcdoc="<script>parent.__leak=1</script>"></iframe><a href="javascript:window.__leak=1">bad link</a><style>body{display:none}</style>'
    const md='# Title\n\n'+attack+'\n\n$x^2$\n\n$$\\frac{1}{2}$$\n\n```js\nconst x = "<tag>";\n```\n\n[good](https://example.com)\n\n- First\n- Second'
    await page.evaluate(md=>window.renderTest('preview',md),md)
    await page.waitForSelector('.desktop-preview .katex')
    assert.equal(await page.locator('.desktop-preview .katex').count(),2)
    assert.ok(await page.locator('.desktop-preview pre code .hljs-keyword').count())
    assert.equal(await page.locator('.desktop-preview a[href="https://example.com"]').count(),1)
    assert.equal(await page.locator('.desktop-preview [onerror], .desktop-preview [onload], .desktop-preview iframe, .desktop-preview style').count(),0)
    assert.equal(await page.evaluate(()=>window.__leak),undefined)
    await page.getByTitle('复制到微信公众号').click()
    await page.waitForFunction(()=>!!window.__clipboard)
    const clipboard=await page.evaluate(()=>window.__clipboard)
    assert.ok(clipboard.includes('katex'));assert.ok(clipboard.includes('style='))
    assert.ok(!/onerror|onload|javascript:|<iframe|<style/i.test(clipboard))
    // Reparse the final rich text, after all WeChat transformations.
    await page.evaluate(html=>{const d=document.createElement('div');d.innerHTML=html;document.body.appendChild(d)},clipboard)
    await page.waitForTimeout(100)
    assert.equal(await page.evaluate(()=>window.__leak),undefined)
    await page.evaluate(md=>window.renderTest('card',md),'# '+attack+'\n\nA harmless paragraph')
    await page.waitForSelector('.xhs-card-body')
    await page.waitForTimeout(200)
    assert.equal(await page.evaluate(()=>window.__leak),undefined)
    assert.equal(await page.locator('.xhs-card-body [onerror], .xhs-card-body iframe').count(),0)
    // Snapshot every HTML sink handed to the rasterizer, including the batch title.
    const buttons=await page.locator('button').allTextContents()
    const batch=page.getByRole('button',{name:/导出全部|全部导出/})
    if(await batch.count()) {
      await batch.first().click()
      await page.waitForFunction(()=>window.__exports?.length>0)
      const exports=await page.evaluate(()=>window.__exports)
      assert.ok(exports.every(html=>!/<img[^>]*onerror|<svg[^>]*onload|<iframe/i.test(html)))
    } else throw Error('Batch export control absent: '+buttons.join(','))
    assert.equal(await page.evaluate(()=>window.__leak),undefined)
    const cleaned=await page.evaluate(()=>window.sanitizeHtml('<p style="background:url(https://invalid.test/a)">x</p><img src="data:image/svg+xml;base64,PHN2Zz4="><a href="file:///tmp/x">file</a>'))
    assert.ok(!/url\(|svg\+xml|file:/i.test(cleaned))
    await page.evaluate(()=>{
      const samples = [
        '<img src="/missing" alt="&lt;img src=/missing onerror=window.__leak=1&gt;">',
        '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=/missing onerror=window.__leak=1>">',
        '<svg><foreignObject><img src=/missing onerror=window.__leak=1></foreignObject></svg>',
        '<a href="java&#10;script:window.__leak=1">bad</a>'
      ]
      for (const sample of samples) {
        const d=document.createElement('div');d.innerHTML=window.sanitizeHtml(sample);document.body.appendChild(d)
      }
    })
    await page.waitForTimeout(100)
    assert.equal(await page.evaluate(()=>window.__leak),undefined)
  } finally { await browser.close();await new Promise(r=>server.close(r));await fs.rm(out,{recursive:true,force:true}) }
})

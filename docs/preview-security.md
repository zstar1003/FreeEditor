# Markdown 预览安全边界

Markdown 可包含原始 HTML，不能直接写入页面。预览、小红书测量/分页/图片导出及微信公众号富文本复制现在统一使用 DOMPurify；在样式、图片标题和微信格式等二次处理之后，最终 HTML 仍再次净化。导出标题使用 textContent，不拼接 HTML。

保留常用 Markdown、KaTeX MathML/SVG、代码高亮和内联排版；删除脚本、事件属性、iframe、表单等活动内容，限制危险 URL 和样式资源表达式。自定义 HTML、嵌入页面、SVG data URL 和部分复杂 CSS 会失效，这是安全边界而非兼容承诺。

这不是隔离沙箱或完整隐私防护：普通远程图片仍可能加载并暴露网络信息，用户点击外部链接仍会跳转。不要预览不可信敏感文档；浏览器中的 OSS 凭据仍为明文存储。补丁不能撤回此前已泄露的内容或凭据。若怀疑已受影响，应由所有者审计并更换相关凭据。

## 验证

```sh
npm ci --ignore-scripts
npm ci --prefix tests --ignore-scripts
CHROMIUM_PATH=/usr/bin/google-chrome node --test tests/preview-security.test.cjs
```

浏览器测试使用临时页面、合成 localStorage 字符串，并阻断非本地请求。测试实际预览组件、KaTeX/代码/链接、最终剪贴板 HTML、小红书页面及批量导出 DOM；图片栅格化器是替身，不验证真实像素效果。测试还证明同一浏览器中未经净化的事件 HTML 能读取合成字符串，不涉及真实凭据。

CI 在 Chromium 上运行，不代表所有浏览器、Electron 或微信公众号客户端行为均验证。DOMPurify 需持续跟进安全更新。此补丁不验证历史用户是否遭到利用。

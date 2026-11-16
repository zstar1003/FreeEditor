# 本地保存安全边界

全量自动保存现在在同一个 IndexedDB 事务中清空并写入 files/folders，只在事务完成时报告成功；写入失败会回滚整个快照。初始化从同一个只读事务读取完整快照。

读取失败不是空数据库：界面阻止编辑、自动保存和自动 OSS 同步，并提供重新加载按钮。不再用旧 localStorage 快照或空数组覆盖读取失败的数据库。旧 localStorage 仅在成功读到空数据库时迁移，迁移失败保留旧数据。StrictMode 的过期初始化回调不会更新当前界面。

保存失败会显示警告；保存中或失败时尝试关闭页面会请求浏览器确认。浏览器不保证一定显示离开提示，进程强退、断电、容量限制或尚未提交的编辑仍可能丢失。请保留独立导出备份。

本修复不提供多标签页/多进程版本冲突检测，仍可能最后写入者覆盖较新数据；也不处理 OSS 同步与本地编辑冲突。其他单条数据库辅助方法未改造，不应据此宣称所有持久化入口都是事务级确认。

## 测试

在仓库安装前端依赖后：

```sh
npm ci --prefix tests
node --test tests/indexeddb.test.cjs tests/storage-ui.test.cjs tests/oss-sync.test.cjs
npm run build
```

测试使用 fake-indexeddb、真实 App React hooks 与模拟组件/同步边界，涵盖写入中断回滚、重新打开、重叠写入、读取失败、初始化期间禁止同步、保存失败提示与 StrictMode。未在真实浏览器或打包 Electron 中验证磁盘持久化、配额、崩溃恢复或退出提示。

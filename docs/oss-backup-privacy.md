# OSS 文档备份隐私

旧版设置指引要求公共读 Bucket，同时图片与备份共用同一配置。文档索引和全文位于 `freeeditor/backup/`，上传未指定对象 ACL，可能继承公共读权限。不能据此断定任何实际 Bucket 已公开或被访问。

## 新版行为

- 图片继续使用 `ossImageBedConfig`；文档同步、备份、恢复改用独立的 `ossBackupConfig`，不自动迁移旧配置。
- 配置缺失、与当前图片 Bucket 相同、Bucket ACL 不是 private 或 ACL 查询失败时，停止备份数据读写。已有自动同步设置不会绕过检查。
- 所有新上传的索引和文章显式附带 `x-oss-object-acl: private`。不调用修改 Bucket ACL 的 API，不自动扫描或修改旧 Bucket。
- 私有 Bucket 的图片直接公开 URL 可能无法访问，不能为了恢复图片显示而将文档备份 Bucket 改为公共读。图片和草稿必须分开管理。

## 必须人工检查的边界

Bucket ACL 检查不是有效权限审计。还须检查对象 ACL、Bucket Policy、RAM 授权、CDN/代理缓存、历史版本及已分发链接；程序不会验证这些。新的私有配置不撤回已经公开的草稿或历史副本，也不自动迁移或恢复旧数据。

先保留独立本地导出，再由 Bucket 所有者核查历史 `freeeditor/backup/` 数据的访问策略和日志，决定是否修改权限或迁移；不要直接运行“恢复孤立文章”，它会写索引。

为独立备份 Bucket 创建最小权限凭据，允许必要对象读写及 Bucket ACL 查询（`oss:GetBucketAcl`）；显式对象 ACL 写入也可能要求 `oss:PutObjectAcl`。不要使用主账号密钥，也不要为排错授予全账号访问。CORS 仅允许实际编辑器来源及必要请求/header，CORS 不能替代鉴权。程序的 AccessKey 仍明文保存于浏览器 localStorage，不适合共享设备。

本变更不修复同步的非原子上传、跨设备并发或历史丢失问题，见 [同步安全边界](oss-sync-safety.md)。

## 验证与依据

假 OSS 测试覆盖全部四个入口的配置隔离、公共读拒绝、ACL 查询失败及每次上传的 private header。没有访问实际 Bucket、修改真实权限或验证阿里云 CORS/RAM/策略效果。

- [阿里云权限与访问控制](https://www.alibabacloud.com/help/en/oss/user-guide/permissions-and-access-control-overview)
- [对象 ACL](https://www.alibabacloud.com/help/en/oss/user-guide/object-acl)
- SDK `ali-oss` 的 `getBucketACL` 返回 `acl`；任何异常均中止。

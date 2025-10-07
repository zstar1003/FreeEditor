<div align="center">
  <img src="assets/logo_with_text.png" width="400" alt="LOGO">
</div>

<div align="center">
  <h4>
    <a href="README.md">🇨🇳 中文</a>
    <span> | </span>
    <a href="README_EN.md">🇬🇧 English</a>
  </h4>
</div>

一款简洁的 双栏 Markdown 编辑器，支持实时预览和微信公众号样式导出。

![demo](assets/demo.png)

 在线使用：https://xdxsb.top/FreeEditor

## ✨ 特性

- 📝 **实时预览** - 边写边看，所见即所得
- 🎨 **丰富样式库** - 内置多种精美的标题、代码、引用块样式
- 📱 **移动端预览** - 支持手机视图预览，适配微信公众号
- 📋 **一键复制** - 直接复制富文本，可粘贴到微信公众号编辑器
- 🌓 **主题切换** - 支持深色/浅色主题
- 📂 **文件夹管理** - 支持文件夹分类管理文档，拖拽移动文件
- 🖼️ **图片上传** - 支持拖拽/粘贴上传图片到阿里云 OSS
- ⌨️ **快捷键支持** - 丰富的编辑快捷键，提升编辑效率
- 🔄 **撤销/重做** - 支持编辑历史记录，Ctrl+Z 撤销操作
- ✏️ **格式化工具栏** - 选中文本即可快速格式化
- 💾 **本地存储** - 自动保存，数据存储在本地
- 🔧 **备份恢复** - 支持数据导出和导入
- 🖥️ **Electron支持** - 可打包成桌面应用

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# Web 开发
npm run dev

# Electron 开发
npm run electron:dev
```

### 构建

```bash
# Web 构建
npm run build

# Electron 构建
npm run electron:build
```

## 📖 功能说明

### 快捷键

编辑器支持以下快捷键：

- **Ctrl+B** / **Cmd+B** - 加粗选中文本
- **Ctrl+I** / **Cmd+I** - 斜体选中文本
- **Ctrl+U** / **Cmd+U** - 下划线选中文本
- **Ctrl+Z** / **Cmd+Z** - 撤销上一步操作
- **Ctrl+Shift+Z** / **Cmd+Shift+Z** - 重做
- **Ctrl+Y** / **Cmd+Y** - 重做
- **Tab** - 插入缩进

### 图片上传

配置阿里云 OSS 后，可以：

1. 直接粘贴图片到编辑器
2. 拖拽图片到编辑器
3. 自动上传并插入 Markdown 图片语法

在设置中配置 OSS 信息：

- Region（地域）
- AccessKey ID
- AccessKey Secret
- Bucket（存储空间）

### 文件管理

- 创建文件夹分类管理文档
- 拖拽文件到文件夹
- 右键文件/文件夹：重命名、下载、删除
- 右键空白区域：新建文件、新建文件夹
- 自动保存到本地存储
- 支持文件和文件夹下载（文件夹导出为 ZIP）

### 导出到微信公众号

1. 在预览区选择合适的样式
2. 点击复制按钮
3. 粘贴到微信公众号编辑器

## 🛠️ 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Marked** - Markdown 解析
- **Electron** - 桌面应用
- **阿里云 OSS** - 图片存储

## 📝 开发说明

### 项目结构

```
md_editor/
├── src/
│   ├── components/     # 组件
│   │   ├── Editor.tsx      # 编辑器
│   │   ├── Preview.tsx     # 预览区
│   │   ├── Sidebar.tsx     # 侧边栏
│   │   ├── Settings.tsx    # 设置
│   │   └── Modal.tsx       # 模态框
│   ├── styles/        # 样式
│   │   └── themes.ts       # 样式库
│   ├── utils/         # 工具
│   │   └── ossUpload.ts    # OSS上传
│   ├── types/         # 类型定义
│   ├── App.tsx        # 主应用
│   └── main.tsx       # 入口
├── electron/          # Electron 配置
├── public/            # 静态资源
└── package.json
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

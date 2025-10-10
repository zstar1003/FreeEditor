<div align="center">
  <img src="assets\ai_logo.jpeg"  alt="LOGO">
</div>

<div align="center">
  <h4>
    <a href="README.md">🇨🇳 中文</a>
    <span> | </span>
    <a href="README_EN.md">🇬🇧 English</a>
  </h4>
</div>

A clean dual-pane Markdown editor with real-time preview and WeChat Official Account style export.

You can access it online at https://xdxsb.top/FreeEditor

windows download：https://github.com/zstar1003/FreeEditor/releases/download/v1.0.0/FreeEditor.Setup.1.0.0.exe

## ✨ Features

- 📝 **Real-time Preview** - Live preview with WYSIWYG experience
- 🎨 **Rich Style Library** - Built-in beautiful styles for headings, code, and blockquotes
- 📱 **Mobile Preview** - Phone view preview, optimized for WeChat Official Accounts
- 📋 **One-Click Copy** - Copy rich text directly to WeChat editor
- 🌓 **Theme Switching** - Dark/Light theme support
- 📂 **Folder Management** - Organize documents with folders, drag-and-drop files
- 🖼️ **Image Upload** - Drag/paste to upload images to Alibaba Cloud OSS
- ⌨️ **Keyboard Shortcuts** - Rich editing shortcuts for efficiency
- 🔄 **Undo/Redo** - Edit history support with Ctrl+Z
- ✏️ **Formatting Toolbar** - Quick text formatting on selection
- 💾 **Local Storage** - Auto-save with local data storage
- 🔧 **Backup & Restore** - Data export and import support
- 🖥️ **Electron Support** - Package as desktop application

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
# Web Development
npm run dev

# Electron Development
npm run electron:dev
```

### Build

```bash
# Web Build
npm run build

# Electron Build
npm run electron:build
```

## 📖 Features Guide

### Keyboard Shortcuts

The editor supports the following shortcuts:

- **Ctrl+B** / **Cmd+B** - Bold selected text
- **Ctrl+I** / **Cmd+I** - Italicize selected text
- **Ctrl+U** / **Cmd+U** - Underline selected text
- **Ctrl+Z** / **Cmd+Z** - Undo last operation
- **Ctrl+Shift+Z** / **Cmd+Shift+Z** - Redo
- **Ctrl+Y** / **Cmd+Y** - Redo (Windows style)
- **Tab** - Insert indentation

### Floating Formatting Toolbar

When text is selected, a formatting toolbar appears with:

- **B** - Bold (**text**)
- **I** - Italic (*text*)
- **U** - Underline (`<u>`text`</u>`)
- **S** - Strikethrough (~~text~~)

### Style Customization

Customize styles for:

- **Headings** - Multiple styles for H1/H2/H3
- **Code** - Inline code and code block styles
- **Blockquotes** - Various quote styles
- **Fonts** - Font family and size settings
- **Alignment** - Left/Center/Right/Justify alignment

### Image Upload

After configuring Alibaba Cloud OSS, you can:

1. Paste images directly into the editor
2. Drag images into the editor
3. Auto-upload and insert Markdown image syntax

Configure OSS in settings:

- Region
- AccessKey ID
- AccessKey Secret
- Bucket

### File Management

- Create folders to organize documents
- Drag files into folders
- Right-click on files/folders: Rename, Download, Delete
- Right-click on blank area: New File, New Folder
- Auto-save to local storage
- Download files and folders (folders export as ZIP)

### Export to WeChat Official Account

1. Select appropriate styles in preview area
2. Click copy button
3. Paste into WeChat Official Account editor

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Marked** - Markdown Parser
- **Electron** - Desktop Application
- **Alibaba Cloud OSS** - Image Storage

## 📝 Development Guide

### Project Structure

```
md_editor/
├── src/
│   ├── components/     # Components
│   │   ├── Editor.tsx      # Editor
│   │   ├── Preview.tsx     # Preview
│   │   ├── Sidebar.tsx     # Sidebar
│   │   ├── Settings.tsx    # Settings
│   │   └── Modal.tsx       # Modal
│   ├── styles/        # Styles
│   │   └── themes.ts       # Style Library
│   ├── utils/         # Utilities
│   │   └── ossUpload.ts    # OSS Upload
│   ├── types/         # Type Definitions
│   ├── App.tsx        # Main App
│   └── main.tsx       # Entry
├── electron/          # Electron Config
├── public/            # Static Assets
└── package.json
```

## 📄 License

MIT

## 🤝 Contributing

Issues and Pull Requests are welcome!

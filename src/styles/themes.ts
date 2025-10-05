export interface ElementStyle {
  id: string
  name: string
  style: string
}

// 一级标题样式库 - 丰富多样的样式选项
export const h1Styles: ElementStyle[] = [
  { id: 'h1-center-bold', name: '居中加粗', style: 'font-size: 24px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; text-align: center; line-height: 1.4;' },
  { id: 'h1-underline-blue', name: '蓝色下划线', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 2px solid #0084ff; padding-bottom: 8px;' },
  { id: 'h1-underline-gradient', name: '渐变下划线', style: 'font-size: 32px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1e1e1e; line-height: 1.3; border-bottom: 3px solid; border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1;' },
  { id: 'h1-underline-gray', name: '灰色下划线', style: 'font-size: 32px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25; border-bottom: 1px solid #d0d7de; padding-bottom: 8px;' },
  { id: 'h1-bg-gradient', name: '渐变背景', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 24px; border-radius: 8px; text-align: center;' },
  { id: 'h1-leftbar-green', name: '绿色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #07c160; padding-left: 16px;' },
  { id: 'h1-leftbar-orange', name: '橙色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #ff6b6b; padding-left: 16px; background: #fff5f5; padding: 12px 16px;' },
  { id: 'h1-shadow', name: '阴影效果', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #2c3e50; line-height: 1.4; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); padding-bottom: 8px;' },
  { id: 'h1-badge', name: '徽章样式', style: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: #1890ff; padding: 10px 20px; border-radius: 20px; display: inline-block;' },
  { id: 'h1-double-line', name: '双线装饰', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-top: 3px solid #333; border-bottom: 3px solid #333; padding: 12px 0; text-align: center;' },
  { id: 'h1-badge-arrow', name: '标签箭头', style: 'border-bottom: 2px solid #ef7060; margin: 30px 0 15px 0; padding: 0; display: flex; align-items: unset; line-height: 1.1em; position: relative;' },
  { id: 'h1-badge-tag', name: '标签样式', style: 'font-size: 22px; font-weight: 700; margin: 30px 0 15px 0; padding: 3px 10px; color: #fff; background: #ef7060; line-height: 1.5em; display: inline-block; border-radius: 3px 3px 0 0; position: relative;' },
]

// 二级标题样式库
export const h2Styles: ElementStyle[] = [
  { id: 'h2-simple', name: '简约', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;' },
  { id: 'h2-leftbar-blue', name: '蓝色左边框', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #0084ff; padding-left: 12px;' },
  { id: 'h2-leftbar-purple', name: '紫色左边框', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #9b59b6; padding-left: 12px;' },
  { id: 'h2-underline', name: '底部边框', style: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 1px solid #e4e6eb; padding-bottom: 8px;' },
  { id: 'h2-bg-light', name: '浅色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #f8f9fa; padding: 8px 12px; border-radius: 4px;' },
  { id: 'h2-number', name: '序号样式', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; counter-increment: h2-counter; position: relative; padding-left: 40px;' },
  { id: 'h2-ribbon', name: '丝带样式', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: #ff6b6b; padding: 8px 16px 8px 20px; position: relative; margin-left: -10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.2);' },
  { id: 'h2-bookmark', name: '书签样式', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: #1890ff; padding: 8px 16px; border-radius: 4px 4px 0 0; display: inline-block;' },
  { id: 'h2-red-leftbar', name: '红色左边框', style: 'margin: 30px 0 15px 0; padding: 10px 0 10px 10px; border-left: 5px solid #f83929; font-size: 18px; font-weight: bold; color: #222222; line-height: 1.8em; letter-spacing: 0em;' },
]

// 三级标题样式库
export const h3Styles: ElementStyle[] = [
  { id: 'h3-simple', name: '简约', style: 'font-size: 18px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;' },
  { id: 'h3-leftbar', name: '左边框', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #3498db; padding-left: 10px;' },
  { id: 'h3-dot', name: '圆点装饰', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; padding-left: 20px; position: relative;' },
  { id: 'h3-bg', name: '背景色', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #2c3e50; line-height: 1.4; background: #ecf0f1; padding: 6px 10px; display: inline-block; border-radius: 3px;' },
  { id: 'h3-bold', name: '加粗强调', style: 'font-size: 22px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;' },
]

// 行内代码样式库
export const codeStyles: ElementStyle[] = [
  { id: 'code-gray-red', name: '灰底红字', style: 'background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: Consolas, Monaco, Menlo, monospace; font-size: 14px; color: #d73a49;' },
  { id: 'code-gray-blue', name: '灰底蓝字', style: 'background: #f6f6f6; padding: 2px 8px; border-radius: 3px; font-family: "SF Mono", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #0084ff;' },
  { id: 'code-pink-red', name: '粉底红字', style: 'background: #fff5f5; padding: 2px 8px; border-radius: 3px; font-family: "Fira Code", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #e74c3c; border: 1px solid #ffe0e0;' },
  { id: 'code-blue-dark', name: '蓝底深色', style: 'background: #e8f4fd; padding: 3px 8px; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; font-size: 14px; color: #0366d6;' },
  { id: 'code-green', name: '绿色主题', style: 'background: #f0fff4; padding: 2px 8px; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 14px; color: #22863a; border: 1px solid #c3f1d4;' },
  { id: 'code-purple', name: '紫色主题', style: 'background: #f5f0ff; padding: 2px 8px; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 14px; color: #6f42c1; border: 1px solid #e0d4ff;' },
  { id: 'code-border', name: '边框样式', style: 'background: #fff; padding: 2px 8px; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 14px; color: #e83e8c; border: 1px solid #e83e8c;' },
]

// 代码块样式库
export const preStyles: ElementStyle[] = [
  { id: 'pre-leftbar-green', name: '绿色左边框', style: 'background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; margin-bottom: 14px; border-left: 3px solid #07c160;' },
  { id: 'pre-simple-gray', name: '简约灰色', style: 'background: #f6f6f6; padding: 16px; border-radius: 4px; overflow-x: auto; margin-bottom: 16px;' },
  { id: 'pre-border', name: '边框样式', style: 'background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #e1e4e8;' },
  { id: 'pre-dark', name: '深色主题', style: 'background: #2d2d2d; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; color: #f8f8f2;' },
  { id: 'pre-mac', name: 'Mac窗口', style: 'background: #1e1e1e; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); color: #f8f8f2;' },
  { id: 'pre-mac-dark', name: 'Mac深色', style: 'background: #282c34; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); color: #abb2bf;' },
  { id: 'pre-gradient', name: '渐变背景', style: 'background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #667eea30;' },
  { id: 'pre-terminal', name: '终端样式', style: 'background: #0c0c0c; padding: 16px; border-radius: 4px; overflow-x: auto; margin-bottom: 16px; color: #00ff00; font-family: "Courier New", monospace; border: 2px solid #333;' },
  { id: 'pre-card', name: '卡片样式', style: 'background: #fff; padding: 20px; border-radius: 12px; overflow-x: auto; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;' },
  { id: 'pre-neon', name: '霓虹效果', style: 'background: #1a1a2e; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; border: 2px solid #00d9ff; box-shadow: 0 0 10px rgba(0,217,255,0.5); color: #e0e0e0;' },
  { id: 'pre-mac-window', name: 'Mac窗口装饰', style: 'border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.55); margin: 10px 0; padding: 0; position: relative;' },
]

// 引用块样式库
export const blockquoteStyles: ElementStyle[] = [
  { id: 'quote-leftbar-green', name: '绿色左边框', style: 'border-left: 4px solid #07c160; padding: 10px 14px; color: #666; margin: 14px 0; background: #f7f7f7; border-radius: 4px;' },
  { id: 'quote-leftbar-blue', name: '蓝色左边框', style: 'border-left: 4px solid #0084ff; padding: 12px 16px; color: #646464; margin: 16px 0; background: #f9f9f9; font-style: italic;' },
  { id: 'quote-leftbar-purple', name: '紫色左边框', style: 'border-left: 4px solid #9b59b6; padding: 12px 16px; color: #555; margin: 16px 0; background: #f8f5ff;' },
  { id: 'quote-border-all', name: '全边框', style: 'border: 1px solid #e0e0e0; border-left: 4px solid #ffa500; padding: 12px 16px; color: #666; margin: 16px 0; background: #fffbf0; border-radius: 4px;' },
  { id: 'quote-simple', name: '简约样式', style: 'border-left: 4px solid #d0d7de; padding: 0 16px; color: #57606a; margin: 16px 0;' },
  { id: 'quote-bg-gray', name: '灰色背景', style: 'border-left: 4px solid #34495e; padding: 12px 16px; color: #2c3e50; margin: 16px 0; background: #ecf0f1; font-style: italic;' },
  { id: 'quote-shadow', name: '阴影效果', style: 'border-left: 4px solid #3498db; padding: 12px 16px; color: #555; margin: 16px 0; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 4px;' },
  { id: 'quote-icon', name: '引号装饰', style: 'border-left: 4px solid #e74c3c; padding: 12px 16px 12px 40px; color: #555; margin: 16px 0; background: #fef5f5; position: relative; font-style: italic;' },
  { id: 'quote-highlight', name: '高亮样式', style: 'border-left: none; padding: 12px 16px; color: #333; margin: 16px 0; background: linear-gradient(90deg, #fffbea 0%, #fff 100%); border-radius: 4px; font-weight: 500;' },
  { id: 'quote-paper', name: '纸张效果', style: 'border: 1px solid #d4d4d4; border-left: 4px solid #8b7355; padding: 16px; color: #555; margin: 16px 0; background: #fefdfb; box-shadow: 2px 2px 5px rgba(0,0,0,0.1); font-family: Georgia, serif;' },
]

export interface FontConfig {
  fontFamily: string
  fontSize: number
}

export const fontFamilies = [
  { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif', label: '系统默认' },
  { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Songti SC", SimSun, serif', label: '宋体' },
  { value: '"PingFang SC", "Microsoft YaHei", sans-serif', label: '苹方/微软雅黑' },
]

export const fontSizes = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24]

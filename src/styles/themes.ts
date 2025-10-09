export interface ElementStyle {
  id: string
  name: string
  style: string
  category?: string
}

// 一级标题样式库 - 按风格分类
export const h1Styles: ElementStyle[] = [
  // 基础样式
  { id: 'h1-center-bold', name: '居中加粗', style: 'font-size: 24px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; text-align: center; line-height: 1.4;', category: '基础' },
  { id: 'h1-simple', name: '简约', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4;', category: '基础' },

  // 橙心系列
  { id: 'h1-orange-leftbar', name: '橙色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #ff6b6b; padding-left: 16px; background: #fff5f5; padding: 12px 16px;', category: '橙心' },
  { id: 'h1-orange-underline', name: '橙色下划线', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 3px solid #ff6b6b; padding-bottom: 8px;', category: '橙心' },
  { id: 'h1-orange-bg', name: '橙色背景', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: #ff6b6b; padding: 12px 24px; border-radius: 8px;', category: '橙心' },
  { id: 'h1-orange-badge', name: '橙色徽章', style: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: #ff8787; padding: 10px 20px; border-radius: 20px; display: inline-block;', category: '橙心' },

  // 绿意系列
  { id: 'h1-green-leftbar', name: '绿色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #07c160; padding-left: 16px;', category: '绿意' },
  { id: 'h1-green-underline', name: '绿色下划线', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 3px solid #07c160; padding-bottom: 8px;', category: '绿意' },
  { id: 'h1-green-bg', name: '绿色背景', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: #07c160; padding: 12px 24px; border-radius: 8px;', category: '绿意' },
  { id: 'h1-green-fresh', name: '清新绿', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #07c160; line-height: 1.4; background: #f0fff4; padding: 12px 16px; border-radius: 8px; border: 2px solid #07c160;', category: '绿意' },

  // 蓝莹系列
  { id: 'h1-underline-blue', name: '蓝色下划线', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 2px solid #0084ff; padding-bottom: 8px;', category: '蓝莹' },
  { id: 'h1-blue-leftbar', name: '蓝色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #0084ff; padding-left: 16px;', category: '蓝莹' },
  { id: 'h1-blue-bg', name: '蓝色背景', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: #0084ff; padding: 12px 24px; border-radius: 8px;', category: '蓝莹' },
  { id: 'h1-blue-gradient', name: '蓝色渐变', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: linear-gradient(135deg, #0084ff 0%, #00d4ff 100%); padding: 12px 24px; border-radius: 8px;', category: '蓝莹' },

  // 姹紫系列
  { id: 'h1-underline-gradient', name: '渐变下划线', style: 'font-size: 28px; font-weight: 700; margin-top: 0; margin-bottom: 4px; color: #1e1e1e; line-height: 1.3; border-bottom: 3px solid; border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1;', category: '姹紫' },
  { id: 'h1-bg-gradient', name: '渐变背景', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #fff; line-height: 1.4; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 24px; border-radius: 8px; text-align: center;', category: '姹紫' },
  { id: 'h1-purple-leftbar', name: '紫色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #9b59b6; padding-left: 16px;', category: '姹紫' },
  { id: 'h1-purple-shadow', name: '紫色阴影', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #6f42c1; line-height: 1.4; background: #f5f0ff; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(111, 66, 193, 0.2);', category: '姹紫' },

  // 红绯系列
  { id: 'h1-badge-arrow', name: '红色箭头', style: 'border-bottom: 2px solid #ef7060; margin: 30px 0 15px 0; padding: 0; display: flex; align-items: unset; line-height: 1.1em; position: relative; font-size: 24px; font-weight: 700; color: #1a1a1a;', category: '红绯' },
  { id: 'h1-badge-tag', name: '标签样式', style: 'font-size: 22px; font-weight: 700; margin: 30px 0 15px 0; padding: 3px 10px; color: #fff; background: #ef7060; line-height: 1.5em; display: inline-block; border-radius: 3px 3px 0 0; position: relative;', category: '红绯' },
  { id: 'h1-red-leftbar', name: '红色左边框', style: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #e74c3c; padding-left: 16px; background: #fef5f5; padding: 12px 16px;', category: '红绯' },
  { id: 'h1-red-underline', name: '红色下划线', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 3px solid #e74c3c; padding-bottom: 8px;', category: '红绯' },

  // GitHub系列
  { id: 'h1-underline-gray', name: '灰色下划线', style: 'font-size: 32px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25; border-bottom: 1px solid #d0d7de; padding-bottom: 8px;', category: 'GitHub' },
  { id: 'h1-github-bold', name: 'GitHub加粗', style: 'font-size: 30px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;', category: 'GitHub' },

  // 其他装饰
  { id: 'h1-shadow', name: '阴影效果', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #2c3e50; line-height: 1.4; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); padding-bottom: 8px;', category: '装饰' },
  { id: 'h1-double-line', name: '双线装饰', style: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-top: 3px solid #333; border-bottom: 3px solid #333; padding: 12px 0; text-align: center;', category: '装饰' },
]

// 二级标题样式库 - 按风格分类
export const h2Styles: ElementStyle[] = [
  // 基础样式
  { id: 'h2-simple', name: '简约', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;', category: '基础' },
  { id: 'h2-underline', name: '底部边框', style: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 1px solid #e4e6eb; padding-bottom: 8px;', category: '基础' },

  // 橙心系列
  { id: 'h2-orange-leftbar', name: '橙色左边框', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #ff8787; padding-left: 12px;', category: '橙心' },
  { id: 'h2-orange-bg', name: '橙色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #fff5f5; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #ff6b6b;', category: '橙心' },
  { id: 'h2-orange-bookmark', name: '橙色书签', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: #ff6b6b; padding: 8px 16px; border-radius: 4px 4px 0 0; display: inline-block;', category: '橙心' },

  // 绿意系列
  { id: 'h2-green-leftbar', name: '绿色左边框', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #07c160; padding-left: 12px;', category: '绿意' },
  { id: 'h2-green-bg', name: '绿色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #f0fff4; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #07c160;', category: '绿意' },
  { id: 'h2-green-fresh', name: '清新绿卡', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #07c160; line-height: 1.4; background: #f0fff4; padding: 8px 12px; border-radius: 6px; border: 2px solid #07c160;', category: '绿意' },

  // 蓝莹系列
  { id: 'h2-leftbar-blue', name: '蓝色左边框', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #0084ff; padding-left: 12px;', category: '蓝莹' },
  { id: 'h2-blue-bg', name: '蓝色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #e8f4fd; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #0084ff;', category: '蓝莹' },
  { id: 'h2-bookmark', name: '蓝色书签', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: #1890ff; padding: 8px 16px; border-radius: 4px 4px 0 0; display: inline-block;', category: '蓝莹' },

  // 姹紫系列
  { id: 'h2-leftbar-purple', name: '紫色左边框', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #9b59b6; padding-left: 12px;', category: '姹紫' },
  { id: 'h2-purple-bg', name: '紫色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #f5f0ff; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #9b59b6;', category: '姹紫' },
  { id: 'h2-purple-gradient', name: '紫色渐变', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 8px 16px; border-radius: 6px;', category: '姹紫' },

  // 红绯系列
  { id: 'h2-red-leftbar', name: '红色左边框', style: 'margin: 10px 0 15px 0; padding: 0 0 0 10px; border-left: 5px solid #f83929; font-size: 17px; font-weight: bold; color: #222222; line-height: 1.8em; letter-spacing: 0em;', category: '红绯' },
  { id: 'h2-red-bg', name: '红色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #fef5f5; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #e74c3c;', category: '红绯' },
  { id: 'h2-red-ribbon', name: '红色丝带', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: #ff6b6b; padding: 8px 16px 8px 20px; position: relative; margin-left: -10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.2);', category: '红绯' },

  // GitHub系列
  { id: 'h2-github-underline', name: 'GitHub下划线', style: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 1px solid #e4e6eb; padding-bottom: 8px;', category: 'GitHub' },
  { id: 'h2-github-simple', name: 'GitHub简约', style: 'font-size: 22px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;', category: 'GitHub' },

  // 其他装饰
  { id: 'h2-bg-light', name: '浅色背景', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #f8f9fa; padding: 8px 12px; border-radius: 4px;', category: '装饰' },
  { id: 'h2-number', name: '序号样式', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; counter-increment: h2-counter; position: relative; padding-left: 40px;', category: '装饰' },
  { id: 'h2-ribbon', name: '丝带样式', style: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #fff; line-height: 1.4; background: #ff6b6b; padding: 8px 16px 8px 20px; position: relative; margin-left: -10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.2);', category: '装饰' },
]

// 三级标题样式库 - 按风格分类
export const h3Styles: ElementStyle[] = [
  // 基础样式
  { id: 'h3-simple', name: '简约', style: 'font-size: 18px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;', category: '基础' },
  { id: 'h3-bold', name: '加粗强调', style: 'font-size: 22px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;', category: '基础' },

  // 橙心系列
  { id: 'h3-orange-leftbar', name: '橙色左边框', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #ff8787; padding-left: 10px;', category: '橙心' },
  { id: 'h3-orange-dot', name: '橙色圆点', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; padding-left: 20px; position: relative;', category: '橙心' },
  { id: 'h3-orange-bg', name: '橙色背景', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #ff6b6b; line-height: 1.4; background: #fff5f5; padding: 6px 10px; display: inline-block; border-radius: 3px;', category: '橙心' },

  // 绿意系列
  { id: 'h3-green-leftbar', name: '绿色左边框', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #07c160; padding-left: 10px;', category: '绿意' },
  { id: 'h3-green-bg', name: '绿色背景', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #07c160; line-height: 1.4; background: #f0fff4; padding: 6px 10px; display: inline-block; border-radius: 3px;', category: '绿意' },

  // 蓝莹系列
  { id: 'h3-leftbar', name: '蓝色左边框', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #3498db; padding-left: 10px;', category: '蓝莹' },
  { id: 'h3-blue-bg', name: '蓝色背景', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #0084ff; line-height: 1.4; background: #e8f4fd; padding: 6px 10px; display: inline-block; border-radius: 3px;', category: '蓝莹' },

  // 姹紫系列
  { id: 'h3-purple-leftbar', name: '紫色左边框', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #9b59b6; padding-left: 10px;', category: '姹紫' },
  { id: 'h3-purple-bg', name: '紫色背景', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #6f42c1; line-height: 1.4; background: #f5f0ff; padding: 6px 10px; display: inline-block; border-radius: 3px;', category: '姹紫' },

  // 红绯系列
  { id: 'h3-red-leftbar', name: '红色左边框', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #e74c3c; padding-left: 10px;', category: '红绯' },
  { id: 'h3-red-bg', name: '红色背景', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #e74c3c; line-height: 1.4; background: #fef5f5; padding: 6px 10px; display: inline-block; border-radius: 3px;', category: '红绯' },

  // 其他装饰
  { id: 'h3-dot', name: '圆点装饰', style: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; padding-left: 20px; position: relative;', category: '装饰' },
  { id: 'h3-bg', name: '背景色', style: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #2c3e50; line-height: 1.4; background: #ecf0f1; padding: 6px 10px; display: inline-block; border-radius: 3px;', category: '装饰' },
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
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
]

export const fontSizes = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24]

// 预设完整样式主题模板
export interface PresetTheme {
  id: string
  name: string
  description: string
  styles: {
    h1: string
    h2: string
    h3: string
    code: string
    pre: string
    blockquote: string
  }
}

export const presetThemes: PresetTheme[] = [
  {
    id: 'orange-heart',
    name: '橙心',
    description: '温暖橙色主题，适合技术文章',
    styles: {
      h1: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #ff6b6b; padding-left: 16px; background: #fff5f5; padding: 12px 16px;',
      h2: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #ff8787; padding-left: 12px;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; padding-left: 20px; position: relative;',
      code: 'background: #fff5f5; padding: 2px 8px; border-radius: 3px; font-family: "Fira Code", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #e74c3c; border: 1px solid #ffe0e0;',
      pre: 'background: #fff5f5; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border-left: 3px solid #ff6b6b;',
      blockquote: 'border-left: 4px solid #ff6b6b; padding: 12px 16px; color: #666; margin: 16px 0; background: #fff5f5; border-radius: 4px;'
    }
  },
  {
    id: 'green-meaning',
    name: '绿意',
    description: '清新绿色主题，适合生活类文章',
    styles: {
      h1: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; border-left: 6px solid #07c160; padding-left: 16px;',
      h2: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #07c160; padding-left: 12px;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #3498db; padding-left: 10px;',
      code: 'background: #f0fff4; padding: 2px 8px; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 14px; color: #22863a; border: 1px solid #c3f1d4;',
      pre: 'background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; margin-bottom: 14px; border-left: 3px solid #07c160;',
      blockquote: 'border-left: 4px solid #07c160; padding: 10px 14px; color: #666; margin: 14px 0; background: #f7f7f7; border-radius: 4px;'
    }
  },
  {
    id: 'blue-shine',
    name: '蓝莹',
    description: '专业蓝色主题，适合商务文章',
    styles: {
      h1: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 2px solid #0084ff; padding-bottom: 8px;',
      h2: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #0084ff; padding-left: 12px;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #3498db; padding-left: 10px;',
      code: 'background: #e8f4fd; padding: 3px 8px; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; font-size: 14px; color: #0366d6;',
      pre: 'background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #e1e4e8;',
      blockquote: 'border-left: 4px solid #0084ff; padding: 12px 16px; color: #646464; margin: 16px 0; background: #f9f9f9; font-style: italic;'
    }
  },
  {
    id: 'purple-charm',
    name: '姹紫',
    description: '优雅紫色主题，适合设计类文章',
    styles: {
      h1: 'font-size: 28px; font-weight: 700; margin-top: 0; margin-bottom: 4px; color: #1e1e1e; line-height: 1.3; border-bottom: 3px solid; border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1;',
      h2: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; border-left: 4px solid #9b59b6; padding-left: 12px;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #3498db; padding-left: 10px;',
      code: 'background: #f5f0ff; padding: 2px 8px; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 14px; color: #6f42c1; border: 1px solid #e0d4ff;',
      pre: 'background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #667eea30;',
      blockquote: 'border-left: 4px solid #9b59b6; padding: 12px 16px; color: #555; margin: 16px 0; background: #f8f5ff;'
    }
  },
  {
    id: 'github-style',
    name: 'GitHub',
    description: 'GitHub风格，简约专业',
    styles: {
      h1: 'font-size: 32px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25; border-bottom: 1px solid #d0d7de; padding-bottom: 8px;',
      h2: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 1px solid #e4e6eb; padding-bottom: 8px;',
      h3: 'font-size: 22px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;',
      code: 'background: #f6f6f6; padding: 2px 8px; border-radius: 3px; font-family: "SF Mono", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #0084ff;',
      pre: 'background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #e1e4e8;',
      blockquote: 'border-left: 4px solid #d0d7de; padding: 0 16px; color: #57606a; margin: 16px 0;'
    }
  },
  {
    id: 'juejin-style',
    name: '掘金',
    description: '掘金风格，现代简洁',
    styles: {
      h1: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 24px; border-radius: 8px; text-align: center; color: #fff;',
      h2: 'margin: 10px 0 15px 0; padding: 0 0 0 10px; border-left: 5px solid #1e80ff; font-size: 17px; font-weight: bold; color: #222222; line-height: 1.8em; letter-spacing: 0em;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; border-left: 3px solid #3498db; padding-left: 10px;',
      code: 'background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: Consolas, Monaco, Menlo, monospace; font-size: 14px; color: #d73a49;',
      pre: 'background: #282c34; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); color: #abb2bf;',
      blockquote: 'border-left: 4px solid #1e80ff; padding: 12px 16px; color: #666; margin: 16px 0; background: #f7f7f7; border-radius: 4px;'
    }
  },
  {
    id: 'zhihu-style',
    name: '知乎',
    description: '知乎风格，优雅大方',
    styles: {
      h1: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.4; text-align: center;',
      h2: 'font-size: 22px; font-weight: 700; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4; background: #f8f9fa; padding: 8px 12px; border-radius: 4px;',
      h3: 'font-size: 19px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #2c3e50; line-height: 1.4; background: #ecf0f1; padding: 6px 10px; display: inline-block; border-radius: 3px;',
      code: 'background: #f6f6f6; padding: 2px 8px; border-radius: 3px; font-family: "SF Mono", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #0084ff;',
      pre: 'background: #fff; padding: 20px; border-radius: 12px; overflow-x: auto; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;',
      blockquote: 'border-left: 4px solid #34495e; padding: 12px 16px; color: #2c3e50; margin: 16px 0; background: #ecf0f1; font-style: italic;'
    }
  },
  {
    id: 'red-scarlet',
    name: '红绯',
    description: '热情红色主题，适合节日文章',
    styles: {
      h1: 'border-bottom: 2px solid #ef7060; margin: 30px 0 15px 0; padding: 0; display: flex; align-items: unset; line-height: 1.1em; position: relative; font-size: 24px; font-weight: 700; color: #1a1a1a;',
      h2: 'margin: 10px 0 15px 0; padding: 0 0 0 10px; border-left: 5px solid #f83929; font-size: 17px; font-weight: bold; color: #222222; line-height: 1.8em; letter-spacing: 0em;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4; padding-left: 20px; position: relative;',
      code: 'background: #fff5f5; padding: 2px 8px; border-radius: 3px; font-family: "Fira Code", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #e74c3c; border: 1px solid #ffe0e0;',
      pre: 'background: #fff5f5; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border-left: 3px solid #ef7060;',
      blockquote: 'border-left: 4px solid #e74c3c; padding: 12px 16px 12px 40px; color: #555; margin: 16px 0; background: #fef5f5; position: relative; font-style: italic;'
    }
  }
]

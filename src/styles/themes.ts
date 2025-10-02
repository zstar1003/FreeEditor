export interface ThemeStyle {
  id: string
  name: string
  styles: {
    section: string
    h1: string
    h2: string
    h3: string
    h4: string
    p: string
    code: string
    pre: string
    preCode: string
    blockquote: string
    ul: string
    ol: string
    li: string
    a: string
    img: string
    table: string
    th: string
    td: string
    hr: string
  }
}

export const presetThemes: ThemeStyle[] = [
  {
    id: 'wechat',
    name: '微信公众号',
    styles: {
      section: 'font-size: 15px; color: #333; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;',
      h1: 'font-size: 24px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; text-align: center; line-height: 1.4;',
      h2: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;',
      h3: 'font-size: 18px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;',
      h4: 'font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 14px; color: #1a1a1a; line-height: 1.4;',
      p: 'margin-bottom: 14px; color: #333; font-size: 15px; text-align: justify; word-wrap: break-word;',
      code: 'background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: Consolas, Monaco, Menlo, monospace; font-size: 14px; color: #d73a49;',
      pre: 'background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; margin-bottom: 14px; border-left: 3px solid #07c160;',
      preCode: 'background: none; padding: 0; color: #333; font-size: 13px;',
      blockquote: 'border-left: 4px solid #07c160; padding: 10px 14px; color: #666; margin: 14px 0; background: #f7f7f7; border-radius: 4px;',
      ul: 'margin-bottom: 14px; padding-left: 20px; color: #333;',
      ol: 'margin-bottom: 14px; padding-left: 20px; color: #333;',
      li: 'margin-bottom: 6px;',
      a: 'color: #576b95; text-decoration: none;',
      img: 'max-width: 100%; height: auto; border-radius: 6px; margin: 14px 0; display: block;',
      table: 'border-collapse: collapse; width: 100%; margin-bottom: 14px; font-size: 14px;',
      th: 'border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; color: #333; background: #f5f5f5; font-weight: 600;',
      td: 'border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; color: #333;',
      hr: 'border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;'
    }
  },
  {
    id: 'zhihu',
    name: '知乎',
    styles: {
      section: 'font-size: 16px; color: #1a1a1a; line-height: 1.8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
      h1: 'font-size: 28px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3; border-bottom: 2px solid #0084ff; padding-bottom: 8px;',
      h2: 'font-size: 24px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1a1a1a; line-height: 1.3;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4;',
      h4: 'font-size: 18px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1a1a1a; line-height: 1.4;',
      p: 'margin-bottom: 16px; color: #1a1a1a; font-size: 16px; line-height: 1.8;',
      code: 'background: #f6f6f6; padding: 2px 8px; border-radius: 3px; font-family: "SF Mono", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #0084ff;',
      pre: 'background: #f6f6f6; padding: 16px; border-radius: 4px; overflow-x: auto; margin-bottom: 16px;',
      preCode: 'background: none; padding: 0; color: #1a1a1a; font-size: 14px;',
      blockquote: 'border-left: 4px solid #0084ff; padding: 12px 16px; color: #646464; margin: 16px 0; background: #f9f9f9; font-style: italic;',
      ul: 'margin-bottom: 16px; padding-left: 24px; color: #1a1a1a;',
      ol: 'margin-bottom: 16px; padding-left: 24px; color: #1a1a1a;',
      li: 'margin-bottom: 8px;',
      a: 'color: #0084ff; text-decoration: none; border-bottom: 1px solid #0084ff;',
      img: 'max-width: 100%; height: auto; margin: 16px auto; display: block;',
      table: 'border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 15px;',
      th: 'border: 1px solid #e0e0e0; padding: 8px 12px; text-align: left; color: #1a1a1a; background: #f6f6f6; font-weight: 600;',
      td: 'border: 1px solid #e0e0e0; padding: 8px 12px; text-align: left; color: #1a1a1a;',
      hr: 'border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;'
    }
  },
  {
    id: 'juejin',
    name: '掘金',
    styles: {
      section: 'font-size: 16px; color: #2e2e2e; line-height: 1.75; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;',
      h1: 'font-size: 32px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1e1e1e; line-height: 1.3;',
      h2: 'font-size: 26px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: #1e1e1e; line-height: 1.3; border-bottom: 1px solid #e4e6eb; padding-bottom: 8px;',
      h3: 'font-size: 22px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1e1e1e; line-height: 1.4;',
      h4: 'font-size: 18px; font-weight: 600; margin-top: 20px; margin-bottom: 12px; color: #1e1e1e; line-height: 1.4;',
      p: 'margin-bottom: 16px; color: #2e2e2e; font-size: 16px; line-height: 1.75;',
      code: 'background: #f1f1f1; padding: 2px 8px; border-radius: 3px; font-family: "Fira Code", Monaco, Menlo, Consolas, monospace; font-size: 14px; color: #e74c3c;',
      pre: 'background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #e1e4e8;',
      preCode: 'background: none; padding: 0; color: #24292e; font-size: 14px;',
      blockquote: 'border-left: 4px solid #1e80ff; padding: 12px 16px; color: #515767; margin: 16px 0; background: #f4f5f5;',
      ul: 'margin-bottom: 16px; padding-left: 24px; color: #2e2e2e;',
      ol: 'margin-bottom: 16px; padding-left: 24px; color: #2e2e2e;',
      li: 'margin-bottom: 8px;',
      a: 'color: #1e80ff; text-decoration: none;',
      img: 'max-width: 100%; height: auto; border-radius: 4px; margin: 16px 0; display: block;',
      table: 'border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 15px;',
      th: 'border: 1px solid #e4e6eb; padding: 8px 12px; text-align: left; color: #1e1e1e; background: #f1f3f5; font-weight: 600;',
      td: 'border: 1px solid #e4e6eb; padding: 8px 12px; text-align: left; color: #2e2e2e;',
      hr: 'border: none; border-top: 1px solid #e4e6eb; margin: 24px 0;'
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    styles: {
      section: 'font-size: 16px; color: #24292f; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;',
      h1: 'font-size: 32px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25; border-bottom: 1px solid #d0d7de; padding-bottom: 8px;',
      h2: 'font-size: 24px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25; border-bottom: 1px solid #d0d7de; padding-bottom: 8px;',
      h3: 'font-size: 20px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;',
      h4: 'font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #24292f; line-height: 1.25;',
      p: 'margin-bottom: 16px; color: #24292f; font-size: 16px; line-height: 1.6;',
      code: 'background: rgba(175, 184, 193, 0.2); padding: 3px 6px; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; font-size: 85%; color: #24292f;',
      pre: 'background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #d0d7de;',
      preCode: 'background: none; padding: 0; color: #24292f; font-size: 85%;',
      blockquote: 'border-left: 4px solid #d0d7de; padding: 0 16px; color: #57606a; margin: 16px 0;',
      ul: 'margin-bottom: 16px; padding-left: 32px; color: #24292f;',
      ol: 'margin-bottom: 16px; padding-left: 32px; color: #24292f;',
      li: 'margin-bottom: 4px;',
      a: 'color: #0969da; text-decoration: none;',
      img: 'max-width: 100%; height: auto; margin: 16px 0; display: block;',
      table: 'border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 16px;',
      th: 'border: 1px solid #d0d7de; padding: 6px 13px; text-align: left; color: #24292f; background: #f6f8fa; font-weight: 600;',
      td: 'border: 1px solid #d0d7de; padding: 6px 13px; text-align: left; color: #24292f;',
      hr: 'border: none; border-top: 2px solid #d0d7de; margin: 24px 0;'
    }
  }
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

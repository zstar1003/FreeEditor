// 基于 textarea-caret-position 库的实现
// https://github.com/component/textarea-caret-position

interface CaretCoordinates {
  top: number
  left: number
  height: number
}

// 需要复制到镜像 div 的 CSS 属性
const properties = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'MozTabSize'
]

const isBrowser = typeof window !== 'undefined'
const isFirefox = isBrowser && (window as any).mozInnerScreenX != null

export function getCaretCoordinates(
  element: HTMLTextAreaElement | HTMLInputElement,
  position: number
): CaretCoordinates {
  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser')
  }

  // 创建镜像 div
  const div = document.createElement('div')
  div.id = 'input-textarea-caret-position-mirror-div'
  document.body.appendChild(div)

  const style = div.style
  const computed = window.getComputedStyle(element)
  const isInput = element.nodeName === 'INPUT'

  // 默认的文本样式
  style.whiteSpace = 'pre-wrap'
  if (!isInput) {
    style.wordWrap = 'break-word'
  }

  // 将镜像 div 定位到屏幕外
  style.position = 'absolute'
  style.visibility = 'hidden'

  // 将所有 CSS 属性从元素转移到镜像 div
  properties.forEach((prop) => {
    if (isInput && prop === 'lineHeight') {
      // 对于 input 元素，如果没有设置 lineHeight，使用正常值
      if (computed.boxSizing === 'border-box') {
        const height = parseInt(computed.height)
        const outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth)
        const targetHeight = outerHeight + parseInt(computed.lineHeight)
        if (height > targetHeight) {
          style.lineHeight = height - outerHeight + 'px'
        } else if (height === targetHeight) {
          style.lineHeight = computed.lineHeight
        } else {
          style.lineHeight = '0'
        }
      } else {
        style.lineHeight = computed.height
      }
    } else {
      // @ts-ignore
      style[prop] = computed[prop]
    }
  })

  if (isFirefox) {
    // Firefox 在有滚动条时会在右侧留空
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll'
  } else {
    style.overflow = 'hidden'
  }

  div.textContent = element.value.substring(0, position)

  // 对于 input 元素，用单个空格替换换行符
  if (isInput) {
    div.textContent = div.textContent!.replace(/\s/g, '\u00a0')
  }

  const span = document.createElement('span')
  span.textContent = element.value.substring(position) || '.'
  div.appendChild(span)

  const coordinates: CaretCoordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth),
    height: parseInt(computed.lineHeight)
  }

  document.body.removeChild(div)

  return coordinates
}

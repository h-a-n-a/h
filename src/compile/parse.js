import { isDef, isUndef } from '../common/util'
import { isUnaryTag } from './util'

const tname = /[a-zA-Z_]+/
const tvalue = /[^\s"'<>=]+/
const startTagRE = new RegExp(`^<(${tname.source})\\s*`)
const startTagCloseRE = /^\s*(\/?)>/
const endTagRE = new RegExp(`^\\s*</(${tname.source})>`)
const attrRE = new RegExp(`^\\s*(${tvalue.source})="([^"]*)"`)
const forRE = new RegExp(
  `(${tvalue.source})\\s+(?:in|of)\\s+(${tvalue.source})`
)
const mustacheRE = /\{\{\s*(\w+)\s*\}\}/g

/**
 * Convert raw HTML to AST.
 */
export function parse (html) {
  const stack = []
  let root, currentParent

  while (html) {
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      if (html.match(endTagRE)) {
        handleEndTag()
        continue
      }

      if (html.match(startTagRE)) {
        handleStartTag()
        continue
      }
    }

    if (textEnd > 0) {
      const text = html.substring(0, textEnd)
      handleText(text)
      continue
    }
  }

  return root

  function handleText (text) {
    let element, textExpression
    advance(text.length)
    if ((textExpression = parseText(text))) {
      element = {
        type: 2,
        textExpression,
        text
      }
    } else {
      element = {
        type: 3,
        text
      }
    }

    currentParent.children.push(element)
  }

  function parseText (text) {
    if (!text.match(mustacheRE)) return

    let match, index
    index = mustacheRE.lastIndex = 0
    const tokens = []
    while ((match = mustacheRE.exec(text))) {
      const pos = match.index
      const exp = match[1]
      const str = text.substring(index, pos)

      if (str) {
        tokens.push(str)
      }

      // we assert exp is defined
      tokens.push(`_s(${exp})`)
      index = pos + match[0].length
    }

    if (index < text.length) {
      tokens.push(text.substring(index))
    }

    return tokens.join('+')
  }

  function handleStartTag () {
    const start = parseStartTag()
    const element = {
      type: 1,
      tag: start.tag,
      attrsMap: start.attrsMap,
      parent: currentParent,
      children: []
    }

    processHAttrs(element) // h-if, h-for

    if (isUndef(root)) root = element
    if (isDef(currentParent)) {
      currentParent.children.push(element)
    }

    // unary elements are not allowed to be parents
    if (!start.isUnary) {
      stack.push(element)
      currentParent = element
    }
  }

  function handleEndTag () {
    const matched = html.match(endTagRE)
    const endTagName = matched[1]
    advance(matched[0].length)

    let i
    for (i = stack.length - 1; i >= 0; i--) {
      if (stack[i].tag === endTagName) {
        break
      }
    }

    if (i >= 0) {
      stack.length = i
      if (i > 0) {
        currentParent = stack[stack.length - 1]
      } else {
        currentParent = null
      }
    }
  }

  function processHAttrs (elm) {
    processFor(elm)
    processIf(elm)
  }

  function processFor (elm) {
    const map = elm.attrsMap
    for (const el in map) {
      if (el === 'h-for') {
        const matched = map[el].match(forRE)
        elm.alias = matched[1]
        elm.for = matched[2]
      }
    }
  }

  function processIf (elm) {
    const map = elm.attrsMap
    for (const el in map) {
      if (el === 'h-if') {
        elm.ifExpression = map[el]
      }
    }
  }

  function parseStartTag () {
    const matched = html.match(startTagRE)
    advance(matched[0].length)

    const start = {
      tag: matched[1],
      attrsMap: {}
    }

    let end, attr
    while (
      !(end = html.match(startTagCloseRE)) &&
      (attr = html.match(attrRE))
    ) {
      advance(attr[0].length)
      const name = attr[1]
      const value = attr[2]
      start.attrsMap[name] = value
    }

    if (end) {
      start.isUnary = end[1] === '/' || isUnaryTag(start.tag)
      advance(end[0].length)

      return start
    }
  }

  function advance (n) {
    html = html.substring(n)
  }
}

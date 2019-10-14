import { isDef, isUndef, isTrue } from '../common/util'

const name = /[a-zA-Z_]+/
const value = /[^\s"'<>=]+/
const startTagRE = new RegExp(`^<(${name.source})\\s+`)
const startTagCloseRE = /^\s*(\/?)>/
const endTagRE = /([a-zA-Z_]+)>/
const attrRE = new RegExp(`^\\s*(${value.source})="([^"]*)"`)
const forRE = new RegExp(`(${value.source})\\s+(?:in|of)\\s+(${value.source})`)

/**
 * Convert raw html to AST
 */
export function parse (html) {
  const stack = []
  let root, currentParent

  while (html) {
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      if (html.match(endTagRE)) {
        // ...
        continue
      }

      if (html.match(startTagRE)) {
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
        if (isFalse(start.isUnary)) {
          stack.push(element)
          currentParent = element
        }

        continue
      }
    }

    if (textEnd > 0) {
      // processing text parse
    }
  }

  return root

  function processHTags (elm) {
    processFor(elm)
    processIf(elm)
  }

  function processFor (elm) {
    const map = elm.attrsMap
    for (const el in map) {
      if (el === 'h-for') {
        const matched = map[el].match(forRE)
        el.alias = matched[1]
        el.for = matched[2]
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

  function advance (n) {
    html = html.substring(n)
  }

  function parseStartTag () {
    let tag = html.match(startTagRE)
    const start = {
      tag: tag[1],
      attrsMap: {}
    }
    advance(tag[0].length)

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
      start.isUnary = isTrue(end[1])
      advance(end[0].length)
      return start
    }
  }
}

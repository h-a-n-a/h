import { isDef, isUndef, isTrue } from '../common/util'

const name = /[a-zA-Z_]+/
const startTagRE = new RegExp(`^<(${name.source})\\s+`)
const startTagCloseRE = /^\s*(\/?)>/
const endTagRE = /([a-zA-Z_]+)>/
const attrRE = /([^\s"'<>=]+)="([^"]*)"+/

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
          tag: start.tag,
          attrsMap: start.attrsMap,
          unary: start.unary,
          parent: currentParent,
          children: []
        }

        if (isUndef(root)) root = element
        if (isDef(currentParent)) {
          currentParent.children.push(element)
        }

        // unary elements are not allowed to be a parent
        if (isUndef(element.unary)) {
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
      start.unary = isTrue(end[1])
      advance(end[0].length)
      return start
    }
  }
}

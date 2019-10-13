import { isDef, isUndef, isTrue } from '../src/common/util'
const tname = /[a-zA-Z_]+/
const startTagRE = new RegExp(`^<(${tname.source})\\s+`)
const startTagCloseRE = /^\s*(\/?)>/
const endTagRE = /([a-zA-Z_]+)>/
const attrRE = /([^\s"'<>=]+)="([^"]*)"+/

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
  while (!(end = html.match(startTagCloseRE)) && (attr = html.match(attrRE))) {
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

let html = '<div style="width: 123px; height: 123px;">'

let res = parseStartTag()
console.log(res)

import { dom } from '../common/dom'
export function createElm (vnode) {
  const tag = vnode.tag
  const text = vnode.text

  let elm
  if (tag) {
    elm = dom.createElement(tag)
  }

  if (text) {
    elm = dom.createTextNode(text)
  }

  return elm
}

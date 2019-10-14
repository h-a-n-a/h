import { isObject } from './util'

export const dom = Object.create(null)

dom.createTextNode = function (text) {
  return document.createTextNode(text)
}

dom.createElement = function (tag) {
  return document.createElement(tag)
}

dom.insertBefore = function (elm, parentElm, refElm) {
  parentElm.insertBefore(elm, refElm)
}

dom.appendChild = function (elm, parentElm) {
  parentElm.appendChild(elm)
}

dom.insert = function (elm, parentElm, refElm) {
  if (parentElm) {
    if (refElm) {
      dom.insertBefore(elm, parentElm, refElm)
    } else {
      dom.appendChild(elm, parentElm)
    }
  }
}

dom.setAttribute = function (elm, name, value) {
  elm.setAttribute(name, value)
}

dom.removeAttribute = function (elm, name, value) {
  elm.removeAttribute(name, value)
}

dom.setId = function (elm, id) {
  elm.id = id
}

dom.setClasses = function (elm, classes) {
  elm.className = classes.join(' ')
}

dom.setAttrs = function (elm, attrs) {
  if (isObject(attrs)) {
    for (const [ name, val ] of Object.entries(attrs)) {
      dom.setAttribute(elm, name, val)
    }
  }
}

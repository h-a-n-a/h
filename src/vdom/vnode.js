export class VNode {
  constructor (tag, children, text) {
    this.tag = tag
    this.children = children
    this.text = text

    this.elm = elm
    this.attrs = {}
    this.classes = []
    this.id = null
    this.styles = {}
  }
}

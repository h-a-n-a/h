export function isUnaryTag (tag) {
  const unaryTags = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'frame',
    'hr',
    'img',
    'input',
    'isindex',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ]
  return unaryTags.indexOf(tag) !== -1
}

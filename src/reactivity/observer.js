import { defineReactive } from './util'
import { isObject } from '../common/util'

export function observer (data) {
  for (const el in data) {
    // deep reactivity
    if (isObject(data[el])) {
      observer(data[el])
    } else {
      defineReactive(data, el, data[el])
    }
  }
}

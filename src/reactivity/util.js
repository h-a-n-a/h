import { Dep } from './dep'

export function defineReactive (obj, key, val) {
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get () {
      // console.log(`[getter] get [${key}]: ${val}`)
      dep.addSub(Dep.target)
      return val
    },
    set (newVal) {
      if (newVal !== val) {
        // console.log(`[setter] set [${key}]: ${newVal}`)
        val = newVal
        dep.notify()
      }
    }
  })
}

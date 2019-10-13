import { Dep } from './dep'

export class Watcher {
  constructor (updateFn) {
    Dep.target = this
    this._update = updateFn
  }

  update () {
    // do some render
    this._update()
  }
}

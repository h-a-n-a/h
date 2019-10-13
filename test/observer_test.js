import { observer } from '../src/reactivity/observer'
import { Watcher } from '../src/reactivity/watcher'

const obj = { name: 'whh', age: 18, info: { tel: 10086 } }

new Watcher(function () {
  console.log('render me')
})

observer(obj)

// dep collection
console.log(obj.name)
console.log(obj.age)

// notification
obj.name = 'lsd'
obj.age = 19

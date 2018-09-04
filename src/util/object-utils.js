/**
 * 低副作用的混入
 * 该函数会将第二个参数混入第一个参数，且JSON.stringify 时不会序列化第二个参数
 *
 * 例子：
 * o1 = {a: 'ok'}
 * o2 = {b: 'm'}
 * lowSideEffectMerge(o1, o2)
 *
 * o1.b === 'm'                        // it's true
 * JSON.stringify(o1) === '{"a":"ok"}' // it's true
 *
 */
export function lowSideEffectMerge (willMerge, mergingData) {
  if (Object.getPrototypeOf(Object.getPrototypeOf(willMerge)) === null) { // 未修改 __proto__
    Object.setPrototypeOf(willMerge, {})
  }
  Object.assign(Object.getPrototypeOf(willMerge), mergingData)
}

export function isObject (val) {
  return val.toString() === '[object Object]'
}

export function isArray (val) {
  return val instanceof Array
}

export function arrayRemove (arr, it, comparator = (a, b) => a === b) {
  const index = arr.findIndex(a => comparator(a, it))
  arr.splice(index, 1)
  return arr
}

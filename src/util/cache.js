/**
 * cache
 * change logs:
 * 2017/11/24 herbluo created
 */
import LRU from 'lru-cache'

const options = {
  max: 500,
  length (n) {
    if (n instanceof Array) {
      return n.length
    }
    return 1
  },
  maxAge: 1000 * 60 * 60,
  stale: true // 超时首读可读
}

const lruCache = new LRU(options)
/**
 * @typedef {object} ACacheConfig
 * @property {number|undefined} second     - 可选，缓存的时间，默认为无穷大
 * @property {string|undefined} key        - 可选，缓存的键名，默认从方法名中提取
 * @property {function|undefined} logger   - 可选，输出日志的方法。例： `console.log`
 * @property {string|undefined} getId      - 可选，匹配参数中代表id的。例： `', [id], '`
 */
/**
 * @typedef {object} PatchConfig
 * @property {function} getId     - 可选，缓存的
 * @property {function} getValue
 */

class Cache {
  /**
   * @param config {ACacheConfig}
   */
  constructor (config) {
    this.config = config
    this.data = {}
  }
  get (key) {

  }
  post (key, value) {

  }
  put (key, value) {} // 完整
  patch (key, value) {} // 不完整
  delete (key) {}
}


function patch () {

}

function parseName(methodName) {
  const try2get = (index, arr) => arr && arr[index]

  const method_name = methodName.replace(/([A-Z])/g,"_$1").toLowerCase()
  const res = method_name.match(/(.+?)_(.+?)(_and|_cache|$)?/)
  if (!res) {
    return
  }
  const [, method, entityName] = res

  const cacheTime = method_name.match(/_cache(\d+)s/)?.[0]

  return {
    method,
    cacheTime,
    entityName
  }
}

/**
 * @param config {ACacheConfig}
 */
export function aCache (config = {}) {
  // const maxAge = second ? (second * 1000) : undefined

  return (target, property, descriptor) => {
    const parsedName = parseName(property)

    const oldFunc = descriptor.value
    const entityName = config.key || parsedName.entityName

    if (!entityName) {
      throw new Error('方法名不符合规范')
    }

    // 针对 get
    descriptor.value = function (...args) {
      const key =
        `${target.constructor.name}:${entityName}:${JSON.stringify(args)}`

      console.log(target)
      console.log(key)

      const cachedVal = lruCache.get(key)
      if (cachedVal) {
        return cachedVal
      }

      const result = oldFunc(...args)
      lruCache.set(key, result, maxAge)
      return result
    }
  }
}

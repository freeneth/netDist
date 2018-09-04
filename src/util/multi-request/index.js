/**
 * 分割请求（合并请求）
 *
 * 分割后，对业务逻辑来说，可多次调用该方法，（但是参数不同），但 Http请求只发一次
 * 多次调用该方法 N个事件循环内多次调用该方法，N默认为 0 +1=1
 *
 * 该实现还未完善，缺少
 * 1. 还未过滤重复 id
 * 2. 分割后暂时还不支持数组形式调用
 */
import {generateRequestArg} from "./args-handler"

window.generateRequestArg = generateRequestArg

function multiRequest(config) {
  let zippedArg = []
  let resolveRejects = []
  let pushing = false

  const {
    logger,
    parseResponse,
    loopTimes,
    argStructure
  } = config

  const waitLooping = (loopTimes) => {
    if (loopTimes <= 50) {
      let time = loopTimes
      return new Promise(resolve => {
        const delay = () => {
          if (time === 0) {
            resolve()
            return
          }
          time--
          setTimeout(delay, 0)
        }
        delay()
      })
    }
    return new Promise(resolve => setTimeout(resolve, loopTimes))
  }

  const sendRequest = (zippedArg, resolveRejects, request) => {
    const requestArg = generateRequestArg(argStructure)(zippedArg).alsoPrint()
    requestArg.forEach(args => {
      request(...args)
        .then(parseResponse)
        .then(resS => resS.map((res, i) => resolveRejects[i].resolve(res)))
        .catch(err => resolveRejects.forEach(({reject}) => reject(err)))
        .then(() => logger('该次请求处理完毕, 共处理了%o组数据', zippedArg.length))
    })
  }

  return function onRequest (request, methodName) {
    return function (...args) {
      logger(methodName, '接收了一个请求')
      if (!pushing) {
        logger(methodName, '请求收集中')
        pushing = true
        waitLooping().then(() => {
          logger(methodName, '请求收集完毕')
          pushing = false
          sendRequest(zippedArg, resolveRejects, request)
          zippedArg = []
          resolveRejects = []
        })
      }
      zippedArg.push(args)
      return new Promise(
        (resolve, reject) => resolveRejects.push({resolve, reject})
      )
    }
  }
}

/**
 * 分割请求
 * 真实请求 -> 逻辑请求
 *
 * [] | a 数组，由逻辑请求的参数合并而来，如 id
 * *  | c 配置，每次发送都一致（一次loopTimes期间），如 access_token
 * {} | g 分组，按照该参数分组后，发送请求，（这就导致可能发送多个请求）
 *
 * @typedef {object} SplitRequestConfig
 * @property {function|undefined} parseResponse  - 可选，解析返回结果，如返回结果为数组，且顺序与参数的顺序一致，可直接返回，或不写该值
 * @property {number|undefined} loopTimes        - 可选，等待的事件循环轮数。默认为 0，即本轮循环的末尾，采用Promise.resolve实现
 *                                               - 当值大于 50时，该值代表的意义为等待的毫秒数，采用setTimeout实现
 * @property {function|undefined} logger         - 可选，输出日志的方法。例： `console.log`
 * @property {string|undefined} argStructure     - 可选，例： `'[], [], c, g'`，表示该方法有四个参数，前两个类似与id信息，第三个参数类似access_token，第四个参数诡异多变
 *                                               - 当原请求和分割后的请求参数一一对应时，可不写该值（即，全为[], '[], [], [], ....'）
 * @property {boolean} cache                     - 可选，是否启用缓存，默认 false
 */

/**
 * @param config {SplitRequestConfig}
 */
export function splitRequest(config = {}) {
  const defaultConfig = {
    parseResponse: t => t,
    logger: () => {},
    loopTimes: 0
  }
  const onRequest = multiRequest(Object.assign(defaultConfig, config))
  return (target, property, descriptor) => {
    descriptor.value = onRequest(descriptor.value, property)
  }
}


/**
 * @typedef {object} ConvergeRequestConfig
 * @property {function|undefined} sendRequest    - 可选，发送请求，参数为 数组，Array<Args>, Args为原函数的参数数组，当参数只有一位时，该数组已flatten
 * @property {function|undefined} parseResponse  - 可选，解析返回结果，如返回结果为数组，且顺序与参数的顺序一致，可直接返回，或不写该值
 * @property {number|undefined} loopTimes        - 可选，等待的事件循环轮数。默认为 0，即本轮循环的末尾，采用Promise.resolve实现
 *                                               - 当值大于 50时，该值代表的意义为等待的毫秒数，采用setTimeout实现
 * @property {function|undefined} logger         - 可选，输出日志的方法。例： `console.log`
 */
/**
 * @param config {ConvergeRequestConfig}
 * @deprecated 请使用 splitRequest替代
 */
export function convergeRequest(config) {
  const defaultConfig = {
    logger: () => {},
    loopTimes: 0
  }
  const onRequest = multiRequest(Object.assign(defaultConfig, config))
  return (target, property, descriptor) => {
    descriptor.value = onRequest(config.sendRequest, property)
  }
}

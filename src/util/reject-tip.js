/**
 * version 0.0.1
 */
import utils from "./angular-bridge"

export function rejectAndTip(message) {
  return Promise.reject({
    tip: message
  })
}

export function errorAndTip(message, _stack) {
  const error = new Error(_stack || message)
  error.tip = message
  return error
}

export function shouldTip(e, notThrow) {
  if (e.tip) {
    utils.error(e.tip)
    console.error(e)
    return
  }
  if (!notThrow) {
    throw e
  }
}

export function loge(e) {
  try {
    shouldTip(e)
  } catch (e) {
    console.error(e)
  }
}

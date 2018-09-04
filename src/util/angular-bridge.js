const utils = {
  toast (type, msg, time, callback) {
    const map = {
      s: {
        text: 'success',
        color: '#91cbff'
      },
      w: {
        text: 'warning',
        color: 'orange'
      },
      e: {
        text: 'error',
        color: 'red'
      }
    }
    const mt = map[type]
    console.log(`${msg} %c${mt.text}`, `color:${mt.color}`)
  },
  success (msg) {
    this.toast('s', msg)
  },
  warning (msg) {
    this.toast('w', msg)
  },
  error (msg) {
    this.toast('e', msg, 2000)
  },
  isFullScreen: undefined,
  onFullScreenChange () {}
}
export default utils

export function initUtils (_utils) {
  Object.assign(utils, _utils)
}

export function setOnFullScreenChange (onFullScreenChange) {
  utils.onFullScreenChange = onFullScreenChange
}

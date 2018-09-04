export const flexMixin = (styles) => {
  Object.values(styles).forEach(style => {
    if (typeof style !== 'object') {
      return
    }

    if (!style.display) {
      style.display = 'flex'
    }

    flexMixin(style)
  })
  return styles
}

export const keyUpHelper = {
  onEnter (handler) {
    return (e) => {
      if (e.keyCode === 13) {
        handler()
      }
    }
  }
}

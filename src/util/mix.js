export function mix(...mixins) {
  class Mix extends mixins[0] {
    constructor (...args) {
      super(...args)
    }
  }

  mixins.shift()
  for (let mixin of mixins) {
    copyProperties(Mix, mixin) // 拷贝实例属性
    copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
  }

  return Mix
}

export function vMix (c) {
  class Mix extends c {
    constructor (...args) {
      super(...args)
    }
  }
  return Mix
}

export function applyMix (derivedConstructor, mixins) {
  for (let mixin of mixins) {
    copyProperties(derivedConstructor, mixin) // 拷贝实例属性
    copyProperties(derivedConstructor.prototype, mixin.prototype) // 拷贝原型属性
  }
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key)
      Object.defineProperty(target, key, desc)
    }
  }
}

// export function applyMixins(derivedCtor, baseCtors) {
//   baseCtors.forEach(baseCtor => {
//     copyProperties(derivedCtor, baseCtor)
//     copyProperties(derivedCtor.prototype, baseCtor.prototype)
//   })
// }

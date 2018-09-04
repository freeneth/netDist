import {Sha256} from './sha256'
//
// new Sha256(true)
//   .update('test')
//   .then(that => that.update('test2'))
//   .then(that => that.hex())
//   .then(console.log)

function toBase64 (hex) {
  return btoa(hex.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(''))
}

const delay = time => new Promise(resolve => setTimeout(resolve, time))

export const hash = async (typedArrayOrBlob, onCancel, getWillResolvePromise) => {
  let cancel = false
  let callWhenCanceled
  onCancel(() => {
    cancel = true
    return new Promise(resolve => {callWhenCanceled = resolve})
  })
  
  const sha256 = new Sha256(false)

  if (typedArrayOrBlob instanceof ArrayBuffer) {
    return sha256
      .update(typedArrayOrBlob)
      .then(sha => sha.hex().alsoPrint())
  }

  if (typedArrayOrBlob instanceof Blob) {
    const reader = new FileReader()
    const step = 1024 * 1024 * 100 // 100M
    let sha256Promise = Promise.resolve()
    let readBlobPromise = Promise.resolve()

    const readBlob = (blob) => new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.readAsArrayBuffer(blob)
    })

    const calcFragmentSha256 = (from, to) => {
      readBlobPromise = readBlobPromise
        .then(() =>
          readBlob(typedArrayOrBlob.slice(from, to))
            .then(arrayBuffer => {
              if (cancel) {
                callWhenCanceled()
                return Promise.reject('canceled')
              }
              sha256Promise = sha256Promise
                .then(getWillResolvePromise)
                .then(() => sha256.update(arrayBuffer))
              return sha256Promise
            })
      )
      if (to < typedArrayOrBlob.size) {
        calcFragmentSha256(to, to + step)
      }
    }

    calcFragmentSha256(0, step)

    return readBlobPromise
      .then(() => sha256Promise.then(that => that.hex().alsoPrint()))
      .then((data) => {
        if (cancel) {
          callWhenCanceled()
          return Promise.reject('canceled')
        }
        return data
      })
      .then(getWillResolvePromise)
      // .then(() => {
      //   setTimeout(async () => {
      //     console.time('本次RIPEMD160时间')
      //     const hexName = await readBlob(typedArrayOrBlob)
      //       .then(arrayBuffer => new RIPEMD160()
      //         .update(toBuffer(arrayBuffer).alsoPrint())
      //         .digest('base64')
      //       )
      //     console.log(hexName)
      //     console.timeEnd('本次RIPEMD160时间')
      //   })
      // })

  }

  throw new Error('不支持的类型')
}

// function toBuffer(ab) {
//   var buf = new Buffer(ab.byteLength);
//   var view = new Uint8Array(ab);
//   for (var i = 0; i < buf.length; ++i) {
//     buf[i] = view[i];
//   }
//   return buf;
// }

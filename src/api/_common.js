import {errorAndTip} from "../util/reject-tip"
import {gApi} from "./gApi"
import {isArray} from "../util/object-utils"

export default class _CommonApi {
  async uploadFile (typedArray, percentCallback) {
    if (!await _CommonApi.isSpaceEnough(typedArray.byteLength)) {
      throw errorAndTip('盒子剩余空间不足')
    }
    const tempFileId = await gApi.openTempFile(this.sid)
    await this._uploadTempFile(tempFileId, typedArray, percentCallback)
    return await gApi.temp2LFile(this.sid, tempFileId)
  }

  static async isSpaceEnough (fileSize) {
    const _1GB = 1024 * 1024 * 1024
    const {free} = await gApi.getVar(null, 'disk')
    const freeGB = (free - fileSize) / _1GB
    return freeGB.alsoPrint('剩余空间为 %oGB') > 2
  }

  async _uploadTempFile (tempFileId, typedArray, percentCallback, startIndex = 0) {
    const fileSize = typedArray.byteLength // B
    const _100KB = 100 * 1024
    const _1MB = 1024 * 1024
    const step = ((fileSize) => {
      const t = fileSize / _1MB // 几 M
      if (t < 1) { // 1M 以内
        return _100KB
      } else if (t < 100) { // 100M 以内
        return _100KB * t
      } else {
        return _1MB * 10
      }
    })(fileSize)

    for (let i = 0; i < fileSize; i = i + step) {
      const dataNeedSend = typedArray.slice(i, i + step)
      await gApi.setLFileData(this.sid, tempFileId, i + startIndex, dataNeedSend)
      if (percentCallback) {
        const percent = (i + step) / fileSize * 100
        percentCallback(percent > 100 ? 100 : percent)
      }
    }

    return tempFileId
  }

  async uploadFileV2 (file, percentCallback, onCancel, getWillResolvePromise) {
    // onCancel and getWillResolvePromise
    let cancel = false
    let callWhenCanceled
    onCancel(() => {
      cancel = true
      return new Promise(resolve => {callWhenCanceled = resolve})
    })
    const ifCancelReject = (data) => {
      if (cancel) {
        callWhenCanceled(tempFileId)
        return Promise.reject('canceled')
      }
      return data
    }
    
    const fileSize = file.size
    if (!await _CommonApi.isSpaceEnough(fileSize)) {
      throw errorAndTip('盒子剩余空间不足')
    }
    const tempFileId = await gApi.openTempFile(this.sid)

    const reader = new FileReader()
    const step = 1024 * 1024 * 20 // 20M
    let readBlobPromise = Promise.resolve()
    let uploadPromise = Promise.resolve()

    const readBlob = (blob) => new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.readAsArrayBuffer(blob)
    })

    const uploadFile = (from, to) => {
      const getPercent = (p) => {
        const fp = from / fileSize
        const tp = do {
          const t = to / fileSize
          t > 1 ? 1 : t
        }
        return (fp * 100) + ((tp - fp) * p)
      }
      readBlobPromise = readBlobPromise
        .then(() => readBlob(file.slice(from, to)))
        .then(arrayBuffer => {
          if (cancel) {
            callWhenCanceled(tempFileId)
            return Promise.reject('canceled')
          }
          uploadPromise = uploadPromise
            .then(getWillResolvePromise)
            .then(() => this._uploadTempFile(
              tempFileId,
              arrayBuffer,
              p => p |> getPercent |> percentCallback,
              from
            ))
          return uploadPromise
        })
      if (to < fileSize) {
        uploadFile(to, to + step)
      }
    }

    uploadFile(0, step)

    await readBlobPromise
    await uploadPromise
      .then(ifCancelReject)
      .then(getWillResolvePromise)

    return await gApi.temp2LFile(this.sid, tempFileId)
  }

  async deleteFile (ids) {
    if (!ids || ids.length === 0) {
      return
    }
    if (!isArray(ids)) {
      ids = [ids]
    }
    await Promise.all(ids.map(id => gApi.deleteFile(this.sid, id)))
    return ids
  }
  
  // 得到文件地址
  getFileUrl (fileInfo) {
    return `http://${gApi.g.currentIP}/file?id=${fileInfo.fileId}`
  }

  getShareUrl (fileInfo) {
    // const host = window.hostParams && hostParams.host.length > 1
    //   ? hostParams.host[1]
    //   : 'api.qingkaoqin.com:33362'
    const host = gApi.g.currentIP
    return `http://${host}/file?id=${fileInfo.fileId}&filename=${fileInfo.name}`
  }

  getFileContent (fileId, start = 0, step = -1) {
    return gApi.getLFileData(this.sid, fileId, start, step)
  }
}

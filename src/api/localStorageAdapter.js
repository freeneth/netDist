import { isArray } from "../util/object-utils"
import {gApi} from "./gApi"
import _CommonApi from "./_common"

class Api extends _CommonApi {
  constructor (sid) {
    super()
    this.sid = sid
  }
  /**
   * file sys
   */
  getFileSys () {
    return Promise.resolve(JSON.parse(localStorage.getItem('fileSystem')))
  }

  patchFileSys (fileSystem) {
    console.log(fileSystem |> JSON.stringify |> JSON.parse)
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }

  /**
   * 文件哈希
   */
  getFileIdByHash (hash) {
    return Promise.resolve(localStorage.getItem(`fileHash:${hash}`))
  }

  postFileIdWithHash (hash, id) {
    localStorage.setItem(`fileHash:${hash}`, id)
    return Promise.resolve()
  }

  deleteFileHash (hashs) {
    if (!isArray(hashs)) {
      hashs = [hashs]
    }
    hashs.forEach(hash => localStorage.removeItem(`fileHash:${hash}`))
    return Promise.resolve()
  }

  /**
   * files
   */
  async getFileInfos (ids) {
    const _isArray = isArray(ids)
    _isArray || (ids = [ids])

    const details = await Promise.resolve(ids.map(id =>
      JSON.parse(localStorage.getItem('file:' + id)).also(it === null && console.warn('未找到数据，id: ' + id)) ||
      {id, name: '损坏的文件'}
    ))

    return _isArray ? details : details[0]
  }

  patchFileInfo (id, file) {
    localStorage.setItem('file:' + id, JSON.stringify(file))
  }

  postFileInfo (file) {
    file.updateTime = new Date().toLocaleDateString();
    file.updateUserName = 'Test Name'
    localStorage.setItem('file:' + file.id, JSON.stringify(file))
  }

  deleteFileInfo (ids) {
    if (!isArray(ids)) {
      ids = [ids]
    }
    ids.forEach(id => localStorage.removeItem('file:' + id))
    return Promise.resolve()
  }

  getFileUrl (fileInfo) {
    return `http://${gApi.g.currentIP}/file?id=${fileInfo.fileId}`
  }

  getShareUrl (fileInfo) {
    // const host = window.hostParams && hostParams.host.length > 1
    //   ? hostParams.host[1]
    //   : 'api.qingkaoqin.com:33362'
    const host = G.currentIP
    return `http://${host}/file?id=${fileInfo.fileId}&filename=${fileInfo.name}`
  }

  // 后台生成文件名（文件id）的方式很特别，相同内容的文件必定相同文件名，
  // 为文件设置一份引用计数，以便在删除时考虑是否真正删除
  // 此外，稍微注意秒传功能也用到了这个
  async increaseReferenceCount (fileId) {
    const key = `fileReference:${fileId}`
    const count = localStorage.getItem(key) | 0
    return (count + 1).also(localStorage.setItem(key, it + ''))
  }
  async decrementReferenceCount (fileId) {
    const key = `fileReference:${fileId}`
    const count = localStorage.getItem(key) | 0
    return (count - 1)
      .also(it > 0 ? localStorage.setItem(key, it + '') : localStorage.removeItem(key))
      .alsoPrint('当前文件还有 %d 个引用')
  }

  // 分割后，对业务逻辑来说，是 N个时间循环内多次调用该方法，N默认为 0 +1=1
  // 但 Http请求只发一次，同时会自动合并参数
  async getName (ids) {
    console.warn('request is sending')
    return ids.map((it, i) => it + i)
  }
}

const api = new Api(window.sid)

export default api

window.api = api

import {isArray, isObject} from "../util/object-utils"
import _CommonApi from "./_common"

/**
 * @typedef {Object} DB
 * @property {string} NET_DISK_FILE_SYS
 * @property {string} NET_DISK_FILE_DETAIL
 * @property {string} NET_DISK_FILE_REFERENCE_COUNT
 * @property {string} NET_DISK_FILE_HASH_MAP_ID
 */
/**
 * @typedef {Object} ldbn
 * @property {function} txro
 * @property {function} tx
 */
/**
 * @typedef {Object} config
 * @property {ldbn} ldbn
 * @property {string} sid
 * @property {string} userId
 * @property {DB} DB
 * @property {G} G
 * @property {function} getUserName
 */

// let ldbn, DB, sid, userId, G, getUserName

function toArray (a) {
  if (!isArray(a)) {
    a = [a]
  }
  return a
}

class Api extends _CommonApi {
  getTxRo () {
    return this.ldbn.txro()
  }
  getTx () {
    return this.ldbn.tx(this.sid)
  }

  async read  (tableName, key, handler = () => {}) {
    const readMulti = isArray(key)
    const txro = this.getTxRo()
    const transaction = this.ldbn
      .hash(tableName)
      [readMulti ? 'getSome' : 'get'](txro, key)
    const result = await txro.commit(transaction)
    if (result === null || result === undefined) {
      return result
    }
    return isObject(result)
      ? key.map((k) => {
        let value = result[k]
        value = value && JSON.parse(value)
        value = handler(value, k) || value
        return value
      })
      : JSON.parse(result)
  }

  async singleWrite (tableName, key, value) {
    const tx = this.getTx()
    const transaction = this.ldbn.hash(tableName).set(tx, key, JSON.stringify(value))
    await tx.commit(transaction);
  }

  async remove (tableName, ids) {
    const readMulti = isArray(ids)
    const tx = this.getTx()
    const transaction = this.ldbn
      .hash(tableName)
      [readMulti ? 'deleteSome' : 'delete'](tx, ids)
    await tx.commit(transaction);
  }

  // 读文件系统
  async getFileSys () {
    return await this.read(this.DB.NET_DISK_FILE_SYS, this.userId);
  }

  // 写文件系统
  async patchFileSys (fileSystem) {
    await this.singleWrite(this.DB.NET_DISK_FILE_SYS, this.userId, fileSystem)
  }

  // 根据文件哈希值查找文件 id
  getFileIdByHash (hash) {
    return this.read(this.DB.NET_DISK_FILE_HASH_MAP_ID, hash)
  }

  // 写文件哈希
  postFileIdWithHash (hash, id) {
    return this.singleWrite(this.DB.NET_DISK_FILE_HASH_MAP_ID, hash, id)
  }

  // 删除文件哈希 (可删多个)
  deleteFileHash (hash) {
    return this.remove(this.DB.NET_DISK_FILE_HASH_MAP_ID, hash)
  }

  // 读文件详情
  async getFileInfos (ids) {
    const _isArray = isArray(ids)
    _isArray || (ids = [ids])
    const details = await this.read(this.DB.NET_DISK_FILE_DETAIL, ids, (detail, id) => {
      if (!detail) {
        console.warn('未找到数据，id: ' + id)
        detail = {id, name: '损坏的文件'}
      }
      return detail
    })
    return _isArray ? details : details[0]
  }

  // 修改文件详情
  async patchFileInfo (id, file) {
    file.updateTime = new Date().toLocaleDateString()
    file.updateUserName = await this.getUserName()
    await this.singleWrite(this.DB.NET_DISK_FILE_DETAIL, id, file)
  }

  // 添加文件详情
  async postFileInfo (file) {
    file.updateTime = new Date().toLocaleDateString()
    file.updateUserName = await this.getUserName()
    await this.singleWrite(this.DB.NET_DISK_FILE_DETAIL, file.id, file)
  }

  async deleteFileInfo (ids) {
    if (!isArray(ids)) {
      ids = [ids]
    }
    await this.remove(this.DB.NET_DISK_FILE_DETAIL, ids)
  }

  // 后台生成文件名（文件id）的方式很特别，相同内容的文件必定相同文件名，
  // 为文件设置一份引用计数，以便在删除时考虑是否真正删除
  async increaseReferenceCount (fileId) {
    if (!fileId) {
      return 0
    }
    const {NET_DISK_FILE_REFERENCE_COUNT} = this.DB
    let count = await this.read(NET_DISK_FILE_REFERENCE_COUNT, fileId) | 0
    count = count + 1
    await this.singleWrite(NET_DISK_FILE_REFERENCE_COUNT, fileId, count + '')
    console.log(count)
    return count
  }

  async decrementReferenceCount (fileId) {
    if (!fileId) {
      return 0
    }
    const {NET_DISK_FILE_REFERENCE_COUNT} = this.DB
    let count = await this.read(NET_DISK_FILE_REFERENCE_COUNT, fileId) | 0
    count = count - 1
    if (count > 0) {
      await this.singleWrite(NET_DISK_FILE_REFERENCE_COUNT, fileId, count + '')
    } else {
      await this.remove(NET_DISK_FILE_REFERENCE_COUNT, fileId)
    }
    console.log('当前文件还有 %d 个引用', count)
    return count
  }
}

const api = new Api()

export default api

export function initApi (config) {
  if (!config) {
    return
  }
  api.ldbn = config.ldbn
  api.DB =  config.DB
  api.sid = config.sid
  api.userId = config.userId
  api.getUserName = config.getUserName
}

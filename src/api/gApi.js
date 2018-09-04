import { initLAPI } from "@leither/l-api";
/**
 * @typedef {Object} FileApi
 * @property {Function} openTempFile
 * @property {Function} setLFileData
 * @property {Function} temp2LFile
 * @property {Function} deleteFile
 * @property {Function} getLFileData
 */
/**
 * @typedef {Object} G
 * @property {string} currentIP
 * @property {FileApi} api
 */
//const api = initLAPI(location.origin + '/webapi/')
const api = initLAPI('http://192.168.1.187' + '/webapi/')//异地测试阿里云
window.G = {};
G.api = api;
export const gApi = {
  openTempFile: (sid) => G.api.openTempFile(sid),
  setLFileData: async (sid, tempFileId, index, dataNeedSend) => {
    const _1KB = 1024
    const _50KB = 1024 * 50
    const _1MB = 1024 * _1KB
    const step = _50KB * 2
    const byteLength = dataNeedSend.byteLength
    if (byteLength < _1MB) {
      await G.api.setLFileData(sid, tempFileId, index, dataNeedSend)
      return
    }
    for (let i = 0; i < byteLength; i = i + step) {
      await G.api.setLFileData(sid, tempFileId, index + i, dataNeedSend.slice(i, i + step))
    }
  },
  temp2LFile: (sid, tempFileId) => G.api.temp2LFile(sid, tempFileId),
  deleteFile: (sid, id) => G.api.deleteFile(sid, id),
  getLFileData: (sid, fileId, start = 0, step = -1) => G.api.getLFileData(sid, fileId, start, step),
  getVar: (unKnowArg, attr) => G.api.getVar(null, attr),
  get g () {
    return G
  }
}

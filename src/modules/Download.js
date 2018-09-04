/**
 * @type {StreamSaver}
 */
import streamSaver from 'streamsaver'
import PQueue from 'p-queue'
import api from '../api'
import utils from "../util/angular-bridge"
import JsZip from 'jszip'
import {downloadBlob} from "../util/browser"

/**
 * @typedef {object} StreamSaver
 * @property {function} createWriteStream
 */

/**
 * @typedef {object} JsZip
 * @property {function} folder
 * @property {function} file
 * @property {function} generateAsync
 */

export const DownloadEvents = {
  PercentUpdating: 'PercentUpdating',
  RateUpdating: 'RateUpdating'
}

export class Download {
  static step = 1024 * 1024 * 3 // 3M * 10

  constructor (file, generateTypedArray) {
    if (generateTypedArray) {
      this.generateTypedArray = true
    } else {
      const fileStream = streamSaver.createWriteStream(file.name, file.sizeNumber)
      this.writer = fileStream.getWriter()
    }
    this.fileId = file.alsoPrint().fileId
    this.fileSize = file.sizeNumber
  }

  async download (concurrency = 8) {
    const {fileSize, fileId} = this
    const downloadFragmentQueue = new PQueue({concurrency})
    const append2WriterQueue = new PQueue({concurrency: 1})
    const resultTypedArrays = []

    const downloadFile = (from, to) => {
      const saveUInt8Array = (uInt8Array) => this.generateTypedArray
        ? resultTypedArrays.push(uInt8Array)
        : this.writer.write(uInt8Array)

      downloadFragmentQueue
        .add(() => api.getFileContent(fileId, from, to - from))
        .also(append2WriterQueue
          .add(() => it)
          .then(saveUInt8Array)
        )

      if (to < fileSize) {
        downloadFile(to, to + Download.step)
      }
    }

    downloadFile(0, 1024 * 64)
    await append2WriterQueue.onIdle()
    console.log('end')

    setTimeout(() => this.writer?.close()?.catch(console.error))

    return resultTypedArrays
  }

  static fixUInt8Arrays (uInit8Arrays) {
    const length = uInit8Arrays.reduce((sum, it) => sum + it.length, 0)
    const uInit8Array = new Uint8Array(length)
    let index = 0
    uInit8Arrays.forEach(uia => {
      uInit8Array.set(uia, index)
      index += uia.length
    })
    return uInit8Array
  }
}

export class FolderDownload {
  constructor (folder) {
    // 简单地复制即可
    this.folder = folder |> JSON.stringify |> JSON.parse
    this.flatFiles = []
    this.jsZip = undefined
  }

  async download () {
    this.flatFiles = await this.fetchFileNodes()
    if (this.isFolderSizeTooBig()) {
      utils.warning('该文件夹大于1G，不支持下载')
      return
    }
    await this.generateZipFile()
    await this.downloadZipFile()
  }

  async fetchFileNodes () {
    const flatFiles = []
    const simpleFileNodes = do {
      let simpleFileNodes = []
      this.folderForEach((node) => {
        flatFiles.push(node)
        if (!node.sub) {
          simpleFileNodes.push(node)
        }
      })
      simpleFileNodes
    }
    const fileDetails = await api.getFileInfos(simpleFileNodes.map(({id}) => id))
    fileDetails.forEach((detail) => {
      const node = simpleFileNodes.find(({id}) => detail.id === id)
      Object.assign(node, detail)
      node._fullPathName += node.name
    })
    return flatFiles
  }

  isFolderSizeTooBig () {
    const size = this.flatFiles.reduce((sum, it) => {
      return sum + (it.sizeNumber || 0)
    }, 0)
    return size > 1024 * 1024 * 1024 // 1GB
  }

  async generateZipFile () {
    const jsZip = this.jsZip = new JsZip()
    const promises = []
    this.flatFiles.forEach(node => {
      if (node._isFolder) {
        jsZip.folder(node._fullPathName)
      } else {
        const downloader = new Download(node, true)
        const promise = downloader.download(6)
          .then(uInit8Arrays => {
            jsZip.file(node._fullPathName,  Download.fixUInt8Arrays(uInit8Arrays))
          })
        promises.push(promise)
      }
    })
    await Promise.all(promises)
  }

  async downloadZipFile () {
    const blob = await this.jsZip.generateAsync({type : "uint8array"})
    downloadBlob(this.folder.name + '.zip', blob)
  }

  folderForEach (callback) {
    function deepTraversal (node) {
      const sub = node.sub;
      if (!sub) {
        return
      }
      const length = sub.length;
      for (let i = 0; i < length; i++) {
        const currentNode = sub[i]

        currentNode._fullPathName = node._fullPathName
          ? node._fullPathName + '/' + (currentNode.name || '')
          : (currentNode.name || '')
        currentNode._isFolder = !!currentNode.sub

        callback(currentNode)
        deepTraversal(currentNode)
      }
    }
    deepTraversal(this.folder)
  }
}

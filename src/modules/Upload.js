import {hash} from "../util/hash"
import {shouldTip} from "../util/reject-tip"
import {delay} from "../util/delay"
import utils from "../util/angular-bridge"
import api from "../api"
import {isArray} from "../util/object-utils"
import {SimpleEvent} from "./SimpleEvent"
import './file-system/mixins/CouldUploadNode'
import {FileNode} from "./file-system/FileNode"

export const UploadEvents = {
  Initializing: 'Initializing',

  VirtualNodeGenerated: 'VirtualNodeGenerated',
  VirtualNodeRemoving: 'VirtualNodeRemoving',

  PercentUpdating: 'PercentUpdating',
  RateUpdating: 'RateUpdating',
  UploadPaused: 'UploadPaused',

  RelNodeGenerated: 'RelNodeGenerated',
  Success: 'Success',
  Fail: 'Fail'
}

const RollbackSteps = {
  Hashing: 'Hashing',
  Uploading: 'Uploading'
}

const _1M = 1024 * 1024
const animationTimeOfHash = fileSize => {
  const t = fileSize / 18 / _1M * 1000
  return t < 400 ? 400 : (t | 0)
}
const animationTimeOfServerHash = fileSize => {
  const t = fileSize / 12 / _1M * 1000
  return t < 400 ? 400 : (t | 0)
}

export default class Upload {
  constructor () {
    this.event = new SimpleEvent()
    this.percent = 0
    this.rate = '-'
    this.animationDuration = 0
    this.step = UploadEvents.Initializing.also(this.event.emit(it))
    this.rollbackStep = undefined
    this.node = undefined
    this.areWeUseQuickUpload = false
    this.shouldWeShowUploadPercent = false
    this.isCanceled = false
    this.isPaused = false
    this.rejectWillResolve = () => {}

    this._cancel = (() => {
      const _cancel = {
        cancelCurrent: () => Promise.resolve(),
        onCancel: (cancel) => {
          _cancel.cancelCurrent = cancel
        }
      }
      return _cancel
    })()
    
    this._pause = (() => {
      const _pause = {
        willResolvePromise: Promise.resolve(),
        onPromiseGet: () => {},
        getWillResolvePromise (data) {
          _pause.onPromiseGet()
          return _pause.willResolvePromise.then(() => data)
        },
      }
      return _pause
    })()
  }

  step1GenerateVirtualNode (tNode) {
    tNode._onUpload = true
    tNode.name = tNode.name + '.tmp'

    this.node = tNode
    this._eUpdateUploadPercent(2)
    this.shouldWeShowUploadPercent &&
      this._eVirtualNodeGenerate(tNode)
  }

  async quickUpload (file) {
    const result = {}
    await delay()
    this.rollbackStep = RollbackSteps.Hashing
    console.time('本次哈希时间为')
    result.hexHash = await hash(file, this._cancel.onCancel,
      this._pause.getWillResolvePromise)
    console.timeEnd('本次哈希时间为')
    result.fileId = await api.getFileIdByHash(result.hexHash)
    if (result.fileId) {
      this._eUpdateUploadPercent(99)
      this.areWeUseQuickUpload = true
    }
    return result
  }

  async normalUpload (file) {
    const fileSize = file.size

    // 预估服务端哈希时间
    const estimateServerHashTime = () => {
      console.time('服务端哈希时间')
      // 预估服务端哈希时间
      setTimeout(() => {
        this._eUpdateUploadPercent(99, animationTimeOfServerHash(fileSize)
          .alsoPrint('服务端哈希时间预计为'))
      })
    }
    const calcUploadRate = (callback) => {
      const getNow = () => new Date().getTime()
      let oldTime = getNow() - 1 // 防止 0 / 0
      let oldPercent = 0
      return percent => {
        const newTime = getNow()
        const timeDuration = newTime - oldTime
        const percentDuration = (percent - oldPercent) / 100
        const rate = percentDuration * fileSize / timeDuration // KB/s
        callback({
          percent,
          rate,
          duration: timeDuration
        })
        oldTime = newTime
        oldPercent = percent
      }
    }
    const getRate = (rate) => do {
      if (rate <= 1) {
        '1KB/S'
      } else if (rate < 10) {
        `${rate.toFixed(1)}KB/S`
      } else if (rate < 1000) {
        `${rate | 0}KB/S`
      } else if (rate < 10000) {
        `${(rate / 1000).toFixed(1)}MB/S`
      } else if (rate < 1000000) {
        `${(rate / 1000) | 0}MB/S`
      } else {
        `Infinity`
      }
    }

    // 手动上传以获得 Id
    this.rollbackStep = RollbackSteps.Uploading
    console.time('本次上传文件耗时')
    const fileId = await api.uploadFileV2(
      file,
      calcUploadRate(({percent, rate, duration}) => {
        percent >= 100 && estimateServerHashTime()
        this._eUpdateUploadPercent((percent * 0.82) + 12, duration)
        this._eUpdateUploadRate(getRate(rate))
      }),
      this._cancel.onCancel,
      this._pause.getWillResolvePromise
    )
      .catch(shouldTip)
    console.timeEnd('服务端哈希时间')
    console.timeEnd('本次上传文件耗时')
    return fileId
  }

  /**
   * 第二步，生成哈希和文件id
   */
  async step2GenerateFileId (tNode, file) {
    const fileSize = file.size
    const shouldWeUseQuickUpload = fileSize > _1M // 是否尝试开启秒传，>1M尝试

    // 使用秒传生成 Id
    const quickUploadResult = do {
      if (shouldWeUseQuickUpload) {
        this._eUpdateUploadPercent(12, animationTimeOfHash(fileSize)
          .alsoPrint('哈希时间预计为'))
        await this.quickUpload(file)
      }
    }

    const hexHash = quickUploadResult?.hexHash
    let fileId = quickUploadResult?.fileId

    // 生成 Id
    if (!fileId) {
      fileId = await this.normalUpload(file)
      fileId && hexHash && api.postFileIdWithHash(hexHash, fileId)
    }

    return {
      fileId,
      hexHash
    }
  }

  /**
   * 第四步，引用计数加1
   */
  async step4Finished (uploadTempNode, relNode) {
    try {
      await uploadTempNode.increaseReferenceCount()
      if (this.shouldWeShowUploadPercent) {
        this._eUpdateUploadPercent(100)
        await delay(444)
        this._eVirtualNodePop()
      }
      relNode._uploading = false
      this._eRelNodeGenerated(relNode)
      this.areWeUseQuickUpload ? utils.success('秒传成功')
        : utils.success('上传成功')
      this._eUploadSuccess(this.areWeUseQuickUpload)
    } catch (e) {
      this._eUploadFail()
      try {
        shouldTip(e)
      } catch (e) {
        utils.error('上传失败')
        console.error(e)
      }
    }
  }
  
  async upload (file, toFolder) {
    const name = file.name
    const sizeNumber = file.size
    const uploadTempNode = FileNode.upload(name, sizeNumber, toFolder)

    this.shouldWeShowUploadPercent = sizeNumber > _1M

    // 第一步：生成虚拟节点（上传中节点，带进度条）
    this.step1GenerateVirtualNode(uploadTempNode)

    // 第二步：生成 fileId
    const {
      fileId,
      hexHash
    } = await this.step2GenerateFileId(uploadTempNode, file)

    const fileNode = uploadTempNode.toFileNode(fileId, hexHash)
    fileNode._uploading = true

    // 第三步：上传完毕
    await fileNode.create(toFolder)
    await fileNode.applyToServer()
    
    // 第四步：文件引用计数加 1，保存成功后的动画
    await this.step4Finished(uploadTempNode, fileNode)
  }

  rollback () {
  }
  
  async cancelUpload () {
    if (this.isPaused) {
      this._eUploadFail(1, 200)
      this.rejectWillResolve('canceled')
      await this.rollback()
      this.isCanceled = true
      return
    }
    this._eUploadFail(1, 5000)
    console.time('本次回滚花费了')
    this.canceledInfo = await this._cancel.cancelCurrent()
    await delay(100)
    await this.rollback()
    console.timeEnd('本次回滚花费了')
    this.isCanceled = true
  }

  pauseOrStartUpload = (() => {
    let resolve
    return async (shouldPause) => {
      if (shouldPause) {
        this._pause.willResolvePromise = new Promise((_resolve, _reject) => {
          resolve = _resolve
          this.rejectWillResolve = _reject
        })
      } else {
        resolve()
      }
      if (shouldPause) {
        await new Promise(resolve => {
          this._pause.onPromiseGet = resolve
        })
      }
      this._eUploadPaused(shouldPause)
      this.isPaused = shouldPause
    }
  })()

  on (eventNames, callback) {
    const isEventNamesArray = isArray(eventNames)
    isEventNamesArray || (eventNames = [eventNames])
    const indexes = eventNames.map(eventName => this.event.on(eventName, callback))
    return isEventNamesArray ? indexes : indexes[0]
  }

  unbind (eventNames, index) {
    isArray(eventNames) || (eventNames = [eventNames])
    eventNames.forEach(eventName => this.event.unbind(eventName, index))
  }

  _eUploadPaused (isPaused) {
    this.step = UploadEvents.UploadPaused.also(this.event.emit(it, {
      node: this.node,
      isPaused
    }))
  }

  _eUpdateUploadPercent (percent, duration = 400) {
    this.animationDuration = duration
    this.percent = percent
    this.step = UploadEvents.PercentUpdating.also(this.event.emit(it, {
      node: this.node,
      percent,
      duration
    }))
  }

  _eUpdateUploadRate (rate) {
    this.rate = rate
    this.step = UploadEvents.RateUpdating.also(this.event.emit(it, {
      node: this.node,
      rate
    }))
  }

  _eUploadFail (percent = 100, duration = 400) {
    this.percent = percent
    this.animationDuration = duration
    this.step = UploadEvents.Fail.also(this.event.emit(it, {
      node: this.node,
      percent,
      duration
    }))
  }

  _eUploadSuccess (areQuickUpload) {
    this.percent = 100
    this.animationDuration = 400
    this.step = UploadEvents.Success.also(this.event.emit(it, areQuickUpload))
  }

  _eRelNodeGenerated (node) {
    this.step = UploadEvents.RelNodeGenerated.also(this.event.emit(it, node))
  }

  _eVirtualNodeGenerate (node) {
    this.step = UploadEvents.VirtualNodeGenerated.also(this.event.emit(it, node))
  }

  _eVirtualNodePop () {
    this.step = UploadEvents.VirtualNodeRemoving.also(this.event.emit(it, this.node))
  }
}

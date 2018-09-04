import React from "react"
import {FileBar} from "./component/FileBar"
import TitleBar from "./component/TitleBar"
import {showConfirmBox, showPreviewBox} from "./component/common/Dialog"
import {OperateButtonsInTitle} from "./component/OperateButtonsInTitle"
import {
  pushUploaderToEntryBox,
  showEntryBox
} from "./component/EntryBox"
import FileUploadPercent, {FileUploadPercentState} from "./component/FileUploadPercent"
import {
  bindUpload,
  generateCouldDragFileNode,
  handleUploadContainerDrag
} from "./component/FileDrag"
import {
  IFrameContainer,
  PdfContainer,
  VideoContainer,
} from "./component/common/PreviewDialogContainers"
import api from "./api"
import {router} from "./my-router"
import {throttle} from "./util/utils"
import utils from "./util/angular-bridge"
import {downloadFile} from "./util/browser"
import {arrayRemove} from "./util/object-utils"
import {loge, shouldTip} from "./util/reject-tip"
import Upload, {UploadEvents} from "./modules/Upload"
import reactAutoBinding from "./util/react-auto-binding"
import {Download, FolderDownload} from "./modules/Download"
import {current} from "./modules/current"
import {FileSystem} from "./modules/file-system/FileSystem"
import {FileType} from "./modules/file-system/Node"
import {FolderNode} from "./modules/file-system/FolderNode"
import {FileNode, TempFileNode} from "./modules/file-system/FileNode"
import _curry from 'lodash/curry'

export class NetDisk extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      fileDetails: [],
      showUploadContainer: false,
      couldMouseUp: false
    }

    reactAutoBinding(this)
    this._fetchDetail()
    showEntryBox()
  }

  setState (state, func) {
    super.setState(state, func)
    if (state.fileDetails) {
      router.targetFolderChange(current.folder.id)
    }
  }

  _fetchDetail () {
    api.getFileSys()
      .then(fileSystem => {
        console.debug(fileSystem)
        current.fileSystem = new FileSystem(fileSystem)
        const currentFolder = do {
          if (router.initFolder) {
            current.fileSystem.findNodeById(router.initFolder) || current.fileSystem
          } else {
            current.fileSystem
          }
        }
        this._renderCurrentFileNode(currentFolder)
      })
  }

  /**
   * 进入当前文件夹
   * @param currentNode {FolderNode & CouldOpenNode}
   * @private
   */
  _renderCurrentFileNode (currentNode) {
    currentNode.open((folderNode) => {
      current.folder = folderNode
      this.setState({
        fileDetails: folderNode.sub
      })
    }).catch(console.error)
  }

  /**
   * 预览文件或 打开此文件夹
   */
  show (fileDetail) {
    return () => {
      // 文件夹
      if (fileDetail._isFolder || fileDetail._isVirtual) {
        this._renderCurrentFileNode(fileDetail)
        return
      }

      // 上传时的临时文件
      if (fileDetail._onUpload) {
        return
      }

      // 获取当前文件夹下所有相同类型的文件
      const getSameTypeOf = (type) => {
        // 获取该文件夹下的所有图片
        const typedFiles = this.state.fileDetails.filter(it => it.type === type)
        // 使 当前图片 提前至第一张
        const index = typedFiles.findIndex(it => it.id === fileDetail.id)
        ;[typedFiles[0], typedFiles[index]] = [typedFiles[index], typedFiles[0]]
        // 生成标题和内容
        const titles = []
        const contents = []
        const payload = []
        typedFiles.forEach(it => {
          titles.push(it.name)
          contents.push(api.getFileUrl(it))
          payload.push(it)
        })
        return {titles, contents, payload}
      }

      // 类型: 预览器
      const map = {
        [FileType.Image]: undefined,
        [FileType.Video]: VideoContainer,
        [FileType.Pdf]: PdfContainer,
        [FileType.Text]: IFrameContainer,
        // [FileType.Word]: DocContainer
        // [FileType.Zip]: ZipContainer
      }

      // 显示预览弹窗
      if (Object.keys(map).includes(fileDetail.type)) {
        showPreviewBox(
          getSameTypeOf(fileDetail.type)
            .also(it.Component = map[fileDetail.type])
        ).catch(console.error)
        return
      }

      if ([FileType.Mind, FileType.Doc].includes(fileDetail.type)) {
        return
      }
      // utils.toast('w', '暂不支持该文件')
      downloadFile(fileDetail.name, api.getFileUrl(fileDetail).alsoPrint() + `&filename=${fileDetail.name}`)
    }
  }

  /**
   * 重命名
   */
  rename (fileDetail) {
    return async (newFileName) => {
      const {fileDetails} = this.state

      fileDetail.name = newFileName
      fileDetail.version = (fileDetail.version || 1) + 1

      if (fileDetail._isFolder) {
        await api.patchFileSys(current.fileSystem)
      } else {
        await api.patchFileInfo(fileDetail.id, fileDetail)
      }

      this.setState({fileDetails})
    }
  }

  /**
   * 删除文件，文件夹
   * @returns {Function}
   */
  remove (node) {
    return () => {
      const content = node instanceof FolderNode
        ? '是否将该文件夹删除?\n(该操作需要较长时间，且会清空文件夹内原有文件)'
        : '是否将该文件删除?'

      const confirmBoxPromise = showConfirmBox({
        content,
        beforeClose: () => confirmBoxPromise
          .then(() => node.remove())
          .then(() => {
            this.setState({})
            utils.toast('s', '删除成功')
          })
          .catch(shouldTip)
          .catch((e) => {
            console.error(e)
            utils.error('我们遇到了一些问题，删除失败，请尝试刷新界面')
          })
      })

      confirmBoxPromise
        .catch(() => {
          console.log('用户取消了操作')
        })
    }
  }

  // 支持超大文件的上传
  uploadFileV2 (files) {
    files = Array.prototype.slice.call(files)
    const getFile = (item) => new Promise(resolve => item.file(resolve))
    files.forEach(async (file, i) => {
      file = file.isFile ? await getFile(file).alsoPrint() : file
      setTimeout(() => {
        file.isDirectory
          ? this._uploadDirectory(file).catch(console.error)
          : this._uploadFileV3(file).catch(console.error)
      }, 800 * i)
    })
  }

  // 上传文件夹
  async _uploadDirectory (directoryEntry) {
    const {fileSystem} = current
    const folderNode = new FolderNode(fileSystem, {
      name: directoryEntry.name
    })
    await folderNode.create(current.folder)

    folderNode._onUpload = true
    this.uploadPercentCallback(folderNode, 2, 200)

    const pReadEntries = directoryEntry =>
      new Promise(::(directoryEntry.createReader().readEntries))
    const readFilePromise = entry => new Promise(::entry.file)

    // 总文件大小
    let folderSize = 0
    const promises = []
    const fileFolderPairs = []
    const readEntries = async (directoryEntry, folder) => {
      const entries = await pReadEntries(directoryEntry)
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        if (entry.isFile) {
          const p = readFilePromise(entry)
            .then(file => fileFolderPairs.push(
              [folder, file.also(f => folderSize += f.size)]
            ))
          promises.push(p)
        } else if (entry.isDirectory) {
          await new FolderNode(fileSystem, {name: entry.name})
            .create(folder)
            .then(_curry(readEntries)(entry))
        }
      }
    }

    await readEntries(directoryEntry, folderNode)
    await Promise.all(promises)

    await Promise.all(fileFolderPairs.map(([folder, file]) =>
      this._uploadFileSimple(file, folder, ({percent, duration, rate}) => {
        percent && (file.percent = percent)
        const percentOfFolder = fileFolderPairs.reduce((sum, [folder, file]) => {
          return sum + (file.size * (file.percent || 0) / folderSize)
        }, 0)
        this.uploadPercentCallback(folderNode, percentOfFolder.alsoPrint(), duration)
      })))

    await folderNode.applyToServer()

    folderNode._onUpload = false
    this.setState({})
    console.log('文件夹上传完毕')
  }

  // 上传文件夹中的文件，计算总进度
  async _uploadFileSimple (file, toFolder, stateCallback) {
    await this._uploadFileV3(file, toFolder, stateCallback)
  }

  /**
   * 主要代码转移至 Upload类中
   * @param file any
   * @param toFolder FolderNode
   * @param stateCallback ({percent, duration})
   * @returns {Promise<void>}
   * @private
   */
  async _uploadFileV3 (file, toFolder, stateCallback = () => {}) {
    let toCurrent = do {
      if (!toFolder) {
        toFolder = current.folder
        true
      } else if (toFolder !== current.folder) {
        false
      } else {
        true
      }
    }

    if (await toFolder.isNameExist(file.name)) {
      utils.error('文件名重复')
      return
    }
    const uploader = new Upload()
    const {fileDetails} = this.state

    file.size > 1024 * 1024 * 60 /* 60M */ && pushUploaderToEntryBox(uploader)

    toCurrent && uploader.on(UploadEvents.VirtualNodeGenerated, (node) => {
      this._appendNodeToState(node.alsoPrint())
    })

    toCurrent && uploader.on(UploadEvents.VirtualNodeRemoving, (node) => {
      arrayRemove(fileDetails, node, (a, b) => a.id === b.id)
      this.setState({})
    })

    toCurrent && uploader.on(UploadEvents.RelNodeGenerated, (node) => {
      this.setState({})
    })

    uploader.on(UploadEvents.PercentUpdating, ({node, percent, duration}) => {
      stateCallback({percent, duration})
      this.uploadPercentCallback(node, percent, duration)
    })

    uploader.on(UploadEvents.RateUpdating, ({node, rate}) => {
      stateCallback({rate})
      this.uploadRateCallback(node, rate)
    })

    uploader.on(UploadEvents.Fail, ({node, percent, duration}) => {
      stateCallback({fail: true})
      node._state = FileUploadPercentState.Error
      this.uploadPercentCallback(node, percent, duration)
      setTimeout(() => {
        arrayRemove(fileDetails, node)
        this.setState({})
      }, 1000)
    })

    uploader.on(UploadEvents.UploadPaused, ({node, isPaused}) => {
      stateCallback({paused: true})
      node._isPaused = isPaused
      this.setState({})
    })

    await uploader.upload(file, toFolder, [])
      .catch(console.error)
  }

  uploadPercentCallback = (() => {
    const update = throttle((node, percent, duration) => {
      node._percent = percent
      node._duration = duration
      this.setState({})
    }, 100)
    return (node, percent, duration) => {
      update(node, percent, duration)
    }
  })()

  uploadRateCallback = (() => {
    const update = throttle((node, rate) => {
      node._rate = rate
      this.setState({})
    }, 1500)
    return (node, rate) => {
      update(node, rate)
    }
  })()

  /**
   * 添加节点到视图
   */
  _appendNodeToState (node) {
    const {fileDetails} = this.state
    if (node._isFolder) {
      const indexOfFirstFile = fileDetails.findIndex(it => !it._isFolder && !it._isVirtual)
      fileDetails.splice(
        indexOfFirstFile === -1 ? fileDetails.length : indexOfFirstFile,
        0, node
      )
    } else {
      fileDetails.push(node)
    }
    this.setState({})
  }

  /**
   * 新建（文件夹，脑图，文档）
   */
  async create (type, name) {
    const areWeCreatingAFolder = type === FileType.Folder

    let node = areWeCreatingAFolder
      ? new FolderNode(current.fileSystem, {name})
      : new FileNode(current.fileSystem, {name, type})

    try {
      await node.create(current.folder)
      await node.applyToServer()
      this.setState({})
      utils.toast('s', '创建成功')
    } catch (e) {
      shouldTip(e)
    }
  }

  share (fileDetail) {
    return () => {
      const url = api.getShareUrl(fileDetail)
      showConfirmBox({
        title: '分享',
        type: 'render',
        Component: <input
          style={{width: 360, height: 40, fontSize: 14, padding: '0 12px'}}
          id={'thisIsAClipboardInput'} readOnly={true} value={url}/>,
        ensureText: '复制链接',
        beforeClose () {
          document.getElementById('thisIsAClipboardInput').select()
          document.execCommand('copy')
        }
      })
        .catch(e => {
          if (e === 'canceled') {
            console.log('用户取消了操作')
            return
          }
          console.error(e)
        })
    }
  }

  moveOrCopy (node) {
    return (toFolder, type) => {
      const isMove = type === 'move'

      node.moveOrCopy(toFolder, isMove)
        .then(fileDetail => {
          this.setState({})
        })
        .catch(loge)
    }
  }

  setCouldMouseUpState (couldMouseUp) {
    this.setState({
      couldMouseUp
    })
  }

  handleDropEnd (e) {
    const items = Array.prototype.slice.call(e.nativeEvent.dataTransfer.items)
    this.uploadFileV2(items.map(item => item.webkitGetAsEntry()).filter(i => i))
    handleUploadContainerDrag('leave', this.setCouldMouseUpState)
  }

  downloadFile (fileDetail) {
    return async () => {
      if (!window.useNewDownloader && !fileDetail._isFolder) {
        downloadFile(fileDetail.name,
          api.getFileUrl(fileDetail) + `&filename=${fileDetail.name}`)
        return
      }

      fileDetail._onDownload = true
      fileDetail._percent = 1
      this.setState({})
      const downloader = fileDetail._isFolder
        ? new FolderDownload(fileDetail)
        : new Download(fileDetail)
      console.time('下载用时')
      setTimeout(() => {
        fileDetail._percent = 95
        fileDetail._duration = 10000
        this.setState({})
      })
      await downloader.download().catch(console.error)
      setTimeout(() => {
        fileDetail._onDownload = false
        this.setState({})
      }, 500)
      console.timeEnd('下载用时')
    }
  }

  render () {
    const {fileDetails, showUploadContainer, couldMouseUp} = this.state

    const cnShowUploadContainer = showUploadContainer ? 'show-upload-container' : ''
    const cnCouldMouseUp = couldMouseUp ? 'mouse-up' : ''

    const FileBars = fileDetails.map((fileDetail, i) => fileDetail
      && !(fileDetail instanceof TempFileNode)
      && !fileDetail._uploading
      && <FileBar
      fileInfo={fileDetail}
      version={fileDetail.version}
      style={i % 2 === 0 ? {backgroundColor: '#dddddd'} : {}}
      events={{
        show: this.show(fileDetail),
        rename: this.rename(fileDetail),
        remove: this.remove(fileDetail),
        moveOrCopy: this.moveOrCopy(fileDetail),
        share: this.share(fileDetail),
        downloadFile: this.downloadFile(fileDetail)
      }}
      {...generateCouldDragFileNode(fileDetail, this.moveOrCopy)}
      key={fileDetail.id + fileDetail.name + i}>
      <div className={'upload'}>{do {
        if (fileDetail._isPaused) {
          <div>已暂停</div>
        } else if (fileDetail._onDownload) {
          <div className={'upload-inner'}>
            <div className={'percent'}>
              <FileUploadPercent
                percent={fileDetail._percent} state={fileDetail._state}
                duration={fileDetail._duration}/>
            </div>
            <span className={'rate'}>{fileDetail._rate || '-'}</span>
          </div>
        } else if (fileDetail._onUpload) {
          <div className={'upload-inner'}>
            <div className={'percent'}>
              <FileUploadPercent
                percent={fileDetail._percent} state={fileDetail._state}
                duration={fileDetail._duration}/>
            </div>
            <span className={'rate'}>{fileDetail._rate || '-'}</span>
          </div>
        }
      }}
      </div>
    </FileBar>)

    return (<div className={'net-disk'}>
      <div className={'title-bar'}>
        我的网盘
        <OperateButtonsInTitle
          events={{
            create: this.create,
            upload: this.uploadFileV2,
          }}/>
      </div>
      {/* 接收文件上传时的拖放 */}
      <div className={`form ${cnShowUploadContainer} ${cnCouldMouseUp}`}
           onDrop={this.handleDropEnd}
           onDragEnter={() => handleUploadContainerDrag('enter', this.setCouldMouseUpState)}
           onDragLeave={() => handleUploadContainerDrag('leave', this.setCouldMouseUpState)}>
        <TitleBar/>
        {FileBars}
      </div>
    </div>)
  }

  componentDidMount () {
    bindUpload((show) => {
      this.setState({
        showUploadContainer: show
      })
    })
  }
}

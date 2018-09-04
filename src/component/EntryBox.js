import React from 'react'
import ReactDOM, {render, unmountComponentAtNode} from 'react-dom'
import netDisk from '../common/img/net-disk.png'
import './EntryBox.pcss'
import {router} from "../my-router"
import reactAutoBinding from "../util/react-auto-binding"
import {UploadEvents} from "../modules/Upload"
import {once} from "../util/utils"
import showDialog from "./common/Dialog"
import FileUploadPercent, {FileUploadPercentState} from "./FileUploadPercent"
import utils from "../util/angular-bridge"

let singleEntryBoxInstance

export default class EntryBox extends React.Component {
  constructor (props) {
    super(props)

    if (singleEntryBoxInstance) {
      console.error('网盘入口已被注册')
    }
    singleEntryBoxInstance = this

    this.state = {
      big: false,
      show: true,
      onUploadingCount: 0,
      uploadFail: false
    }
    this.uploaders = []

    reactAutoBinding(this)

    window.onbeforeunload = (e) => {
      e = e || window.event;
      const msg = '仍有文件在上传，是否离开'

      if (this.state.onUploadingCount > 0) {
        // For IE and Firefox prior to version 4
        if (e) {
          e.returnValue = msg;
        }

        // For Safari
        return msg;
      }
    };

    router.onRouterChange((url) => {
      if (this.url === url) {
        return
      }
      this.url = url
      this.setState({
        big: url.includes('/app/mind') || url.includes('/app/editor'),
        show: !url.includes('/app/login/scan')
      })
    })

    utils.onFullScreenChange((payload) => {
      this.setState()
      console.log(payload)
    })
  }
  
  pushUploader (uploader) {
    this.uploaders.push(uploader)
    const onUploadingCount = this.uploaders.filter(uploader =>
      ![UploadEvents.Success, UploadEvents.Fail].includes(uploader.step)).length
    this.setState({
      onUploadingCount
    })

    uploader.on(UploadEvents.Success, () => {
      this.setState({
        onUploadingCount: this.state.onUploadingCount - 1
      })
    })
    uploader.on(UploadEvents.Fail, ({node, percent, duration}) => {
      if (percent >= 99) {
        this.setState({
          uploadFail: true
        })
      } else {
        this.setState({
          onUploadingCount: this.state.onUploadingCount - 1
        })
      }
    })
  }

  showUploadBox (e) {
    if (this.uploaders.length === 0) {
      return
    }

    e.stopPropagation()
    showUploadBox(this.uploaders)
  }

  onEntryBoxClick () {
    if (this.url && !this.url.includes('/app/net-disk')) {
      router.targetFolderChange()
    }
  }

  render () {
    const {big, show, onUploadingCount, uploadFail} = this.state

    const cBig = big ? 'big' : ''
    return <div
      className={`-net-disk-entry-box-self-control ${cBig}`}
      style={{visibility: show ? 'visible' : 'hidden'}}
      onClick={this.onEntryBoxClick}
    >
      <div className="-icon" style={{background:`url(${netDisk})`}}
           onClick={this.showUploadBox}/>
      <div className="-text">网盘</div>
      {do {
        onUploadingCount > 0 &&
          <div className={'file-num-on-upload'}>
            {uploadFail ? '?' : onUploadingCount}
          </div>
      }}
    </div>
  }
}

const EntryBoxState = {
  Paused: 'Paused',
  Canceled: 'Canceled',
  UploadFail: 'UploadFail',
  QuickUploaded: 'QuickUploaded',
  Uploaded: 'Uploaded',
  Uploading: 'Uploading'
}

const PauseOrPlayButtonState = {
  Paused: 'Paused',
  PausingOrStarting: 'PausingOrStarting',
  Play: 'Play'
}

const CancelButtonState = {
  Cancelling: 'Cancelling'
}

class UploadBoxBar extends React.Component {
  constructor (props) {
    super(props)
    const {uploader} = props

    const entryBoxState = do {
      if (uploader.isCanceled) {
        EntryBoxState.Canceled
      } else if (uploader.isPaused) {
        EntryBoxState.Paused
      } else if (uploader.step === UploadEvents.Fail) {
        EntryBoxState.UploadFail
      } else if (uploader.areWeUseQuickUpload) {
        EntryBoxState.QuickUploaded
      } else if (uploader.step === UploadEvents.Success) {
        EntryBoxState.Uploaded
      } else if (
        [
          UploadEvents.RateUpdating,
          UploadEvents.PercentUpdating,
          UploadEvents.VirtualNodeGenerated,
          UploadEvents.VirtualNodeRemoving,
          UploadEvents.RelNodeGenerated
        ].includes(uploader.step)
      ) {
        EntryBoxState.Uploading
      }
    }
    
    this.state = {
      percent: uploader.percent,
      duration: 400,
      rate: uploader.rate,
      percentState: undefined,
      entryBoxState,

      pauseButtonState: uploader.isPaused
        ? PauseOrPlayButtonState.Paused
        : PauseOrPlayButtonState.Play,
      cancelButtonState: undefined
    }
    
    reactAutoBinding(this)

    const erMap = {
      [UploadEvents.VirtualNodeGenerated]: () => {
        this.setState({
          entryBoxState: EntryBoxState.Uploading
        })
      },
      [UploadEvents.PercentUpdating]: ({node, percent, duration}) => {
        this.isCanceled || this.setState({
          percent,
          duration
        })
      },
      [UploadEvents.RateUpdating]: ({node, rate}) => {
        this.isCanceled || this.setState({
          rate
        })
      },
      [UploadEvents.Fail]: ({node, percent, duration}) => {
        this.setState({
          percentState: FileUploadPercentState.Error
        })
        setTimeout(() => {
          this.setState({
            percent,
            duration,
          })
        })
        if (this.isCanceled) {
          return
        }
        setTimeout(() => {
          this.setState({
            entryBoxState: EntryBoxState.UploadFail
          })
        }, duration + 400)
      },
      [UploadEvents.Success]: (areQuickUpload) => {
        this.setState({
          entryBoxState: areQuickUpload ? EntryBoxState.QuickUploaded
            : EntryBoxState.Uploaded
        })
      }
    }

    Object.entries(erMap).forEach(([eventName, eventReceiver]) => {
      const index = uploader.on(eventName, eventReceiver)
      this.registerOnComponentWillUnmount(() =>
        uploader.unbind(eventName, index)
      )
    })
  }

  pauseOrStartUpload = (() => {
    let locked = false
    return () => {
      const {uploader} = this.props
      const {pauseButtonState} = this.state

      if (locked) {
        return
      }

      locked = true
      this.setState({
        pauseButtonState: PauseOrPlayButtonState.PausingOrStarting
      })

      const isPaused = pauseButtonState === PauseOrPlayButtonState.Paused
      const shouldPause = !isPaused
      if (pauseButtonState === PauseOrPlayButtonState.PausingOrStarting) {
        console.error('严重的逻辑错误，发生在暂停按钮')
        return
      }
      uploader.pauseOrStartUpload(shouldPause).then(() => {
        const newState = shouldPause ? {
          pauseButtonState: PauseOrPlayButtonState.Paused,
          entryBoxState: EntryBoxState.Paused
        } : {
          pauseButtonState: PauseOrPlayButtonState.Play,
          entryBoxState: EntryBoxState.Uploading
        }
        this.setState(newState, () => {
          locked = false
        })
      })
    }
  })()

  cancelUpload () {
    const {uploader} = this.props
    if (this.isCanceled) {
      return
    }
    this.isCanceled = true
    this.setState({
      cancelButtonState: CancelButtonState.Cancelling
    })

    uploader.cancelUpload().then(() => {
      this.setState({
        entryBoxState: EntryBoxState.Canceled
      })
    })
  }

  render () {
    const {percent, duration, rate, percentState, pauseButtonState,
      entryBoxState, cancelButtonState} = this.state
    const {uploader: {node}} = this.props

    const UploadState = do {
      const map = {
        [EntryBoxState.Uploading]: <div className={'upload-inner'}>
          <div className={'percent'}>
            <FileUploadPercent percent={percent} state={percentState} duration={duration}/>
          </div>
          <span className={'rate'}>{rate}</span>
        </div>,

        [EntryBoxState.Paused]: <div className={'finished'}>已暂停</div>,

        [EntryBoxState.Canceled]: <div className={'finished'}>已取消</div>,

        [EntryBoxState.UploadFail]: <div className={'finished'}>
          <div className={'fail-icon'}/>
          上传失败
        </div>,

        [EntryBoxState.QuickUploaded]: <div className={'finished'}>
          <div className={'success-icon'}/>
          秒传
        </div>,

        [EntryBoxState.Uploaded]: <div className={'finished'}>
          <div className={'success-icon'}/>
          上传成功
        </div>
      }
      map[entryBoxState]
    }

    const Operates = do {
      const showOperates = [EntryBoxState.Uploading, EntryBoxState.Paused]
        .includes(entryBoxState)

      const cPlayOrPauseButtonState = ({
        [PauseOrPlayButtonState.Play]: 'pause',
        [PauseOrPlayButtonState.Paused]: 'play',
        [PauseOrPlayButtonState.PausingOrStarting]: 'pausing-or-starting'
      })[pauseButtonState]

      const cCancelling = cancelButtonState === CancelButtonState.Cancelling
        ? 'closing' : ''

      if (showOperates) {
        <div className={'operates'}>
          <div
            className={`play-pause-button ${cPlayOrPauseButtonState}`}
            onClick={this.pauseOrStartUpload}
          />
          <div className={`-close ${cCancelling}`} onClick={this.cancelUpload}/>
        </div>
      } else {
        <div className={'operates'} />
      }
    }

    const fileName = node.name.substring(0, node.name.length - 4)

    return <div className={'upload-box-bar'} key={node.id + node.name}>
      <span className={'file-name'}>{fileName}</span>
      <span className={'file-size'}>{node.size}</span>
      <div className={'upload-state'}>{UploadState}</div>
      {Operates}
    </div>
  }

  registerOnComponentWillUnmount (callback) {
    const callbacks = this.callbacks || (this.callbacks = [])
    callbacks.push(callback)
  }

  componentWillUnmount () {
    this.callbacks.forEach(cb => cb())
  }
}

const showUploadBox = (uploaders) => {
  showDialog((props) => <div className={'upload-box'} onClick={e => e.stopPropagation()}>
    <div className={'-title'}>
      大文件上传列表
      <div className={'-close'} onClick={props.onClose}/>
    </div>
    {uploaders.map(uploader =>
      <UploadBoxBar uploader={uploader} key={uploader.node.name + uploader.node.id}/>)}
  </div>, 1001)
}

export const showEntryBox = once(() => {
  const dom = document.createElement("div");
  document.body.appendChild(dom);

  render(
    <EntryBox/>,
    dom
  );
})

export function pushUploaderToEntryBox (uploader) {
  singleEntryBoxInstance.pushUploader(uploader)
}

import React from "react";
import reactAutoBinding from "../util/react-auto-binding";
import './FileBar.pcss';
import { showConfirmBox } from "./common/Dialog"
import { InputTree } from "./InputTree"
import {current} from "../modules/current"

export class FileBar extends React.Component {
  /** @param props {{fileInfo}} */
  constructor(props) {
    super(props)

    this.state = {
      fileNameEditable: false,
      fileNameEditing: props.fileInfo.name,
      showMore: false
    }

    reactAutoBinding(this)
  }

  /**
   * 移动文件
   */
  moveOrCopyFile (type) { return async () => {
    const map = {
      move: '移动',
      copy: '复制'
    }
    try {
      const toFolder = await showConfirmBox({
        title: `${map[type]}文件至`,
        Component: function (props) {
          return <InputTree tree={current.fileSystem}
                            currentFolder={current.folder}
                            onInput={props.onInput}/>
        },
        type: 'render',
      })
      this.props.events.moveOrCopy(toFolder, type)
    } catch (e) {
      if (e === 'canceled') {
        console.log('用户取消了操作')
        return
      }
      console.error(e)
    }
  }}

  async downloadFile () {
    this.props.events.downloadFile()
  }

  handleShowMore ()  {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  handleRename () {
    this.setState({
      fileNameEditable: true
    })
  }

  render() {
    const {fileInfo, events, children, version, ...others} = this.props
    const {showMore} = this.state

    const draggable = !fileInfo._isFolder && !fileInfo._isVirtual && !fileInfo._onUpload
    const cnIsFile = fileInfo._isFolder || fileInfo._isVirtual ? '' : 'is-file'
    const cnShow = showMore ? '-show' : ''
    const cnDraggable = draggable ? 'draggable' : ''

    const IconFileType = <i className={`icon icon-file-type-others icon-file-type-${fileInfo._type}`} />

    const IconDownLoad = !fileInfo._isVirtual
      ? <div className={'icon-font-xiazai icon'} title={'点此下载'}
             onClick={this.downloadFile} />
      : <div className={'icon-font-xiazai icon'}
           style={{color: 'transparent'}}
           title={'暂不支持下载'}/>

    const IconRemove = <div className={'icon-font-dustbin_icon icon'} title={'点此删除'}
                            onClick={events.remove} />

    const _PopBox = <div className={'pop-box'}>
      {fileInfo._isFolder || <div onClick={this.moveOrCopyFile('copy')}>复制</div>}
      <div onClick={this.moveOrCopyFile('move')}>移动</div>
      {fileInfo._isRelFile && <div onClick={events.share}>分享</div>}
      <div onClick={this.handleRename}>重命名</div>
    </div>

    const _ShowMore = <div className={'event-mask'} onClick={this.handleShowMore}/>

    const IconShowMore = <div className={`icon-font-gengduo more-icon icon ${cnShow}`}
                              title={'更多'}
                              onClick={this.handleShowMore}>
      {_PopBox}
      {showMore && _ShowMore}
    </div>

    /**
     * render
     */
    return (<div className={`file-bar ${cnIsFile} ${cnDraggable}`}
                 {...others} >
      <div className={'main'}>
        {IconFileType}
        {this.getJSXFileName()}
        {children}
        <span className={'auto-grow'} />
      </div>
      <div className={'info'}>
        <span className={'item'}>{fileInfo.size}</span>
        <span className={'item'}>{fileInfo.updateUserName}</span>
        <span className={'item'}>{fileInfo.updateTime}</span>
        <span className={'auto-grow'} />
      </div>
      {fileInfo._isVirtual || <div className={'operators'} style={
        {opacity: fileInfo._onUpload ? 0 : 'unset'}}>
        {IconDownLoad}
        {IconRemove}
        {IconShowMore}
      </div>}
    </div>)
  }

  /**
   * JSX 文件名，以及文件名修改
   */
  getJSXFileName () {
    const {fileInfo, events} = this.props
    const {fileNameEditable, fileNameEditing} = this.state;

    const cnCanNotDownload = fileInfo._onUpload ? 'can-not-download' : ''

    /**
     * 文件名修改
     */
    const fileNameEditEnsure = () => {
      this.setState({fileNameEditable: false})
      if (fileNameEditing !== fileInfo.name) {
        events.rename(fileNameEditing)
      }
    };
    const fileNameEditCancel = () => {
      this.setState({
        fileNameEditable: false,
        fileNameEditing: fileInfo.name
      });
    };
    return fileNameEditable
      ? <div className={'name'}>
        <div className={'name-on-edit'}>
          <div className={'content'}>
            <input value={fileNameEditing} className={'editor'} autoFocus={true}
                   onKeyUp={this.onEnter(fileNameEditEnsure)}
                   onChange={e => this.setState({fileNameEditing: e.target.value})}/>
            <div className={'button-ensure'} onClick={fileNameEditEnsure}>确认</div>
            <div className={'button-cancel'} onClick={fileNameEditCancel}>取消</div>
          </div>
        </div>
        <div className={'event-mask'} onClick={fileNameEditCancel} />
      </div>
      : <div className={`name ${cnCanNotDownload}`} title={fileInfo.name}
             onClick={events.show}>{fileInfo.name}</div>
  }

  shouldComponentUpdate (nextProps, nextState, nextContent) {
    if (nextState !== this.state) {
      return true
    }
    if (nextProps.version !== this.props.version) {
      return true
    }
    return nextProps.children !== this.props.children
  }

  onEnter (handler) { return (e) => {
    if (e.keyCode === 13) {
      handler()
    }
  }}
}

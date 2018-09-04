import React from 'react'
import './OperateButtonsInTitle.pcss'
import { showConfirmBox } from "./common/Dialog"
import reactAutoBinding from "../util/react-auto-binding"
import {FileType} from "../modules/file-system/Node"
import {LightButton} from "./common/LightButton"

export class OperateButtonsInTitle extends React.Component {
  constructor (props) {
    super(props)

    reactAutoBinding(this)

    this.state = {
      createBtn: {
        active: false
      }
    }
  }

  createFile (type) {return async (e) => {
    e.stopPropagation()
    const {events} = this.props

    const map = {
      [FileType.Folder]: '文件夹',
      [FileType.Mind]: '脑图',
      [FileType.Doc]: '文档',
    }
    const typeName = map[type]

    // 添加文件名后缀
    const fileNameFixer = fileName => {
      if (type === 'folder') {
        return fileName
      }
      if (!fileName.endsWith(`.${typeName}`)) {
        return `${fileName}.${typeName}`
      }
      return fileName
    }

    try {
      const fileName = await showConfirmBox({
        title: `新建${typeName}`,
        type: 'input',
        placeholder: `输入${typeName}名称`
      })
      events.create(type, fileNameFixer(fileName))
    } catch (e) {
      if (e === 'canceled') {
        console.log('用户取消了操作')
        return
      }
      console.error(e)
    }
  }}

  handleFileInputChange (e) {
    this.props.events.upload(e.target.files);
    e.target.value = ''
  }

  activePopBox(button) {return () => {
    button.active = !button.active
    setTimeout(() => {
      this.setState({})
    }, 200)
    return this
  }}

  render () {
    const {createBtn} = this.state
    return (
      <div className={'operate-buttons-in-title'}>
        <LightButton className={`create-button ${createBtn.active ? 'active' : ''}`}
                     onClick={this.activePopBox(this.state.createBtn)}>
          新建
          <div className={'pop-box'}>
            <div onClick={(e) => this.activePopBox(this.state.createBtn)()
              .createFile(FileType.Folder)(e)}>文件夹</div>
            <div onClick={(e) => this.activePopBox(this.state.createBtn)()
              .createFile(FileType.Mind)(e)}>脑图</div>
            <div onClick={(e) => this.activePopBox(this.state.createBtn)()
              .createFile(FileType.Doc)(e)}>文档</div>
          </div>
        </LightButton>

        <div className={'upload-button relative'}>
          <span style={{pointerEvents: 'none'}}>上传</span>
          <input type={'file'} className={'input-file'} multiple={true}
                 onChange={this.handleFileInputChange}/>
        </div>
      </div>
    )
  }

  // shouldComponentUpdate (nextProps, nextState, nextContent) {
  //   return false
  // }
}

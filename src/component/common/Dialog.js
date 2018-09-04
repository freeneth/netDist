import React from 'react'
import ReactDOM, {render, unmountComponentAtNode} from 'react-dom'
import {isObject} from "../../util/object-utils"
import './Dialog.pcss'
import { keyUpHelper } from "../../util/helper"
import reactAutoBinding from "../../util/react-auto-binding"

/**
 * 弹窗
 * @param Component
 * @param zIndex
 * code is from https://blog.csdn.net/shuzipai/article/details/78818542
 * 2018/04/13 herbluo modified
 */
export default function showDialog (Component, zIndex = 999) {
  const close = () => {
    unmountComponentAtNode(dom);
    document.body.removeChild(dom);
  }
  const maskClick = () => {
    process.env.NODE_ENV !== 'production' && close()
  }
  const dom = document.createElement("div");
  document.body.appendChild(dom);

  const style = {
    zIndex: zIndex + '',
  };

  class EventMask extends React.Component {
    render () {
      return (<div className={'-dialog -event-mask'} onClick={maskClick} style={style}>
          {isObject(Component) ? Component : <Component onClose={close} />}
      </div>)
    }
  }

  render(
    <EventMask/>,
    dom
  );
}

/**
 * 创建一个默认的确认框
 * @param title 标题
 * @param type {'text' | 'input' | 'render'}
 * @param content 内容，运行\n换行
 * @param placeholder
 * @param component
 * @param canceled 是否需要取消按钮 默认：是
 * @param beforeClose 点击确认按钮后，关闭窗口前调用的方法，
 *                     返回结果可以是一个 promise，代表何时关闭窗口
 *                     promise.reject 同样也会关闭窗口
 * @returns {Promise<any>}
 */
export function showConfirmBox (
  {
    title,
    type = 'text',
    content = '',
    placeholder = '请输入',
    Component,
    canceled = true,
    beforeClose = () => {},
    ensureText = '确定',
    cancelText = '取消'
  }
) {
  return new Promise(((resolve, reject) => {
    showDialog(class ConfirmBox extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          inputVal: ''
        }
      }

      render () {
        const {onClose} = this.props;
        const handleEnsure = () => {
          if (type === 'input' && this.state.inputVal === '') {
            return
          }
          resolve(this.state.inputVal)
          Promise.resolve(beforeClose())
            .then(onClose)
        }
        const handleCancel = () => {
          reject('canceled')
          onClose()
        }

        const contents = content.split('\n');

        return <div className={'-confirm-box'} onClick={e => e.stopPropagation()}>
          <div className={'-title'}>{title}</div>
          <div className={'-content'}>
            {type === 'text' && contents.map(it => <div key={it}>{it}</div>)}
            {type === 'input' && <input
              autoFocus={true}
              className={'-input'}
              value={this.state.inputVal}
              placeholder={placeholder}
              onKeyUp={keyUpHelper.onEnter(handleEnsure)}
              onChange={e => this.setState({inputVal: e.target.value})}/>}
            {type === 'render' && (isObject(Component) ? Component : <Component
              onInput={val => this.setState({inputVal: val})}/>)}
          </div>
          <div className={'-op-bar'}>
            {canceled && <button className={'-cancel-button'} onClick={handleCancel}>{cancelText}</button>}
            <button className={'-ensure-button'} onClick={handleEnsure}>{ensureText}</button>
          </div>
        </div>
      }
    })
  }))
}

/**
 * 图片预览器，本质上只是一个img
 */
class ImageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scale: true
    }
    reactAutoBinding(this)
  }

  componentWillReceiveProps () {
    this.setState({scale: true})
  }

  componentDidMount () {
    const $thisDom = ReactDOM.findDOMNode(this)
    let disX
    let disY

    const onMouseMove = (e) => {
      if (this.state.scale) {
        return
      }
      this.moved = true
      $thisDom.style.left = e.clientX - disX + 'px';
      $thisDom.style.top = e.clientY - disY + 'px';
    }

    const onMouseDown = (e) => {
      if (this.state.scale) {
        return
      }
      e.preventDefault()
      disX = e.clientX - $thisDom.offsetLeft
      disY = e.clientY - $thisDom.offsetTop
      $thisDom.addEventListener('mousemove', onMouseMove)
    }

    const onMouseUp = () => {
      if (this.state.scale) {
        return
      }
      $thisDom.removeEventListener('mousemove', onMouseMove)
    }

    $thisDom.addEventListener('mousedown', onMouseDown)
    $thisDom.addEventListener('mouseup', onMouseUp)
    $thisDom.addEventListener('mouseleave', onMouseUp)
  }

  render () {
    const {content} = this.props
    const {scale} = this.state

    return <img className={`-preview-box-img ${scale ? '-scale' : '-original'}`}
                src={content}
                onClick={() => this.setState({scale: false})} />
    }
}

/**
 *
 * @param title 标题 #titles <br/>
 * @param contents 内容 <br/>
 * @param titles <br/>
 * @param Component 预览器，默认为图片预览器 #ImageContainer <br/>
 * @param payload 无用 <br/>
 * @returns {Promise<any>}
 */
export function showPreviewBox (
  {
    title,
    contents = [], // 图片地址
    titles = new Array(contents.length).fill(title),
    Component = ImageContainer,
    payload
  }
) {
  return new Promise(((resolve) => {
    showDialog(class ConfirmBox extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          oldIndex: 0,
          index: 0,
          contentBgc: '#ededed'
        }
        reactAutoBinding(this)
      }

      setIndex (index) {
        this.setState({
          oldIndex: this.state.index,
          index
        })
      }

      backward () {
        let index = this.state.index
        index = (index || contents.length) - 1
        this.setIndex(index)
      }

      forward () {
        let index = this.state.index
        if (index >= contents.length - 1) {
          index = 0
        } else {
          index ++
        }
        this.setIndex(index)
      }

      render () {
        const {index, contentBgc} = this.state
        const {onClose} = this.props

        return <div className={'-confirm-box -preview-box'} onClick={e => e.stopPropagation()}>
          <div className={'-title'}>
            {titles[index]}
            <div className={'-close'} onClick={() => {onClose(); resolve()}}/>
          </div>
          <div className={'-content'} style={{backgroundColor: contentBgc}}>
            <div className={'-button -backward'} onClick={this.backward}>
              <i className={'-arrow'} />
            </div>
            <div className={'-component-box'}>
              {<Component content={contents[index]} payload={payload[index]}/>}
            </div>
            <div className={'-button -forward'} onClick={this.forward}>
              <i className={'-arrow'} />
            </div>
          </div>
        </div>
      }
    }, 99999)
  }))
}

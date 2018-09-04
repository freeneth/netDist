import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {NetDisk} from "./NetDisk"

import './common/icon-font/iconfont.css'
import './index.pcss'
import {initApi} from "./api/ldbnAdapter"
import { initUtils } from "./util/angular-bridge"
import {initRouter} from "./my-router"
import {Base64IconStyles} from "./component/common/Base64IconStyles"

export {setOnFullScreenChange} from "./util/angular-bridge"

let _element
export default function initPage(element, config) {
  initApi(config.api);
  initUtils(config);
  initRouter(config.router)
  _element = element
  render(<div>
    {Base64IconStyles}
    <NetDisk/>
  </div>, element);
}

export function destroyPage(element) {
  unmountComponentAtNode(element)
}

export function getRootElement() {
  return _element
}

export function initSharePage (element, config) {

}

export function destroySharePage (element) {

}

import React from 'react';
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom';
import JsZip from 'jszip';
import _curry from 'lodash/curry';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function reactAutoBinding(that) {
  const _Object$getOwnPropert = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(that)),
        {
    constructor,
    componentWillMount,
    UNSAFE_componentWillMount,
    render: render$$1,
    componentDidMount,
    componentWillReceiveProps,
    UNSAFE_componentWillReceiveProps,
    shouldComponentUpdate,
    componentWillUpdate,
    UNSAFE_componentWillUpdate,
    getSnapshotBeforeUpdate,
    componentDidUpdate,
    componentWillUnmount,
    componentDidCatch
  } = _Object$getOwnPropert,
        methods = _objectWithoutProperties(_Object$getOwnPropert, ["constructor", "componentWillMount", "UNSAFE_componentWillMount", "render", "componentDidMount", "componentWillReceiveProps", "UNSAFE_componentWillReceiveProps", "shouldComponentUpdate", "componentWillUpdate", "UNSAFE_componentWillUpdate", "getSnapshotBeforeUpdate", "componentDidUpdate", "componentWillUnmount", "componentDidCatch"]);

  Object.keys(methods).forEach(key => {
    that[key] = that[key].bind(that);
  });
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "@-webkit-keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n@keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes file-bar-show {\r\n  0%   {\r\n    opacity: 0;\r\n  }\r\n  100% {\r\n    opacity: 100;\r\n  }\r\n}\r\n\r\n@keyframes file-bar-show {\r\n  0%   {\r\n    opacity: 0;\r\n  }\r\n  100% {\r\n    opacity: 100;\r\n  }\r\n}\r\n\r\n.file-bar {\r\n\r\n  display: -webkit-box;\r\n\r\n  display: -ms-flexbox;\r\n\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  height: 72px;\r\n  font-size: 14px;\r\n  min-width: 500px;\r\n}\r\n\r\n.file-bar.is-file {\r\n    -webkit-animation: file-bar-show .5s ease-in-out;\r\n            animation: file-bar-show .5s ease-in-out;\r\n  }\r\n\r\n.file-bar.draggable {\r\n    cursor: move;\r\n  }\r\n\r\n.file-bar .main {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-flex: 4;\r\n        -ms-flex: 4 2 auto;\r\n            flex: 4 2 auto;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    min-width: 188px;\r\n  }\r\n\r\n.file-bar .main .icon {\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      width: 44px;\r\n      height: 44px;\r\n      margin: 0 22px;\r\n      -webkit-box-flex: 0;\r\n          -ms-flex: none;\r\n              flex: none;\r\n      background-size: 44px;\r\n    }\r\n\r\n.file-bar .main .name {\r\n      display: block;\r\n      width: 380px;\r\n      margin-right: 18px;\r\n      overflow: hidden;\r\n      text-overflow: ellipsis;\r\n      white-space: nowrap;\r\n      cursor: pointer;\r\n      -webkit-user-select: none;\r\n         -moz-user-select: none;\r\n          -ms-user-select: none;\r\n              user-select: none;\r\n    }\r\n\r\n.file-bar .main .name:hover {\r\n        text-decoration: underline;\r\n      }\r\n\r\n.file-bar .main .name.can-not-download {\r\n        cursor: unset;\r\n      }\r\n\r\n.file-bar .main .name.can-not-download:hover {\r\n          text-decoration: none;\r\n        }\r\n\r\n.file-bar .main .name-on-edit {\r\n      position: absolute;\r\n    }\r\n\r\n.file-bar .main .name-on-edit .content {\r\n        position: absolute;\r\n        top: -14px;\r\n        height: 28px;\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        -webkit-box-sizing: border-box;\r\n                box-sizing: border-box;\r\n        z-index: 99;\r\n      }\r\n\r\n.file-bar .main .name-on-edit .content .editor {\r\n          width: 420px;\r\n          padding-left: 6px;\r\n          font-size: 14px;\r\n        }\r\n\r\n.file-bar .main .name-on-edit .content .button-ensure, .file-bar .main .name-on-edit .content .button-cancel {\r\n          width: 66px;\r\n          height: 28px;\r\n          margin-left: 12px;\r\n          border-radius: 14px;\r\n\r\n          cursor: pointer;\r\n          -webkit-user-select: none;\r\n             -moz-user-select: none;\r\n              -ms-user-select: none;\r\n                  user-select: none;\r\n          text-align: center;\r\n          line-height: 28px;\r\n          font-size: 14px;\r\n        }\r\n\r\n.file-bar .main .name-on-edit .content .button-ensure {\r\n          background-color: #00a0e9;\r\n          color: white;\r\n        }\r\n\r\n.file-bar .main .name-on-edit .content .button-cancel {\r\n          color: #656565;\r\n        }\r\n\r\n.file-bar .info {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-flex: 10;\r\n        -ms-flex: 10;\r\n            flex: 10;\r\n  }\r\n\r\n.file-bar .info .item {\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      -webkit-box-flex: 1;\r\n          -ms-flex: 1;\r\n              flex: 1;\r\n      min-width: 82px;\r\n      -webkit-box-pack: center;\r\n          -ms-flex-pack: center;\r\n              justify-content: center\r\n    }\r\n\r\n.file-bar .operators {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-flex: 4;\r\n        -ms-flex: 4;\r\n            flex: 4;\r\n  }\r\n\r\n.file-bar .operators .icon {\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      min-width: 32px;\r\n      -webkit-box-flex: 1;\r\n          -ms-flex: 1;\r\n              flex: 1;\r\n      color: #00a0e9;\r\n      font-size: 18px;\r\n      cursor: pointer\r\n    }\r\n\r\n.file-bar .auto-grow {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\r\n    min-width: 12px\r\n  }\r\n\r\n.file-bar .more-icon {\r\n    position: relative;\r\n  }\r\n\r\n.file-bar .more-icon.-show .pop-box {\r\n      opacity: 100;\r\n      width: 108px;\r\n      pointer-events: auto;\r\n    }\r\n\r\n.file-bar .more-icon .pop-box {\r\n      position: absolute;\r\n      right: 8px;\r\n      top: 16px;\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      width: 92px;\r\n      min-height: 120px;\r\n      -webkit-box-orient: vertical;\r\n      -webkit-box-direction: normal;\r\n          -ms-flex-direction: column;\r\n              flex-direction: column;\r\n\r\n      -webkit-box-shadow: 0 0 20px #888888;\r\n\r\n              box-shadow: 0 0 20px #888888;\r\n      z-index: 8;\r\n      background-color: white;\r\n      -webkit-transition: opacity .25s cubic-bezier(.71,-.46,.29,1.46), width .25s cubic-bezier(.71,-.46,.29,1.46);\r\n      transition: opacity .25s cubic-bezier(.71,-.46,.29,1.46), width .25s cubic-bezier(.71,-.46,.29,1.46);\r\n      opacity: 0;\r\n      pointer-events: none;\r\n    }\r\n\r\n.file-bar .more-icon .pop-box div {\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        height: 46px;\r\n        -webkit-box-flex: 1;\r\n            -ms-flex: 1;\r\n                flex: 1;\r\n        -webkit-box-pack: center;\r\n            -ms-flex-pack: center;\r\n                justify-content: center;\r\n        -webkit-box-align: center;\r\n            -ms-flex-align: center;\r\n                align-items: center;\r\n        color: #323232;\r\n        background-color: white;\r\n\r\n        -webkit-transition: background-color .15s ease-in-out;\r\n\r\n        transition: background-color .15s ease-in-out;\r\n      }\r\n\r\n.file-bar .more-icon .pop-box div:hover {\r\n          background-color: #9adfff;\r\n        }\r\n\r\n.file-bar .event-mask {\r\n    background-color: transparent;\r\n    // background-color: '#ddd';\r\n    position: fixed;\r\n    left: 0;\r\n    right: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n    z-index: 7\r\n  }\r\n";
styleInject(css);

/**
 * 低副作用的混入
 * 该函数会将第二个参数混入第一个参数，且JSON.stringify 时不会序列化第二个参数
 *
 * 例子：
 * o1 = {a: 'ok'}
 * o2 = {b: 'm'}
 * lowSideEffectMerge(o1, o2)
 *
 * o1.b === 'm'                        // it's true
 * JSON.stringify(o1) === '{"a":"ok"}' // it's true
 *
 */

function isObject(val) {
  return val.toString() === '[object Object]';
}
function isArray(val) {
  return val instanceof Array;
}
function arrayRemove(arr, it, comparator = (a, b) => a === b) {
  const index = arr.findIndex(a => comparator(a, it));
  arr.splice(index, 1);
  return arr;
}

var css$2 = "@-webkit-keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n@keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n.-dialog.-event-mask {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  right: 0;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  background-color: rgba(0, 0, 0, .5);\r\n}\r\n\r\n@-webkit-keyframes confirm-box-show {\r\n  0% {\r\n    opacity: 0;\r\n    -webkit-transform: translateY(30px) translateZ(0);\r\n            transform: translateY(30px) translateZ(0);\r\n  }\r\n  100% {\r\n    opacity: 100;\r\n    -webkit-transform: translateY(0) translateZ(0);\r\n            transform: translateY(0) translateZ(0);\r\n  }\r\n}\r\n\r\n@keyframes confirm-box-show {\r\n  0% {\r\n    opacity: 0;\r\n    -webkit-transform: translateY(30px) translateZ(0);\r\n            transform: translateY(30px) translateZ(0);\r\n  }\r\n  100% {\r\n    opacity: 100;\r\n    -webkit-transform: translateY(0) translateZ(0);\r\n            transform: translateY(0) translateZ(0);\r\n  }\r\n}\r\n\r\n.-dialog .-confirm-box {\r\n\r\n  display: -webkit-box;\r\n\r\n  display: -ms-flexbox;\r\n\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  width: 430px;\r\n  border-radius: 4px;\r\n  background-color: rgb(247, 247, 247);\r\n  color: #323232;\r\n  -webkit-box-shadow: 0 0 20px #888888;\r\n          box-shadow: 0 0 20px #888888;\r\n  -webkit-animation: confirm-box-show .35s cubic-bezier(.71,-.46,.29,1.46);\r\n          animation: confirm-box-show .35s cubic-bezier(.71,-.46,.29,1.46);\r\n}\r\n\r\n.-dialog .-confirm-box .-title {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    border-radius: 4px 4px 0 0;\r\n    height: 40px;\r\n    color: #333333;\r\n    font-weight: 600;\r\n    background-color: #FFF;\r\n  }\r\n\r\n.-dialog .-confirm-box .-close {\r\n    width: 40px;\r\n    height: 40px;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    cursor: pointer;\r\n  }\r\n\r\n.-dialog .-confirm-box .-close:before, .-dialog .-confirm-box .-close:after {\r\n      content: '';\r\n      position: absolute;\r\n      top: 50%;\r\n      width: 26px;\r\n      height: 2px;\r\n      background-color: gray;\r\n      -webkit-transform: rotate(45deg);\r\n      transform: rotate(45deg);\r\n    }\r\n\r\n.-dialog .-confirm-box .-close:after {\r\n      -webkit-transform: rotate(-45deg);\r\n      transform: rotate(-45deg);\r\n    }\r\n\r\n.-dialog .-confirm-box .-content {\r\n    padding: 42px 0 13px 0;\r\n    font-size: 16px;\r\n    text-align: center;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n  }\r\n\r\n.-dialog .-confirm-box .-content .-input {\r\n      width: 360px;\r\n      height: 40px;\r\n      outline: none;\r\n      padding-left: 15px;\r\n      border: 1px solid #dddee1;\r\n      background-color: rgb(247, 247, 247);\r\n    }\r\n\r\n.-dialog .-confirm-box .-content .-input:hover, .-dialog .-confirm-box .-content .-input:focus {\r\n        border-color: #57a3f3;\r\n        -webkit-transition: border .2s ease-in-out, -webkit-box-shadow .2s ease-in-out;\r\n        transition: border .2s ease-in-out, -webkit-box-shadow .2s ease-in-out;\r\n        transition: border .2s ease-in-out, box-shadow .2s ease-in-out;\r\n        transition: border .2s ease-in-out, box-shadow .2s ease-in-out, -webkit-box-shadow .2s ease-in-out\r\n      }\r\n\r\n.-dialog .-confirm-box .-content .-input:focus {\r\n        outline: 0;\r\n        -webkit-box-shadow: 0 0 0 1px rgba(45, 140, 240, .2);\r\n                box-shadow: 0 0 0 1px rgba(45, 140, 240, .2);\r\n      }\r\n\r\n.-dialog .-confirm-box .-op-bar {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    margin: 18px 0;\r\n  }\r\n\r\n.-dialog .-confirm-box .-ensure-button, .-dialog .-confirm-box .-cancel-button {\r\n    width: 183px;\r\n    height: 38px;\r\n\r\n    text-align: center;\r\n    line-height: 32px;\r\n    border-radius: 2px;\r\n    font-size: 14px;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    cursor: pointer;\r\n    border: 0;\r\n    outline: none;\r\n    -webkit-transition: background-color 0.15s cubic-bezier(.71,-.46,.29,1.46);\r\n    transition: background-color 0.15s cubic-bezier(.71,-.46,.29,1.46);\r\n  }\r\n\r\n.-dialog .-confirm-box .-ensure-button {\r\n    color: white;\r\n    background-color: #31B2ED;\r\n  }\r\n\r\n.-dialog .-confirm-box .-ensure-button:hover {\r\n      background-color: #00AFFF;\r\n    }\r\n\r\n.-dialog .-confirm-box .-cancel-button {\r\n    color: white;\r\n    margin-right: 10px;\r\n    background-color: #C2C2C2;\r\n  }\r\n\r\n.-dialog .-confirm-box .-cancel-button:hover {\r\n      background-color: #cccccc;\r\n    }\r\n\r\n.-preview-box {\r\n  position: fixed;\r\n  left: 20px;\r\n  right: 20px;\r\n  top: 20px;\r\n  bottom: 20px;\r\n\r\n  width: auto !important;\r\n  background-color: transparent !important;\r\n}\r\n\r\n.-preview-box .-title .-close {\r\n      justify-self: flex-end;\r\n    }\r\n\r\n.-preview-box .-content {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    position: relative;\r\n    padding: 0!important;\r\n  }\r\n\r\n.-preview-box .-content .-button {\r\n      -webkit-box-sizing: border-box;\r\n              box-sizing: border-box;\r\n      width: 80px;\r\n      height: 80px;\r\n      text-align: center;\r\n      line-height: 80px;\r\n      border-radius: 50%;\r\n      margin: 15px;\r\n      -webkit-box-flex: 0;\r\n          -ms-flex: none;\r\n              flex: none;\r\n      z-index: 9;\r\n\r\n      -webkit-transition: background-color .3s ease-in-out;\r\n\r\n      transition: background-color .3s ease-in-out;\r\n      cursor: pointer;\r\n      background-color: rgba(31, 45, 61, .11);\r\n    }\r\n\r\n.-preview-box .-content .-button .-arrow {\r\n\r\n        display: inline-block;\r\n        width: 22px;\r\n        height: 22px;\r\n        border-right: 3px solid #ffffff;\r\n        border-bottom: 3px solid #ffffff;\r\n\r\n        -webkit-transition: -webkit-transform .25s cubic-bezier(.71, -.46, .29, 1.46);\r\n\r\n        transition: -webkit-transform .25s cubic-bezier(.71, -.46, .29, 1.46);\r\n\r\n        transition: transform .25s cubic-bezier(.71, -.46, .29, 1.46);\r\n\r\n        transition: transform .25s cubic-bezier(.71, -.46, .29, 1.46), -webkit-transform .25s cubic-bezier(.71, -.46, .29, 1.46);\r\n        -webkit-transform: rotate(-45deg);\r\n                transform: rotate(-45deg);\r\n        -webkit-transform-origin: center;\r\n                transform-origin: center;\r\n      }\r\n\r\n.-preview-box .-content .-button:hover, .-preview-box .-content .-button:active {\r\n        background-color: rgba(31, 45, 61, .23);\r\n      }\r\n\r\n.-preview-box .-content .-button.-backward .-arrow {\r\n        -webkit-transform: rotate(135deg) translate(8%, -35%);\r\n                transform: rotate(135deg) translate(8%, -35%);\r\n      }\r\n\r\n.-preview-box .-content .-button.-forward .-arrow {\r\n        -webkit-transform: rotate(-45deg) translate(-40%, 5%);\r\n                transform: rotate(-45deg) translate(-40%, 5%);\r\n      }\r\n\r\n.-preview-box .-content .-component-box {\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      -webkit-box-pack: center;\r\n          -ms-flex-pack: center;\r\n              justify-content: center;\r\n      -webkit-box-align: center;\r\n          -ms-flex-align: center;\r\n              align-items: center;\r\n      width: calc(100vw - 276px);\r\n      height: calc(100vh - 184px);\r\n      overflow: hidden;\r\n      position: relative;\r\n    }\r\n\r\n.-preview-box-img.-scale {\r\n    max-width: calc(100vw - 276px);\r\n    max-height: calc(100vh - 184px);\r\n    cursor: -webkit-zoom-in;\r\n    cursor: zoom-in;\r\n  }\r\n\r\n.-preview-box-img.-original {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    cursor: -webkit-grab;\r\n    cursor: grab;\r\n  }\r\n\r\n.-preview-box-img.-original.grabbing {\r\n      cursor: -webkit-grabbing;\r\n      cursor: grabbing;\r\n    }\r\n\r\n";
styleInject(css$2);

const flexMixin = styles => {
  Object.values(styles).forEach(style => {
    if (typeof style !== 'object') {
      return;
    }

    if (!style.display) {
      style.display = 'flex';
    }

    flexMixin(style);
  });
  return styles;
};
const keyUpHelper = {
  onEnter(handler) {
    return e => {
      if (e.keyCode === 13) {
        handler();
      }
    };
  }

};

/**
 * 弹窗
 * @param Component
 * @param zIndex
 * code is from https://blog.csdn.net/shuzipai/article/details/78818542
 * 2018/04/13 herbluo modified
 */

function showDialog(Component, zIndex = 999) {
  const close = () => {
    unmountComponentAtNode(dom);
    document.body.removeChild(dom);
  };

  const maskClick = () => {
    
  };

  const dom = document.createElement("div");
  document.body.appendChild(dom);
  const style = {
    zIndex: zIndex + ''
  };

  class EventMask extends React.Component {
    render() {
      return React.createElement("div", {
        className: '-dialog -event-mask',
        onClick: maskClick,
        style: style
      }, isObject(Component) ? Component : React.createElement(Component, {
        onClose: close
      }));
    }

  }

  render(React.createElement(EventMask, null), dom);
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

function showConfirmBox({
  title,
  type = 'text',
  content = '',
  placeholder = '请输入',
  Component,
  canceled = true,
  beforeClose = () => {},
  ensureText = '确定',
  cancelText = '取消'
}) {
  return new Promise((resolve, reject) => {
    showDialog(class ConfirmBox extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          inputVal: ''
        };
      }

      render() {
        const {
          onClose
        } = this.props;

        const handleEnsure = () => {
          if (type === 'input' && this.state.inputVal === '') {
            return;
          }

          resolve(this.state.inputVal);
          Promise.resolve(beforeClose()).then(onClose);
        };

        const handleCancel = () => {
          reject('canceled');
          onClose();
        };

        const contents = content.split('\n');
        return React.createElement("div", {
          className: '-confirm-box',
          onClick: e => e.stopPropagation()
        }, React.createElement("div", {
          className: '-title'
        }, title), React.createElement("div", {
          className: '-content'
        }, type === 'text' && contents.map(it => React.createElement("div", {
          key: it
        }, it)), type === 'input' && React.createElement("input", {
          autoFocus: true,
          className: '-input',
          value: this.state.inputVal,
          placeholder: placeholder,
          onKeyUp: keyUpHelper.onEnter(handleEnsure),
          onChange: e => this.setState({
            inputVal: e.target.value
          })
        }), type === 'render' && (isObject(Component) ? Component : React.createElement(Component, {
          onInput: val => this.setState({
            inputVal: val
          })
        }))), React.createElement("div", {
          className: '-op-bar'
        }, canceled && React.createElement("button", {
          className: '-cancel-button',
          onClick: handleCancel
        }, cancelText), React.createElement("button", {
          className: '-ensure-button',
          onClick: handleEnsure
        }, ensureText)));
      }

    });
  });
}
/**
 * 图片预览器，本质上只是一个img
 */

class ImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: true
    };
    reactAutoBinding(this);
  }

  componentWillReceiveProps() {
    this.setState({
      scale: true
    });
  }

  componentDidMount() {
    const $thisDom = ReactDOM.findDOMNode(this);
    let disX;
    let disY;

    const onMouseMove = e => {
      if (this.state.scale) {
        return;
      }

      this.moved = true;
      $thisDom.style.left = e.clientX - disX + 'px';
      $thisDom.style.top = e.clientY - disY + 'px';
    };

    const onMouseDown = e => {
      if (this.state.scale) {
        return;
      }

      e.preventDefault();
      disX = e.clientX - $thisDom.offsetLeft;
      disY = e.clientY - $thisDom.offsetTop;
      $thisDom.addEventListener('mousemove', onMouseMove);
    };

    const onMouseUp = () => {
      if (this.state.scale) {
        return;
      }

      $thisDom.removeEventListener('mousemove', onMouseMove);
    };

    $thisDom.addEventListener('mousedown', onMouseDown);
    $thisDom.addEventListener('mouseup', onMouseUp);
    $thisDom.addEventListener('mouseleave', onMouseUp);
  }

  render() {
    const {
      content
    } = this.props;
    const {
      scale
    } = this.state;
    return React.createElement("img", {
      className: `-preview-box-img ${scale ? '-scale' : '-original'}`,
      src: content,
      onClick: () => this.setState({
        scale: false
      })
    });
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


function showPreviewBox({
  title,
  contents = [],
  // 图片地址
  titles = new Array(contents.length).fill(title),
  Component = ImageContainer,
  payload
}) {
  return new Promise(resolve => {
    showDialog(class ConfirmBox extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          oldIndex: 0,
          index: 0,
          contentBgc: '#ededed'
        };
        reactAutoBinding(this);
      }

      setIndex(index) {
        this.setState({
          oldIndex: this.state.index,
          index
        });
      }

      backward() {
        let index = this.state.index;
        index = (index || contents.length) - 1;
        this.setIndex(index);
      }

      forward() {
        let index = this.state.index;

        if (index >= contents.length - 1) {
          index = 0;
        } else {
          index++;
        }

        this.setIndex(index);
      }

      render() {
        const {
          index,
          contentBgc
        } = this.state;
        const {
          onClose
        } = this.props;
        return React.createElement("div", {
          className: '-confirm-box -preview-box',
          onClick: e => e.stopPropagation()
        }, React.createElement("div", {
          className: '-title'
        }, titles[index], React.createElement("div", {
          className: '-close',
          onClick: () => {
            onClose();
            resolve();
          }
        })), React.createElement("div", {
          className: '-content',
          style: {
            backgroundColor: contentBgc
          }
        }, React.createElement("div", {
          className: '-button -backward',
          onClick: this.backward
        }, React.createElement("i", {
          className: '-arrow'
        })), React.createElement("div", {
          className: '-component-box'
        }, React.createElement(Component, {
          content: contents[index],
          payload: payload[index]
        })), React.createElement("div", {
          className: '-button -forward',
          onClick: this.forward
        }, React.createElement("i", {
          className: '-arrow'
        }))));
      }

    }, 99999);
  });
}

var css$4 = "@-webkit-keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n@keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n.-input-tree {\r\n  position: relative;\r\n  text-align: left;\r\n  padding-left: 35px;\r\n}\r\n\r\n.-input-tree .-arrow {\r\n\r\n    display: inline-block;\r\n    width: 8px;\r\n    height: 8px;\r\n    border-right: 2px solid #00A0E9;\r\n    border-bottom: 2px solid #00A0E9;\r\n    -webkit-transition: -webkit-transform .25s cubic-bezier(.71,-.46,.29,1.46);\r\n    transition: -webkit-transform .25s cubic-bezier(.71,-.46,.29,1.46);\r\n    transition: transform .25s cubic-bezier(.71,-.46,.29,1.46);\r\n    transition: transform .25s cubic-bezier(.71,-.46,.29,1.46), -webkit-transform .25s cubic-bezier(.71,-.46,.29,1.46);\r\n    -webkit-transform: rotate(-45deg);\r\n            transform: rotate(-45deg);\r\n    -webkit-transform-origin: center;\r\n            transform-origin: center;\r\n\r\n    margin: 0 12px;\r\n  }\r\n\r\n.-input-tree .-arrow.down {\r\n      -webkit-transform: rotate(45deg) translateY(-20%);\r\n              transform: rotate(45deg) translateY(-20%);\r\n    }\r\n\r\n.-input-tree .-input {\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n    width: 360px;\r\n    height: 40px;\r\n\r\n    cursor: pointer;\r\n    background-color: #fff;\r\n    border: solid 1px #00a0e9;\r\n  }\r\n\r\n.-input-tree .-selector-arrow {\r\n    position: absolute;\r\n    right: 36px;\r\n    top: 15px;\r\n    pointer-events: none;\r\n  }\r\n\r\n.-input-tree .-event-mask {\r\n    position: fixed;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    background-color: transparent;\r\n  }\r\n\r\n.-input-tree .-pop-box {\r\n    position: absolute;\r\n    width: 360px;\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n    -webkit-transition: opacity .25s cubic-bezier(.71,-.46,.29,1.46),\r\n    max-height .25s cubic-bezier(.71,-.46,.29,1.46);\r\n    transition: opacity .25s cubic-bezier(.71,-.46,.29,1.46),\r\n    max-height .25s cubic-bezier(.71,-.46,.29,1.46);\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    max-height: 200px;\r\n\r\n    -webkit-box-shadow: 0 7px 20px #888888;\r\n\r\n            box-shadow: 0 7px 20px #888888;\r\n    background-color: white;\r\n    overflow: auto;\r\n  }\r\n\r\n.-input-tree .-pop-box.show {\r\n      opacity: 100;\r\n      max-height: 280px;\r\n      pointer-events: auto;\r\n    }\r\n\r\n.-input-tree .-pop-box .-tree-node {\r\n      height: 44px;\r\n      line-height: 44px;\r\n\r\n      cursor: pointer;\r\n    }\r\n\r\n.-input-tree .-pop-box .-tree-node:hover {\r\n        background-color: #9adfff;\r\n      }\r\n\r\n.-input-tree .tree-group {\r\n  }\r\n";
styleInject(css$4);

class InputTree extends React.Component {
  constructor(props) {
    super(props);
    props.onInput(props.currentFolder);
    this.state = {
      currentNode: props.currentFolder,
      showPopBox: false
    };
  }

  render() {
    // tree: Tree: {id: string | number, name: string, sub: Array<Tree>} | Array<Tree>
    const {
      tree,
      onInput
    } = this.props;
    const {
      currentNode,
      showPopBox
    } = this.state; // make tree

    const makeNodes = (tree, level) => {
      const handleNodeClick = node => {
        this.setState({
          currentNode: node,
          showPopBox: false
        });
        onInput(node);
      };

      return tree.map(it => it.name && React.createElement("div", {
        className: '-tree-group',
        key: it.id
      }, React.createElement("div", {
        className: '-tree-node',
        style: {
          paddingLeft: 18 * (level - 1)
        },
        onClick: () => handleNodeClick(it)
      }, React.createElement("i", {
        className: '-arrow down'
      }), it.name), it.sub && makeNodes(it.sub, level + 1)));
    };

    const Tree = makeNodes(isArray(tree) ? tree : [tree], 1);
    return React.createElement("div", {
      className: '-input-tree'
    }, React.createElement("input", {
      className: '-input',
      value: currentNode.name,
      readOnly: true,
      onClick: () => this.setState({
        showPopBox: true
      })
    }), React.createElement("i", {
      className: `-arrow -selector-arrow ${showPopBox ? 'down' : ''}`
    }), showPopBox && React.createElement("div", {
      className: '-event-mask',
      onClick: () => this.setState({
        showPopBox: false
      })
    }), React.createElement("div", {
      className: `-pop-box ${showPopBox ? 'show' : ''}`
    }, Tree));
  }

}

const current = {
  fileSystem: undefined,
  folder: undefined
};
window['current'] = current;

class FileBar extends React.Component {
  /** @param props {{fileInfo}} */
  constructor(props) {
    super(props);
    this.state = {
      fileNameEditable: false,
      fileNameEditing: props.fileInfo.name,
      showMore: false
    };
    reactAutoBinding(this);
  }
  /**
   * 移动文件
   */


  moveOrCopyFile(type) {
    return async () => {
      const map = {
        move: '移动',
        copy: '复制'
      };

      try {
        const toFolder = await showConfirmBox({
          title: `${map[type]}文件至`,
          Component: function (props) {
            return React.createElement(InputTree, {
              tree: current.fileSystem,
              currentFolder: current.folder,
              onInput: props.onInput
            });
          },
          type: 'render'
        });
        this.props.events.moveOrCopy(toFolder, type);
      } catch (e) {
        if (e === 'canceled') {
          console.log('用户取消了操作');
          return;
        }

        console.error(e);
      }
    };
  }

  async downloadFile() {
    this.props.events.downloadFile();
  }

  handleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    });
  }

  handleRename() {
    this.setState({
      fileNameEditable: true
    });
  }

  render() {
    const _this$props = this.props,
          {
      fileInfo,
      events,
      children,
      version
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["fileInfo", "events", "children", "version"]);

    const {
      showMore
    } = this.state;
    const draggable = !fileInfo._isFolder && !fileInfo._isVirtual && !fileInfo._onUpload;
    const cnIsFile = fileInfo._isFolder || fileInfo._isVirtual ? '' : 'is-file';
    const cnShow = showMore ? '-show' : '';
    const cnDraggable = draggable ? 'draggable' : '';
    const IconFileType = React.createElement("i", {
      className: `icon icon-file-type-others icon-file-type-${fileInfo._type}`
    });
    const IconDownLoad = !fileInfo._isVirtual ? React.createElement("div", {
      className: 'icon-font-xiazai icon',
      title: '点此下载',
      onClick: this.downloadFile
    }) : React.createElement("div", {
      className: 'icon-font-xiazai icon',
      style: {
        color: 'transparent'
      },
      title: '暂不支持下载'
    });
    const IconRemove = React.createElement("div", {
      className: 'icon-font-dustbin_icon icon',
      title: '点此删除',
      onClick: events.remove
    });

    const _PopBox = React.createElement("div", {
      className: 'pop-box'
    }, fileInfo._isFolder || React.createElement("div", {
      onClick: this.moveOrCopyFile('copy')
    }, "\u590D\u5236"), React.createElement("div", {
      onClick: this.moveOrCopyFile('move')
    }, "\u79FB\u52A8"), fileInfo._isRelFile && React.createElement("div", {
      onClick: events.share
    }, "\u5206\u4EAB"), React.createElement("div", {
      onClick: this.handleRename
    }, "\u91CD\u547D\u540D"));

    const _ShowMore = React.createElement("div", {
      className: 'event-mask',
      onClick: this.handleShowMore
    });

    const IconShowMore = React.createElement("div", {
      className: `icon-font-gengduo more-icon icon ${cnShow}`,
      title: '更多',
      onClick: this.handleShowMore
    }, _PopBox, showMore && _ShowMore);
    /**
     * render
     */

    return React.createElement("div", _extends({
      className: `file-bar ${cnIsFile} ${cnDraggable}`
    }, others), React.createElement("div", {
      className: 'main'
    }, IconFileType, this.getJSXFileName(), children, React.createElement("span", {
      className: 'auto-grow'
    })), React.createElement("div", {
      className: 'info'
    }, React.createElement("span", {
      className: 'item'
    }, fileInfo.size), React.createElement("span", {
      className: 'item'
    }, fileInfo.updateUserName), React.createElement("span", {
      className: 'item'
    }, fileInfo.updateTime), React.createElement("span", {
      className: 'auto-grow'
    })), fileInfo._isVirtual || React.createElement("div", {
      className: 'operators',
      style: {
        opacity: fileInfo._onUpload ? 0 : 'unset'
      }
    }, IconDownLoad, IconRemove, IconShowMore));
  }
  /**
   * JSX 文件名，以及文件名修改
   */


  getJSXFileName() {
    const {
      fileInfo,
      events
    } = this.props;
    const {
      fileNameEditable,
      fileNameEditing
    } = this.state;
    const cnCanNotDownload = fileInfo._onUpload ? 'can-not-download' : '';
    /**
     * 文件名修改
     */

    const fileNameEditEnsure = () => {
      this.setState({
        fileNameEditable: false
      });

      if (fileNameEditing !== fileInfo.name) {
        events.rename(fileNameEditing);
      }
    };

    const fileNameEditCancel = () => {
      this.setState({
        fileNameEditable: false,
        fileNameEditing: fileInfo.name
      });
    };

    return fileNameEditable ? React.createElement("div", {
      className: 'name'
    }, React.createElement("div", {
      className: 'name-on-edit'
    }, React.createElement("div", {
      className: 'content'
    }, React.createElement("input", {
      value: fileNameEditing,
      className: 'editor',
      autoFocus: true,
      onKeyUp: this.onEnter(fileNameEditEnsure),
      onChange: e => this.setState({
        fileNameEditing: e.target.value
      })
    }), React.createElement("div", {
      className: 'button-ensure',
      onClick: fileNameEditEnsure
    }, "\u786E\u8BA4"), React.createElement("div", {
      className: 'button-cancel',
      onClick: fileNameEditCancel
    }, "\u53D6\u6D88"))), React.createElement("div", {
      className: 'event-mask',
      onClick: fileNameEditCancel
    })) : React.createElement("div", {
      className: `name ${cnCanNotDownload}`,
      title: fileInfo.name,
      onClick: events.show
    }, fileInfo.name);
  }

  shouldComponentUpdate(nextProps, nextState, nextContent) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps.version !== this.props.version) {
      return true;
    }

    return nextProps.children !== this.props.children;
  }

  onEnter(handler) {
    return e => {
      if (e.keyCode === 13) {
        handler();
      }
    };
  }

}

class TitleBar extends React.Component {
  render() {
    return React.createElement("div", {
      style: styles.top
    }, React.createElement("div", {
      style: styles.file
    }, React.createElement("div", {
      style: styles.file.name
    }, "\u6587\u4EF6\u540D"), React.createElement("span", {
      style: styles.file.block
    })), React.createElement("div", {
      style: styles.info
    }, React.createElement("span", {
      style: styles.info.item
    }, "\u5927\u5C0F"), React.createElement("span", {
      style: styles.info.item
    }, "\u66F4\u65B0\u4EBA"), React.createElement("span", {
      style: styles.info.item
    }, "\u66F4\u65B0\u65F6\u95F4"), React.createElement("span", {
      style: styles.autoGrow
    })), React.createElement("div", {
      style: styles.operators
    }));
  }

}
const styles = flexMixin({
  top: {
    alignItems: 'center',
    height: 62,
    fontSize: 16,
    fontWeight: 'bold',
    userSelect: 'none'
  },
  file: {
    flex: '4 2 auto',
    minWidth: 188,
    name: {
      margin: '0 22px',
      flex: 'none'
    },
    block: {
      display: 'block',
      width: 652
    }
  },
  info: {
    flex: 10,
    item: {
      flex: 1,
      minWidth: 82,
      justifyContent: 'center'
    }
  },
  operators: {
    flex: 4,
    minWidth: 32 * 3
  },
  deepGray: {
    backgroundColor: '#dddddd'
  },
  autoGrow: {
    flex: 1,
    minWidth: 12
  }
});

var css$6 = ".operate-buttons-in-title {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n}\r\n\r\n  .operate-buttons-in-title [class*=\"-button\"] {\r\n    width: 129px;\r\n    height: 44px;\r\n    line-height: 44px;\r\n\r\n    margin-left: 42px;\r\n    border: 0;\r\n    border-radius: 4px;\r\n    background-color: #00a0e9;\r\n    color: white;\r\n    font-size: 16px;\r\n    outline: none;\r\n    cursor: pointer;\r\n    text-align: center;\r\n    -webkit-transition: background-color 0.15s cubic-bezier(.71,-.46,.29,1.46);\r\n    transition: background-color 0.15s cubic-bezier(.71,-.46,.29,1.46);\r\n  }\r\n\r\n  .operate-buttons-in-title [class*=\"-button\"]:hover {\r\n      background-color: rgb(0, 148, 217);\r\n    }\r\n\r\n  .operate-buttons-in-title .input-file {\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 129px;\r\n    height: 44px;\r\n    padding-top: 44px;\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n    opacity: 0;\r\n    cursor: pointer;\r\n  }\r\n\r\n  .operate-buttons-in-title .create-button {\r\n    position: relative;\r\n  }\r\n\r\n  .operate-buttons-in-title .create-button.active .pop-box {\r\n      opacity: 100;\r\n      pointer-events: auto;\r\n    }\r\n\r\n  .operate-buttons-in-title .create-button.active .pop-box div {\r\n        height: 42px;\r\n        line-height: 42px;\r\n      }\r\n\r\n  .operate-buttons-in-title .create-button .pop-box {\r\n      position: absolute;\r\n\r\n      color: #323232;\r\n      -webkit-box-shadow: 0 5px 20px #888888;\r\n              box-shadow: 0 5px 20px #888888;\r\n      background-color: white;\r\n      top: 44px;\r\n      left: 0;\r\n      z-index: 9;\r\n      -webkit-transition: opacity .2s cubic-bezier(.71,-.46,.29,1.46);\r\n      transition: opacity .2s cubic-bezier(.71,-.46,.29,1.46);\r\n      opacity: 0;\r\n      pointer-events: none;\r\n    }\r\n\r\n  .operate-buttons-in-title .create-button .pop-box div {\r\n        height: 32px;\r\n        line-height: 32px;\r\n        width: 129px;\r\n        background-color: white;\r\n        -webkit-transition: background-color .15s ease-in-out,\r\n        height .2s cubic-bezier(.71,-.46,.29,1.46),\r\n        line-height .2s cubic-bezier(.71,-.46,.29,1.46);\r\n        transition: background-color .15s ease-in-out,\r\n        height .2s cubic-bezier(.71,-.46,.29,1.46),\r\n        line-height .2s cubic-bezier(.71,-.46,.29,1.46);\r\n      }\r\n\r\n  .operate-buttons-in-title .create-button .pop-box div:hover {\r\n          background-color: #9adfff;\r\n        }\r\n";
styleInject(css$6);

function throttle(fn, threshhold = 250) {
  let last;
  let timer;
  return function (...args) {
    const now = +new Date();

    if (last && now < last + threshhold) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn(...args);
      }, threshhold);
    } else {
      last = now;
      fn(...args);
    }
  };
}

const unzip = a => new Array(Math.max(...a.map(b => b.length))).fill(undefined).map((_, i) => a.map(y => y[i]));
/**
 * @param arr
 * @param func
 */


function doubleMap(arr, func) {
  var _ref, _func;

  return _ref = (_func = func, arr.map(_func)), unzip(_ref);
} // https://repl.it/@shmulylotman/Lodash-Implementation-of-Groupby

const groupBy = (arr, iter) => {
  let obj = {};
  arr.forEach(elem => {
    if (typeof iter === 'function') {
      !obj.hasOwnProperty(iter(elem)) ? obj[iter(elem)] = [elem] : obj[iter(elem)].push(elem);
    } else {
      !obj.hasOwnProperty(elem[iter]) ? obj[elem[iter]] = [elem] : obj[elem[iter]].push(elem);
    }
  });
  return obj;
};
function once(func) {
  let ran;
  let result;
  return function () {
    if (ran) {
      return result;
    }

    ran = true;
    result = func.apply(this, arguments); // clear the `func` variable so the function may be garbage collected

    func = null;
    return result;
  };
}
function fromPairs(pairs) {
  let index = -1;
  const length = pairs == null ? 0 : pairs.length;
  const result = {};

  while (++index < length) {
    const pair = pairs[index];
    result[pair[0]] = pair[1];
  }

  return result;
}

var FileType;

(function (FileType) {
  FileType["Image"] = "image";
  FileType["Video"] = "video";
  FileType["Text"] = "text";
  FileType["Audio"] = "audio";
  FileType["Excel"] = "excel";
  FileType["Pdf"] = "pdf";
  FileType["Ppt"] = "ppt";
  FileType["Word"] = "word";
  FileType["Zip"] = "zip";
  FileType["File"] = "file";
  FileType["Mind"] = "mind";
  FileType["Doc"] = "doc";
  FileType["Folder"] = "folder";
  FileType["Virtual"] = "virtual";
})(FileType || (FileType = {}));

const FileTypeFileExtensionMap = {
  [FileType.Image]: ['jpg', 'png', 'bmp', 'svg', 'gif'],
  [FileType.Video]: ['mp4', 'avi', 'flv', 'mov', 'rmvb', 'rm', 'mkv', 'mpg', 'mpeg', 'm4v', 'mkv', 'webm'],
  [FileType.Text]: ['txt', 'js', 'go', 'c', 'java', 'html', 'css', 'jsx', 'ts', 'md', 'json', 'scss', 'cpp', 'json', 'cc', 'cpp'],
  [FileType.Audio]: ['mp3', 'wma', 'wav', 'ogg', 'flac'],
  [FileType.Excel]: ['xls', 'xlsx'],
  [FileType.Pdf]: ['pdf'],
  [FileType.Ppt]: ['ppt', 'pptx'],
  [FileType.Word]: ['doc', 'docx'],
  [FileType.Zip]: ['zip', '7z', 'rar', 'gz', 'tar']
};
const RelFileTypes = [FileType.Image, FileType.Video, FileType.Text, FileType.Audio, FileType.Excel, FileType.Pdf, FileType.Ppt, FileType.Word, FileType.Zip, FileType.File];
/**
 * 所有文件节点的父类
 */

class Node {
  constructor(fileSystem, node) {
    if (!fileSystem) {
      throw new Error('param of fileSystem is required.');
    }

    this.fileSystem = fileSystem;

    if (node) {
      Object.assign(this, node);
      this.onNodeLoaded();
    } else {
      this.id = Node.newId();
    }
  }

  onNodeLoaded() {
    if (this._loaded) {
      return;
    }

    this._loaded = true;
    this._isFolder = !!this['sub'];
    this._isRelFile = RelFileTypes.includes(this.type);

    this._parentNode = () => this.fileSystem.findParentNode(this);
  }

  toJSON() {
    let entries = Object.entries(this);
    entries = entries.filter(([key, value]) => {
      if (typeof value === 'function') {
        return false;
      }

      if (typeof key !== 'string' || key.startsWith('_')) {
        return false;
      }

      return !['fileSystem'].includes(key);
    });
    return fromPairs(entries);
  }

  static newId() {
    return Math.random();
  }

}

var css$8 = ".-light-btn {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  position: relative;\r\n\r\n  width: 129px;\r\n  height: 44px;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n\r\n  margin-left: 42px;\r\n  border: 0;\r\n  border-radius: 4px;\r\n  background-color: #00a0e9;\r\n  color: white;\r\n  font-size: 16px;\r\n  outline: none;\r\n  cursor: pointer;\r\n  text-align: center;\r\n  -webkit-transition: background-color 0.15s cubic-bezier(.71,-.46,.29,1.46);\r\n  transition: background-color 0.15s cubic-bezier(.71,-.46,.29,1.46);\r\n}\r\n\r\n  .-light-btn:hover {\r\n    background-color: rgb(0, 148, 217);\r\n  }\r\n\r\n  .-light-btn .light {\r\n    position: fixed;\r\n    top: 0;\r\n    visibility: hidden;\r\n    background-color: rgba(255, 255, 255, .2);\r\n    width: 18px;\r\n    height: 44px;\r\n    margin-left: -9px;\r\n    filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"filter\"><feGaussianBlur stdDeviation=\"12\" /></filter></svg>#filter');\r\n    -webkit-filter: blur(12px);\r\n            filter: blur(12px);\r\n  }";
styleInject(css$8);

class LightButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _this$props = this.props,
          {
      text,
      children,
      className
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["text", "children", "className"]);

    return React.createElement("div", _extends({
      className: `-light-btn ${className}`
    }, others, {
      ref: 'lightButton'
    }), text, children, React.createElement("div", {
      className: 'light'
    }));
  }

  componentDidMount() {
    const domLightButton = this.refs.lightButton;
    const domLight = domLightButton.querySelector('.light');
    domLightButton.addEventListener('mousemove', e => {
      domLight.style.visibility = 'visible';
      domLight.style.top = domLightButton.offsetTop + 'px';
      domLight.style.left = e.clientX + 'px';
    });
    domLightButton.addEventListener('mouseleave', e => {
      domLight.style.visibility = 'hidden';
    });
  }

}

class OperateButtonsInTitle extends React.Component {
  constructor(props) {
    super(props);
    reactAutoBinding(this);
    this.state = {
      createBtn: {
        active: false
      }
    };
  }

  createFile(type) {
    return async e => {
      e.stopPropagation();
      const {
        events
      } = this.props;
      const map = {
        [FileType.Folder]: '文件夹',
        [FileType.Mind]: '脑图',
        [FileType.Doc]: '文档'
      };
      const typeName = map[type]; // 添加文件名后缀

      const fileNameFixer = fileName => {
        if (type === 'folder') {
          return fileName;
        }

        if (!fileName.endsWith(`.${typeName}`)) {
          return `${fileName}.${typeName}`;
        }

        return fileName;
      };

      try {
        const fileName = await showConfirmBox({
          title: `新建${typeName}`,
          type: 'input',
          placeholder: `输入${typeName}名称`
        });
        events.create(type, fileNameFixer(fileName));
      } catch (e) {
        if (e === 'canceled') {
          console.log('用户取消了操作');
          return;
        }

        console.error(e);
      }
    };
  }

  handleFileInputChange(e) {
    this.props.events.upload(e.target.files);
    e.target.value = '';
  }

  activePopBox(button) {
    return () => {
      button.active = !button.active;
      setTimeout(() => {
        this.setState({});
      }, 200);
      return this;
    };
  }

  render() {
    const {
      createBtn
    } = this.state;
    return React.createElement("div", {
      className: 'operate-buttons-in-title'
    }, React.createElement(LightButton, {
      className: `create-button ${createBtn.active ? 'active' : ''}`,
      onClick: this.activePopBox(this.state.createBtn)
    }, "\u65B0\u5EFA", React.createElement("div", {
      className: 'pop-box'
    }, React.createElement("div", {
      onClick: e => this.activePopBox(this.state.createBtn)().createFile(FileType.Folder)(e)
    }, "\u6587\u4EF6\u5939"), React.createElement("div", {
      onClick: e => this.activePopBox(this.state.createBtn)().createFile(FileType.Mind)(e)
    }, "\u8111\u56FE"), React.createElement("div", {
      onClick: e => this.activePopBox(this.state.createBtn)().createFile(FileType.Doc)(e)
    }, "\u6587\u6863"))), React.createElement("div", {
      className: 'upload-button relative'
    }, React.createElement("span", {
      style: {
        pointerEvents: 'none'
      }
    }, "\u4E0A\u4F20"), React.createElement("input", {
      type: 'file',
      className: 'input-file',
      multiple: true,
      onChange: this.handleFileInputChange
    })));
  } // shouldComponentUpdate (nextProps, nextState, nextContent) {
  //   return false
  // }


}

var img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRTgxNTYwQzQ4MzIxMUU4OTBDQkQ2MjAzNUFEMTIyNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRTgxNTYwRDQ4MzIxMUU4OTBDQkQ2MjAzNUFEMTIyNiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNFODE1NjBBNDgzMjExRTg5MENCRDYyMDM1QUQxMjI2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNFODE1NjBCNDgzMjExRTg5MENCRDYyMDM1QUQxMjI2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iq3IdAAAAkZQTFRFQjpgf3uJZF52zczMOjJV+vr6+vv2xMPDWVJzWlN2WFF0V1B0+/v2+Pj4WlN3SEBoTkZuWVJ3g3+M+fn1a2Z0WFF1QDhevLq7WlN0W1R4OjNV///+PjZYW1R2U0xySkJqWVNowb/BWVJ2WVJ0paOkVk516uvk6url7u7penaBUkpxSUNc///6WFFy4eDcVE5l5ubhbGh00dDLZF92Z2NxOTBeZ2F3QThcQzpoUUlxlZKV8vPpysnIRT1kbGd6Qzphv73Bko+aOjJWeHSCmpedVlBmaWR5u7q6rKqtHxY/8O/vPDRaq6msWlVqqqmrLyZQ6enmOzNV1dTUPjZZxcTF+Pny09LQLyZOQDlWPTVW/f333d7VUUtjPzhX/Pz5/f3+gX2LWlN4QTlhS0VdSkRd/v/5bml7OjJXbWh7mZadT0dvcm5+TkhiPDRWWlVnVU50PjZcWVN1WVJ1eXV/QDlfWlJ40M/PWFNnWFJ0Vk90Z2J2TUVtRT1lS0Ns/v7+UElwQjphu7m6T0hmKB9J2tnZmpehPDRYUElpSkJpxMLDQDhf8fLq8vLuT0dwk5CUUkp0dHF7/Pz4SUJcW1ZrQTlgXVhqkI2XamV0U0xzjouPOzRWPzddPzdZRDxiZ2J0TkhgWVF1b2p1zs3NenZ+fXmFPjZbWVF3OTFT+vr1wsHEtbO3Rj9mY152g3+GWlJ3a2Z65eXgQDlc/fz9XVdq7+/pSUFpOzNWYFpsOzNYz8/OVE1wuLe3QTle+vr24ODg////WFFzAAAAsuxWRQAAAMJ0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wDSp9k2AAAB80lEQVR42mI4iAUcgANssgx41OPQxYBfPTZdDIQ1oGtiIEoHih4GojSgaGIgVgdCDwPROuB6GIjXAdPDQIIOqB5ytRw4QIoeBqw6lEUFbAtmr65fwIFFDzYtHHw1sb7OjtOy9XPlJbFqQdchkS8lsltj//790ht88rwFOdD1YGrhUJXqi9oPBVsWt60jrIVvx8z9SGChGCeGFnR31U5NRdZioD0DzRo0LZwCSZ6Z+1GAUBc+LRzLlioIGSqiamlN50LTgswrDV6rth8daDYnogYaspYK+wn7MUGIiLkgTi2VEWFYtOyXLhYrwqVFYHIPNi371edb4tKiFROAVcv+NH5cWkRn+WHVoTdJDpeWA1nJRlh0dJvMLcSpRbYjxcWmjBkZLNrpsX2PJM4QOyAhaOG/fBsLMnAKDDft59TFqYU7Z56b8RomVGCWUd6OkjKREwzXRqvQiTxsEMCzQlhYeC+Qx6MTrdCLK41xR67EHsh2/Di1zFm1v6WRHQLc9wHVBomzd4p7xVXJo2pB6OGWcdgfz8sKAbx1QC2bgDze/fvX8+PKlVwyKljdZb25GqeWXa5LEhgxgND0JiU0LQg9snINUxgwQMlWPoLlGIHikswClk4lPzlVEjkVHznVKzmVODlNBbIaJOQ0e8hqXBHThAMIMAD9r6cAEZ8nPQAAAABJRU5ErkJggg==';

var css$10 = "@-webkit-keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n@keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n.-net-disk-entry-box-self-control {\r\n  position: fixed;\r\n  left: 0;\r\n  bottom: 0;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  height: 60px;\r\n  width: 140px;\r\n  z-index: 1000;\r\n  cursor: pointer;\r\n  background-color: #aaa;\r\n  -webkit-transition: background-color .25s cubic-bezier(.71,-.46,.29,1.46);\r\n  transition: background-color .25s cubic-bezier(.71,-.46,.29,1.46);\r\n}\r\n\r\n.-net-disk-entry-box-self-control:hover {\r\n    background-color: #c1c1c1;\r\n  }\r\n\r\n.-net-disk-entry-box-self-control .-icon {\r\n    width: 50px;\r\n    height: 50px;\r\n  }\r\n\r\n.-net-disk-entry-box-self-control .-text {\r\n    margin-left: 16px;\r\n    color: #252525;\r\n    font-size: 16px;\r\n    margin-top: 4px\r\n  }\r\n\r\n.-net-disk-entry-box-self-control.big {\r\n    width: 210px;\r\n    margin-left: -210px;\r\n  }\r\n\r\n.-net-disk-entry-box-self-control .file-num-on-upload {\r\n    position: absolute;\r\n    left: 56px;\r\n    top: 5px;\r\n    width: 16px;\r\n    height: 16px;\r\n    line-height: 16px;\r\n    text-align: center;\r\n    border-radius: 50%;\r\n    color: #ffffff;\r\n    background-color: red;\r\n    font-size: 12px;\r\n  }\r\n\r\n.upload-box {\r\n\r\n  color: #424e67;\r\n  -webkit-box-shadow: 0 0 20px #888888;\r\n          box-shadow: 0 0 20px #888888;\r\n  -webkit-animation: confirm-box-show .35s cubic-bezier(.71,-.46,.29,1.46);\r\n          animation: confirm-box-show .35s cubic-bezier(.71,-.46,.29,1.46);\r\n  background-color: #fff;\r\n  padding-bottom: 30px;\r\n  border-radius: 4px;\r\n  min-height: 380px;\r\n}\r\n\r\n.upload-box .-title {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    padding-left: 10px;\r\n    height: 44px;\r\n    line-height: 44px;\r\n    font-weight: bold;\r\n    border-radius: 4px 4px 0 0;\r\n    background-color: #00a0e9;\r\n    color: #fff;\r\n  }\r\n\r\n.upload-box .-title .-close {\r\n      position: relative;\r\n      cursor: pointer;\r\n      margin-right: 10px;\r\n      width: 22px;\r\n      height: 22px;\r\n    }\r\n\r\n.upload-box .-title .-close:before, .upload-box .-title .-close:after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 47%;\r\n    width: 22px;\r\n    height: 2px;\r\n    background-color: white;\r\n    -webkit-transform: rotate(45deg);\r\n    transform: rotate(45deg);\r\n  }\r\n\r\n.upload-box .-title .-close:after {\r\n    -webkit-transform: rotate(-45deg);\r\n    transform: rotate(-45deg);\r\n  }\r\n\r\n.upload-box .-title .-close.closing {\r\n    border-radius: 50%;\r\n    border: 2px dashed white;\r\n    -webkit-animation: spin 1.5s infinite;\r\n            animation: spin 1.5s infinite;\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n  }\r\n\r\n.upload-box .-title .-close.closing:before, .upload-box .-title .-close.closing:after {\r\n      content: none;\r\n    }\r\n\r\n.upload-box .upload-box-bar {\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    height: 52px;\r\n    padding: 10px;\r\n    border-top: 1px solid #eee;\r\n    font-size: 14px;\r\n  }\r\n\r\n.upload-box .upload-box-bar:nth-last-child(1) {\r\n      border-bottom: 1px solid #eee;\r\n    }\r\n\r\n.upload-box .upload-box-bar .file-name {\r\n      width: 260px;\r\n      overflow: hidden;\r\n      text-overflow: ellipsis;\r\n      white-space: nowrap;\r\n    }\r\n\r\n.upload-box .upload-box-bar .file-size {\r\n      margin: 0 40px;\r\n    }\r\n\r\n.upload-box .upload-box-bar .upload-state {\r\n      position: relative;\r\n      width: 180px;\r\n    }\r\n\r\n.upload-box .upload-box-bar .upload-state .upload-inner {\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        -webkit-box-align: center;\r\n            -ms-flex-align: center;\r\n                align-items: center;\r\n      }\r\n\r\n.upload-box .upload-box-bar .upload-state .percent {\r\n        width: 100px;\r\n      }\r\n\r\n.upload-box .upload-box-bar .upload-state .rate {\r\n        margin-left: 8px;\r\n        font-size: 12px;\r\n      }\r\n\r\n/* 不许改，要改同 FileUploadPercent.scss 一起改 */\r\n\r\n.upload-box .upload-box-bar .upload-state .-upload-percent {\r\n        width: 100%;\r\n        height: 14px;\r\n        background-color: #ffffff;\r\n      }\r\n\r\n.upload-box .upload-box-bar .upload-state .-upload-percent .-upload-percent-inner {\r\n          background-color: #00a0e9;\r\n          height: 100%;\r\n        }\r\n\r\n.upload-box .upload-box-bar .upload-state .-upload-percent .-upload-percent-inner.error {\r\n            background-color: red;\r\n          }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished {\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        width: 180px;\r\n        -webkit-box-align: center;\r\n            -ms-flex-align: center;\r\n                align-items: center;\r\n      }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .success-icon {\r\n          position: relative;\r\n          width: 16px;\r\n          height: 16px;\r\n          border-radius: 50%;\r\n          background-color: #00a0e9;\r\n          margin-right: 10px;\r\n        }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .success-icon:after {\r\n    -webkit-box-sizing: content-box;\r\n            box-sizing: content-box;\r\n    content: \"\";\r\n    border: 1px solid white;\r\n    border-left: 0;\r\n    border-top: 0;\r\n    height: 7px;\r\n    position: absolute;\r\n    left: 6px;\r\n    top: 3px;\r\n    -webkit-transform: rotate(45deg);\r\n            transform: rotate(45deg);\r\n    -webkit-animation: check-mark-checked .5s ease-in-out;\r\n            animation: check-mark-checked .5s ease-in-out;\r\n    width: 3px;\r\n    -webkit-transition: -webkit-transform .15s cubic-bezier(.71, -.46, .88, .6) .15s;\r\n    transition: -webkit-transform .15s cubic-bezier(.71, -.46, .88, .6) .15s;\r\n    transition: transform .15s cubic-bezier(.71, -.46, .88, .6) .15s;\r\n    transition: transform .15s cubic-bezier(.71, -.46, .88, .6) .15s, -webkit-transform .15s cubic-bezier(.71, -.46, .88, .6) .15s;\r\n    -webkit-transform-origin: center;\r\n            transform-origin: center;\r\n  }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .fail-icon {\r\n          position: relative;\r\n          cursor: pointer;\r\n          width: 40px;\r\n          height: 40px;\r\n          display: -webkit-box;\r\n          display: -ms-flexbox;\r\n          display: flex;\r\n          -webkit-box-align: center;\r\n              -ms-flex-align: center;\r\n                  align-items: center;\r\n          -webkit-box-pack: center;\r\n              -ms-flex-pack: center;\r\n                  justify-content: center;\r\n          border-radius: 50%;\r\n          background-color: red;\r\n          -webkit-transform: scale(0.4);\r\n                  transform: scale(0.4);\r\n          margin-left: -12px;\r\n        }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .fail-icon:before, .upload-box .upload-box-bar .upload-state .finished .fail-icon:after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 47%;\r\n    width: 30px;\r\n    height: 3px;\r\n    background-color: white;\r\n    -webkit-transform: rotate(45deg);\r\n    transform: rotate(45deg);\r\n  }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .fail-icon:after {\r\n    -webkit-transform: rotate(-45deg);\r\n    transform: rotate(-45deg);\r\n  }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .fail-icon.closing {\r\n    border-radius: 50%;\r\n    border: 3px dashed white;\r\n    -webkit-animation: spin 1.5s infinite;\r\n            animation: spin 1.5s infinite;\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n  }\r\n\r\n.upload-box .upload-box-bar .upload-state .finished .fail-icon.closing:before, .upload-box .upload-box-bar .upload-state .finished .fail-icon.closing:after {\r\n      content: none;\r\n    }\r\n\r\n.upload-box .upload-box-bar .operates {\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      width: 48px;\r\n      -webkit-box-align: center;\r\n          -ms-flex-align: center;\r\n              align-items: center;\r\n    }\r\n\r\n.upload-box .upload-box-bar .operates .play-pause-button {\r\n        -webkit-box-sizing: border-box;\r\n                box-sizing: border-box;\r\n        height: 12px;\r\n        width: 12px;\r\n        -webkit-transition: 100ms all ease;\r\n        transition: 100ms all ease;\r\n        cursor: pointer;\r\n        border-radius: 0;\r\n        border-style: solid;\r\n        margin-left: 9px;\r\n      }\r\n\r\n.upload-box .upload-box-bar .operates .play-pause-button.play {\r\n    -webkit-transition: .25s all ease;\r\n    transition: .25s all ease;\r\n    border-color: transparent transparent transparent #777;\r\n    border-width: 6px 0 6px 10px;\r\n    -webkit-transform: translateX(1px);\r\n            transform: translateX(1px);\r\n  }\r\n\r\n.upload-box .upload-box-bar .operates .play-pause-button.pause {\r\n    border-color: transparent #777 transparent #777;\r\n    border-width: 0 3px 0 3px;\r\n    -webkit-transform: scaleX(0.8);\r\n            transform: scaleX(0.8);\r\n  }\r\n\r\n.upload-box .upload-box-bar .operates .play-pause-button.pausing-or-starting {\r\n    border-radius: 50%;\r\n    border: 2px dashed #777;\r\n    -webkit-animation: spin 1.5s infinite;\r\n            animation: spin 1.5s infinite;\r\n  }\r\n\r\n.upload-box .upload-box-bar .operates .-close {\r\n        position: relative;\r\n        cursor: pointer;\r\n        width: 17px;\r\n        height: 17px;\r\n        margin-left: 10px;\r\n      }\r\n\r\n.upload-box .upload-box-bar .operates .-close:before, .upload-box .upload-box-bar .operates .-close:after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 47%;\r\n    width: 16px;\r\n    height: 2px;\r\n    background-color: #777;\r\n    -webkit-transform: rotate(45deg);\r\n    transform: rotate(45deg);\r\n  }\r\n\r\n.upload-box .upload-box-bar .operates .-close:after {\r\n    -webkit-transform: rotate(-45deg);\r\n    transform: rotate(-45deg);\r\n  }\r\n\r\n.upload-box .upload-box-bar .operates .-close.closing {\r\n    border-radius: 50%;\r\n    border: 2px dashed #777;\r\n    -webkit-animation: spin 1.5s infinite;\r\n            animation: spin 1.5s infinite;\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\r\n  }\r\n\r\n.upload-box .upload-box-bar .operates .-close.closing:before, .upload-box .upload-box-bar .operates .-close.closing:after {\r\n      content: none;\r\n    }\r\n\r\n.upload-box .upload-box-bar .operates .-close.closing {\r\n          width: 12px;\r\n          height: 12px;\r\n        }";
styleInject(css$10);

const router = {
  initFolder: '',
  targetFolderChange: () => {},
  onRouterChange: () => {}
};
function initRouter(_router) {
  Object.assign(router, _router);
}

/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @modifier HerbLuo
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
const ERROR = 'input is invalid type';
let ARRAY_BUFFER = typeof ArrayBuffer !== 'undefined';
const HEX_CHARS = '0123456789abcdef'.split('');
const EXTRA = [-2147483648, 8388608, 32768, 128];
const SHIFT = [24, 16, 8, 0];
const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
const blocks = [];

function isArray$1(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

if (ARRAY_BUFFER && !ArrayBuffer.isView) {
  ArrayBuffer.isView = function (obj) {
    return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
  };
}

function Sha256(sharedMemory) {
  if (sharedMemory) {
    blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    this.blocks = blocks;
  } else {
    this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  this.h0 = 0x6a09e667;
  this.h1 = 0xbb67ae85;
  this.h2 = 0x3c6ef372;
  this.h3 = 0xa54ff53a;
  this.h4 = 0x510e527f;
  this.h5 = 0x9b05688c;
  this.h6 = 0x1f83d9ab;
  this.h7 = 0x5be0cd19;
  this.block = this.start = this.bytes = this.hBytes = 0;
  this.finalized = this.hashed = false;
  this.first = true;
}

Sha256.prototype.update = async function (message) {
  if (this.finalized) {
    return;
  }

  var notString,
      type = typeof message;

  if (type !== 'string') {
    if (type === 'object') {
      if (message === null) {
        throw new Error(ERROR);
      } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
        message = new Uint8Array(message);
      } else if (!isArray$1(message)) {
        if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
          throw new Error(ERROR);
        }
      }
    } else {
      throw new Error(ERROR);
    }

    notString = true;
  }

  var code,
      index = 0,
      i,
      length = message.length,
      blocks = this.blocks;

  while (index < length) {
    if (index % 1000000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    if (this.hashed) {
      this.hashed = false;
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }

    if (notString) {
      for (i = this.start; index < length && i < 64; ++index) {
        blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
      }
    } else {
      for (i = this.start; index < length && i < 64; ++index) {
        code = message.charCodeAt(index);

        if (code < 0x80) {
          blocks[i >> 2] |= code << SHIFT[i++ & 3];
        } else if (code < 0x800) {
          blocks[i >> 2] |= (0xc0 | code >> 6) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
        } else if (code < 0xd800 || code >= 0xe000) {
          blocks[i >> 2] |= (0xe0 | code >> 12) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
        } else {
          code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
          blocks[i >> 2] |= (0xf0 | code >> 18) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | code >> 12 & 0x3f) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
        }
      }
    }

    this.lastByteIndex = i;
    this.bytes += i - this.start;

    if (i >= 64) {
      this.block = blocks[16];
      this.start = i - 64;
      this.hash();
      this.hashed = true;
    } else {
      this.start = i;
    }
  }

  if (this.bytes > 4294967295) {
    this.hBytes += this.bytes / 4294967296 << 0;
    this.bytes = this.bytes % 4294967296;
  }

  return this;
};

Sha256.prototype.finalize = function () {
  if (this.finalized) {
    return;
  }

  this.finalized = true;
  const blocks = this.blocks,
        i = this.lastByteIndex;
  blocks[16] = this.block;
  blocks[i >> 2] |= EXTRA[i & 3];
  this.block = blocks[16];

  if (i >= 56) {
    if (!this.hashed) {
      this.hash();
    }

    blocks[0] = this.block;
    blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
  }

  blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
  blocks[15] = this.bytes << 3;
  this.hash();
};

Sha256.prototype.hash = function () {
  var a = this.h0,
      b = this.h1,
      c = this.h2,
      d = this.h3,
      e = this.h4,
      f = this.h5,
      g = this.h6,
      h = this.h7,
      blocks = this.blocks,
      j,
      s0,
      s1,
      maj,
      t1,
      t2,
      ch,
      ab,
      da,
      cd,
      bc;

  for (j = 16; j < 64; ++j) {
    // rightrotate
    t1 = blocks[j - 15];
    s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
    t1 = blocks[j - 2];
    s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
    blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
  }

  bc = b & c;

  for (j = 0; j < 64; j += 4) {
    if (this.first) {
      ab = 704751109;
      t1 = blocks[0] - 210244248;
      h = t1 - 1521486534 << 0;
      d = t1 + 143694565 << 0;
      this.first = false;
    } else {
      s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
      s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
      ab = a & b;
      maj = ab ^ a & c ^ bc;
      ch = e & f ^ ~e & g;
      t1 = h + s1 + ch + K[j] + blocks[j];
      t2 = s0 + maj;
      h = d + t1 << 0;
      d = t1 + t2 << 0;
    }

    s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
    s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
    da = d & a;
    maj = da ^ d & b ^ ab;
    ch = h & e ^ ~h & f;
    t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
    t2 = s0 + maj;
    g = c + t1 << 0;
    c = t1 + t2 << 0;
    s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
    s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
    cd = c & d;
    maj = cd ^ c & a ^ da;
    ch = g & h ^ ~g & e;
    t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
    t2 = s0 + maj;
    f = b + t1 << 0;
    b = t1 + t2 << 0;
    s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
    s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
    bc = b & c;
    maj = bc ^ b & d ^ cd;
    ch = f & g ^ ~f & h;
    t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
    t2 = s0 + maj;
    e = a + t1 << 0;
    a = t1 + t2 << 0;
  }

  this.h0 = this.h0 + a << 0;
  this.h1 = this.h1 + b << 0;
  this.h2 = this.h2 + c << 0;
  this.h3 = this.h3 + d << 0;
  this.h4 = this.h4 + e << 0;
  this.h5 = this.h5 + f << 0;
  this.h6 = this.h6 + g << 0;
  this.h7 = this.h7 + h << 0;
};

Sha256.prototype.hex = function () {
  this.finalize();
  var h0 = this.h0,
      h1 = this.h1,
      h2 = this.h2,
      h3 = this.h3,
      h4 = this.h4,
      h5 = this.h5,
      h6 = this.h6,
      h7 = this.h7;
  var hex = HEX_CHARS[h0 >> 28 & 0x0F] + HEX_CHARS[h0 >> 24 & 0x0F] + HEX_CHARS[h0 >> 20 & 0x0F] + HEX_CHARS[h0 >> 16 & 0x0F] + HEX_CHARS[h0 >> 12 & 0x0F] + HEX_CHARS[h0 >> 8 & 0x0F] + HEX_CHARS[h0 >> 4 & 0x0F] + HEX_CHARS[h0 & 0x0F] + HEX_CHARS[h1 >> 28 & 0x0F] + HEX_CHARS[h1 >> 24 & 0x0F] + HEX_CHARS[h1 >> 20 & 0x0F] + HEX_CHARS[h1 >> 16 & 0x0F] + HEX_CHARS[h1 >> 12 & 0x0F] + HEX_CHARS[h1 >> 8 & 0x0F] + HEX_CHARS[h1 >> 4 & 0x0F] + HEX_CHARS[h1 & 0x0F] + HEX_CHARS[h2 >> 28 & 0x0F] + HEX_CHARS[h2 >> 24 & 0x0F] + HEX_CHARS[h2 >> 20 & 0x0F] + HEX_CHARS[h2 >> 16 & 0x0F] + HEX_CHARS[h2 >> 12 & 0x0F] + HEX_CHARS[h2 >> 8 & 0x0F] + HEX_CHARS[h2 >> 4 & 0x0F] + HEX_CHARS[h2 & 0x0F] + HEX_CHARS[h3 >> 28 & 0x0F] + HEX_CHARS[h3 >> 24 & 0x0F] + HEX_CHARS[h3 >> 20 & 0x0F] + HEX_CHARS[h3 >> 16 & 0x0F] + HEX_CHARS[h3 >> 12 & 0x0F] + HEX_CHARS[h3 >> 8 & 0x0F] + HEX_CHARS[h3 >> 4 & 0x0F] + HEX_CHARS[h3 & 0x0F] + HEX_CHARS[h4 >> 28 & 0x0F] + HEX_CHARS[h4 >> 24 & 0x0F] + HEX_CHARS[h4 >> 20 & 0x0F] + HEX_CHARS[h4 >> 16 & 0x0F] + HEX_CHARS[h4 >> 12 & 0x0F] + HEX_CHARS[h4 >> 8 & 0x0F] + HEX_CHARS[h4 >> 4 & 0x0F] + HEX_CHARS[h4 & 0x0F] + HEX_CHARS[h5 >> 28 & 0x0F] + HEX_CHARS[h5 >> 24 & 0x0F] + HEX_CHARS[h5 >> 20 & 0x0F] + HEX_CHARS[h5 >> 16 & 0x0F] + HEX_CHARS[h5 >> 12 & 0x0F] + HEX_CHARS[h5 >> 8 & 0x0F] + HEX_CHARS[h5 >> 4 & 0x0F] + HEX_CHARS[h5 & 0x0F] + HEX_CHARS[h6 >> 28 & 0x0F] + HEX_CHARS[h6 >> 24 & 0x0F] + HEX_CHARS[h6 >> 20 & 0x0F] + HEX_CHARS[h6 >> 16 & 0x0F] + HEX_CHARS[h6 >> 12 & 0x0F] + HEX_CHARS[h6 >> 8 & 0x0F] + HEX_CHARS[h6 >> 4 & 0x0F] + HEX_CHARS[h6 & 0x0F];
  hex += HEX_CHARS[h7 >> 28 & 0x0F] + HEX_CHARS[h7 >> 24 & 0x0F] + HEX_CHARS[h7 >> 20 & 0x0F] + HEX_CHARS[h7 >> 16 & 0x0F] + HEX_CHARS[h7 >> 12 & 0x0F] + HEX_CHARS[h7 >> 8 & 0x0F] + HEX_CHARS[h7 >> 4 & 0x0F] + HEX_CHARS[h7 & 0x0F];
  return hex;
};

Sha256.prototype.toString = Sha256.prototype.hex;

const hash = async (typedArrayOrBlob, onCancel, getWillResolvePromise) => {
  let cancel = false;
  let callWhenCanceled;
  onCancel(() => {
    cancel = true;
    return new Promise(resolve => {
      callWhenCanceled = resolve;
    });
  });
  const sha256$$1 = new Sha256(false);

  if (typedArrayOrBlob instanceof ArrayBuffer) {
    return sha256$$1.update(typedArrayOrBlob).then(sha => (_o => {
      (_i => {
        console.log(_i);
      })(_o);

      return _o;
    })(sha.hex()));
  }

  if (typedArrayOrBlob instanceof Blob) {
    const reader = new FileReader();
    const step = 1024 * 1024 * 100; // 100M

    let sha256Promise = Promise.resolve();
    let readBlobPromise = Promise.resolve();

    const readBlob = blob => new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsArrayBuffer(blob);
    });

    const calcFragmentSha256 = (from, to) => {
      readBlobPromise = readBlobPromise.then(() => readBlob(typedArrayOrBlob.slice(from, to)).then(arrayBuffer => {
        if (cancel) {
          callWhenCanceled();
          return Promise.reject('canceled');
        }

        sha256Promise = sha256Promise.then(getWillResolvePromise).then(() => sha256$$1.update(arrayBuffer));
        return sha256Promise;
      }));

      if (to < typedArrayOrBlob.size) {
        calcFragmentSha256(to, to + step);
      }
    };

    calcFragmentSha256(0, step);
    return readBlobPromise.then(() => sha256Promise.then(that => (_o => {
      (_i => {
        console.log(_i);
      })(_o);

      return _o;
    })(that.hex()))).then(data => {
      if (cancel) {
        callWhenCanceled();
        return Promise.reject('canceled');
      }

      return data;
    }).then(getWillResolvePromise); // .then(() => {
    //   setTimeout(async () => {
    //     console.time('本次RIPEMD160时间')
    //     const hexName = await readBlob(typedArrayOrBlob)
    //       .then(arrayBuffer => new RIPEMD160()
    //         .update(toBuffer(arrayBuffer).alsoPrint())
    //         .digest('base64')
    //       )
    //     console.log(hexName)
    //     console.timeEnd('本次RIPEMD160时间')
    //   })
    // })
  }

  throw new Error('不支持的类型');
}; // function toBuffer(ab) {
//   var buf = new Buffer(ab.byteLength);
//   var view = new Uint8Array(ab);
//   for (var i = 0; i < buf.length; ++i) {
//     buf[i] = view[i];
//   }
//   return buf;
// }

const utils = {
  toast(type, msg, time, callback) {
    const map = {
      s: {
        text: 'success',
        color: '#91cbff'
      },
      w: {
        text: 'warning',
        color: 'orange'
      },
      e: {
        text: 'error',
        color: 'red'
      }
    };
    const mt = map[type];
    console.log(`${msg} %c${mt.text}`, `color:${mt.color}`);
  },

  success(msg) {
    this.toast('s', msg);
  },

  warning(msg) {
    this.toast('w', msg);
  },

  error(msg) {
    this.toast('e', msg, 2000);
  },

  isFullScreen: undefined,

  onFullScreenChange() {}

};
function initUtils(_utils) {
  Object.assign(utils, _utils);
}
function setOnFullScreenChange(onFullScreenChange) {
  utils.onFullScreenChange = onFullScreenChange;
}

/**
 * version 0.0.1
 */

function errorAndTip(message, _stack) {
  const error = new Error(_stack || message);
  error.tip = message;
  return error;
}
function shouldTip(e, notThrow) {
  if (e.tip) {
    utils.error(e.tip);
    console.error(e);
    return;
  }

  if (!notThrow) {
    throw e;
  }
}
function loge(e) {
  try {
    shouldTip(e);
  } catch (e) {
    console.error(e);
  }
}

function delay$1(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * @typedef {Object} FileApi
 * @property {Function} opentempfile
 * @property {Function} setlfiledata
 * @property {Function} temp2lfile
 * @property {Function} deletefile
 * @property {Function} getlfiledata
 */

/**
 * @typedef {Object} G
 * @property {string} currentIP
 * @property {FileApi} api
 */
const gApi = {
  openTempFile: sid => G.api.opentempfile(sid),
  setLFileData: async (sid, tempFileId, index, dataNeedSend) => {
    const _1KB = 1024;

    const _50KB = 1024 * 50;

    const _1MB = 1024 * _1KB;

    const step = _50KB * 2;
    const byteLength = dataNeedSend.byteLength;

    if (byteLength < _1MB) {
      await G.api.setlfiledata(sid, tempFileId, index, dataNeedSend);
      return;
    }

    for (let i = 0; i < byteLength; i = i + step) {
      await G.api.setlfiledata(sid, tempFileId, index + i, dataNeedSend.slice(i, i + step));
    }
  },
  temp2LFile: (sid, tempFileId) => G.api.temp2lfile(sid, tempFileId),
  deleteFile: (sid, id) => G.api.deletefile(sid, id),
  getLFileData: (sid, fileId, start = 0, step = -1) => G.api.getlfiledata(sid, fileId, start, step),
  getVar: (unKnowArg, attr) => G.api.getvar(null, attr),

  get g() {
    return G;
  }

};

class _CommonApi {
  async uploadFile(typedArray, percentCallback) {
    if (!(await _CommonApi.isSpaceEnough(typedArray.byteLength))) {
      throw errorAndTip('盒子剩余空间不足');
    }

    const tempFileId = await gApi.openTempFile(this.sid);
    await this._uploadTempFile(tempFileId, typedArray, percentCallback);
    return await gApi.temp2LFile(this.sid, tempFileId);
  }

  static async isSpaceEnough(fileSize) {
    const _1GB = 1024 * 1024 * 1024;

    const {
      free
    } = await gApi.getVar(null, 'disk');
    const freeGB = (free - fileSize) / _1GB;
    return (_o => {
      (_i => {
        console.log('剩余空间为 %oGB', _i);
      })(_o);

      return _o;
    })(freeGB) > 2;
  }

  async _uploadTempFile(tempFileId, typedArray, percentCallback, startIndex = 0) {
    const fileSize = typedArray.byteLength; // B

    const _100KB = 100 * 1024;

    const _1MB = 1024 * 1024;

    const step = (fileSize => {
      const t = fileSize / _1MB; // 几 M

      if (t < 1) {
        // 1M 以内
        return _100KB;
      } else if (t < 100) {
        // 100M 以内
        return _100KB * t;
      } else {
        return _1MB * 10;
      }
    })(fileSize);

    for (let i = 0; i < fileSize; i = i + step) {
      const dataNeedSend = typedArray.slice(i, i + step);
      await gApi.setLFileData(this.sid, tempFileId, i + startIndex, dataNeedSend);

      if (percentCallback) {
        const percent = (i + step) / fileSize * 100;
        percentCallback(percent > 100 ? 100 : percent);
      }
    }

    return tempFileId;
  }

  async uploadFileV2(file, percentCallback, onCancel, getWillResolvePromise) {
    // onCancel and getWillResolvePromise
    let cancel = false;
    let callWhenCanceled;
    onCancel(() => {
      cancel = true;
      return new Promise(resolve => {
        callWhenCanceled = resolve;
      });
    });

    const ifCancelReject = data => {
      if (cancel) {
        callWhenCanceled(tempFileId);
        return Promise.reject('canceled');
      }

      return data;
    };

    const fileSize = file.size;

    if (!(await _CommonApi.isSpaceEnough(fileSize))) {
      throw errorAndTip('盒子剩余空间不足');
    }

    const tempFileId = await gApi.openTempFile(this.sid);
    const reader = new FileReader();
    const step = 1024 * 1024 * 20; // 20M

    let readBlobPromise = Promise.resolve();
    let uploadPromise = Promise.resolve();

    const readBlob = blob => new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsArrayBuffer(blob);
    });

    const uploadFile = (from, to) => {
      const getPercent = p => {
        const fp = from / fileSize;

        const tp = function () {
          const t = to / fileSize;
          return t > 1 ? 1 : t;
        }();

        return fp * 100 + (tp - fp) * p;
      };

      readBlobPromise = readBlobPromise.then(() => readBlob(file.slice(from, to))).then(arrayBuffer => {
        if (cancel) {
          callWhenCanceled(tempFileId);
          return Promise.reject('canceled');
        }

        uploadPromise = uploadPromise.then(getWillResolvePromise).then(() => this._uploadTempFile(tempFileId, arrayBuffer, p => {
          var _ref, _p;

          return _ref = (_p = p, getPercent(_p)), percentCallback(_ref);
        }, from));
        return uploadPromise;
      });

      if (to < fileSize) {
        uploadFile(to, to + step);
      }
    };

    uploadFile(0, step);
    await readBlobPromise;
    await uploadPromise.then(ifCancelReject).then(getWillResolvePromise);
    return await gApi.temp2LFile(this.sid, tempFileId);
  }

  async deleteFile(ids) {
    if (!ids || ids.length === 0) {
      return;
    }

    if (!isArray(ids)) {
      ids = [ids];
    }

    await Promise.all(ids.map(id => gApi.deleteFile(this.sid, id)));
    return ids;
  } // 得到文件地址


  getFileUrl(fileInfo) {
    return `http://${gApi.g.currentIP}/file?id=${fileInfo.fileId}`;
  }

  getShareUrl(fileInfo) {
    // const host = window.hostParams && hostParams.host.length > 1
    //   ? hostParams.host[1]
    //   : 'api.qingkaoqin.com:33362'
    const host = gApi.g.currentIP;
    return `http://${host}/file?id=${fileInfo.fileId}&filename=${fileInfo.name}`;
  }

  getFileContent(fileId, start = 0, step = -1) {
    return gApi.getLFileData(this.sid, fileId, start, step);
  }

}

class Api extends _CommonApi {
  constructor(sid) {
    super();
    this.sid = sid;
  }
  /**
   * file sys
   */


  getFileSys() {
    return Promise.resolve(JSON.parse(localStorage.getItem('fileSystem')));
  }

  patchFileSys(fileSystem) {
    var _ref, _fileSystem;

    console.log((_ref = (_fileSystem = fileSystem, JSON.stringify(_fileSystem)), JSON.parse(_ref)));
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }
  /**
   * 文件哈希
   */


  getFileIdByHash(hash) {
    return Promise.resolve(localStorage.getItem(`fileHash:${hash}`));
  }

  postFileIdWithHash(hash, id) {
    localStorage.setItem(`fileHash:${hash}`, id);
    return Promise.resolve();
  }

  deleteFileHash(hashs) {
    if (!isArray(hashs)) {
      hashs = [hashs];
    }

    hashs.forEach(hash => localStorage.removeItem(`fileHash:${hash}`));
    return Promise.resolve();
  }
  /**
   * files
   */


  async getFileInfos(ids) {
    const _isArray = isArray(ids);

    _isArray || (ids = [ids]);
    const details = await Promise.resolve(ids.map(id => (_o => {
      (it => {
        return it === null && console.warn('未找到数据，id: ' + id);
      })(_o);

      return _o;
    })(JSON.parse(localStorage.getItem('file:' + id))) || {
      id,
      name: '损坏的文件'
    }));
    return _isArray ? details : details[0];
  }

  patchFileInfo(id, file) {
    localStorage.setItem('file:' + id, JSON.stringify(file));
  }

  postFileInfo(file) {
    file.updateTime = new Date().toLocaleDateString();
    file.updateUserName = 'Test Name';
    localStorage.setItem('file:' + file.id, JSON.stringify(file));
  }

  deleteFileInfo(ids) {
    if (!isArray(ids)) {
      ids = [ids];
    }

    ids.forEach(id => localStorage.removeItem('file:' + id));
    return Promise.resolve();
  }

  getFileUrl(fileInfo) {
    return `http://${gApi.g.currentIP}/file?id=${fileInfo.fileId}`;
  }

  getShareUrl(fileInfo) {
    // const host = window.hostParams && hostParams.host.length > 1
    //   ? hostParams.host[1]
    //   : 'api.qingkaoqin.com:33362'
    const host = G.currentIP;
    return `http://${host}/file?id=${fileInfo.fileId}&filename=${fileInfo.name}`;
  } // 后台生成文件名（文件id）的方式很特别，相同内容的文件必定相同文件名，
  // 为文件设置一份引用计数，以便在删除时考虑是否真正删除
  // 此外，稍微注意秒传功能也用到了这个


  async increaseReferenceCount(fileId) {
    const key = `fileReference:${fileId}`;
    const count = localStorage.getItem(key) | 0;
    return (_o => {
      (it => {
        return localStorage.setItem(key, it + '');
      })(_o);

      return _o;
    })(count + 1);
  }

  async decrementReferenceCount(fileId) {
    const key = `fileReference:${fileId}`;
    const count = localStorage.getItem(key) | 0;
    return (_o => {
      (_i => {
        console.log('当前文件还有 %d 个引用', _i);
      })(_o);

      return _o;
    })((_o => {
      (it => {
        return it > 0 ? localStorage.setItem(key, it + '') : localStorage.removeItem(key);
      })(_o);

      return _o;
    })(count - 1));
  } // 分割后，对业务逻辑来说，是 N个时间循环内多次调用该方法，N默认为 0 +1=1
  // 但 Http请求只发一次，同时会自动合并参数


  async getName(ids) {
    console.warn('request is sending');
    return ids.map((it, i) => it + i);
  }

}

const api = new Api(window.sid);
window.api = api;

class Api$1 extends _CommonApi {
  getTxRo() {
    return this.ldbn.txro();
  }

  getTx() {
    return this.ldbn.tx(this.sid);
  }

  async read(tableName, key, handler = () => {}) {
    const readMulti = isArray(key);
    const txro = this.getTxRo();
    const transaction = this.ldbn.hash(tableName)[readMulti ? 'getSome' : 'get'](txro, key);
    const result = await txro.commit(transaction);

    if (result === null || result === undefined) {
      return result;
    }

    return isObject(result) ? key.map(k => {
      let value = result[k];
      value = value && JSON.parse(value);
      value = handler(value, k) || value;
      return value;
    }) : JSON.parse(result);
  }

  async singleWrite(tableName, key, value) {
    const tx = this.getTx();
    const transaction = this.ldbn.hash(tableName).set(tx, key, JSON.stringify(value));
    await tx.commit(transaction);
  }

  async remove(tableName, ids) {
    const readMulti = isArray(ids);
    const tx = this.getTx();
    const transaction = this.ldbn.hash(tableName)[readMulti ? 'deleteSome' : 'delete'](tx, ids);
    await tx.commit(transaction);
  } // 读文件系统


  async getFileSys() {
    return await this.read(this.DB.NET_DISK_FILE_SYS, this.userId);
  } // 写文件系统


  async patchFileSys(fileSystem) {
    await this.singleWrite(this.DB.NET_DISK_FILE_SYS, this.userId, fileSystem);
  } // 根据文件哈希值查找文件 id


  getFileIdByHash(hash) {
    return this.read(this.DB.NET_DISK_FILE_HASH_MAP_ID, hash);
  } // 写文件哈希


  postFileIdWithHash(hash, id) {
    return this.singleWrite(this.DB.NET_DISK_FILE_HASH_MAP_ID, hash, id);
  } // 删除文件哈希 (可删多个)


  deleteFileHash(hash) {
    return this.remove(this.DB.NET_DISK_FILE_HASH_MAP_ID, hash);
  } // 读文件详情


  async getFileInfos(ids) {
    const _isArray = isArray(ids);

    _isArray || (ids = [ids]);
    const details = await this.read(this.DB.NET_DISK_FILE_DETAIL, ids, (detail, id) => {
      if (!detail) {
        console.warn('未找到数据，id: ' + id);
        detail = {
          id,
          name: '损坏的文件'
        };
      }

      return detail;
    });
    return _isArray ? details : details[0];
  } // 修改文件详情


  async patchFileInfo(id, file) {
    file.updateTime = new Date().toLocaleDateString();
    file.updateUserName = await this.getUserName();
    await this.singleWrite(this.DB.NET_DISK_FILE_DETAIL, id, file);
  } // 添加文件详情


  async postFileInfo(file) {
    file.updateTime = new Date().toLocaleDateString();
    file.updateUserName = await this.getUserName();
    await this.singleWrite(this.DB.NET_DISK_FILE_DETAIL, file.id, file);
  }

  async deleteFileInfo(ids) {
    if (!isArray(ids)) {
      ids = [ids];
    }

    await this.remove(this.DB.NET_DISK_FILE_DETAIL, ids);
  } // 后台生成文件名（文件id）的方式很特别，相同内容的文件必定相同文件名，
  // 为文件设置一份引用计数，以便在删除时考虑是否真正删除


  async increaseReferenceCount(fileId) {
    if (!fileId) {
      return 0;
    }

    const {
      NET_DISK_FILE_REFERENCE_COUNT
    } = this.DB;
    let count = (await this.read(NET_DISK_FILE_REFERENCE_COUNT, fileId)) | 0;
    count = count + 1;
    await this.singleWrite(NET_DISK_FILE_REFERENCE_COUNT, fileId, count + '');
    console.log(count);
    return count;
  }

  async decrementReferenceCount(fileId) {
    if (!fileId) {
      return 0;
    }

    const {
      NET_DISK_FILE_REFERENCE_COUNT
    } = this.DB;
    let count = (await this.read(NET_DISK_FILE_REFERENCE_COUNT, fileId)) | 0;
    count = count - 1;

    if (count > 0) {
      await this.singleWrite(NET_DISK_FILE_REFERENCE_COUNT, fileId, count + '');
    } else {
      await this.remove(NET_DISK_FILE_REFERENCE_COUNT, fileId);
    }

    console.log('当前文件还有 %d 个引用', count);
    return count;
  }

}

const api$2 = new Api$1();
function initApi(config) {
  if (!config) {
    return;
  }

  api$2.ldbn = config.ldbn;
  api$2.DB = config.DB;
  api$2.sid = config.sid;
  api$2.userId = config.userId;
  api$2.getUserName = config.getUserName;
}

const api$3 = api$2;
window.api = api$3;

class SimpleEvent {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    const {
      events
    } = this;
    const event = events[eventName] || (events[eventName] = []);
    return event.push(callback) - 1;
  }

  emit(eventName, payload) {
    const event = this.events[eventName];
    event && event.forEach(c => c(payload));
  }

  unbind(eventName, index) {
    const event = this.events[eventName];
    event.splice(index, 1);
  }

}

function applyMix(derivedConstructor, mixins) {
  for (let mixin of mixins) {
    copyProperties(derivedConstructor, mixin); // 拷贝实例属性

    copyProperties(derivedConstructor.prototype, mixin.prototype); // 拷贝原型属性
  }
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== "constructor" && key !== "prototype" && key !== "name") {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
} // export function applyMixins(derivedCtor, baseCtors) {
//   baseCtors.forEach(baseCtor => {
//     copyProperties(derivedCtor, baseCtor)
//     copyProperties(derivedCtor.prototype, baseCtor.prototype)
//   })
// }

/**
 * @property fileSystem FileSystem
 */

class CouldRemoveNode {
  async remove() {
    console.log('enter');
    const node = this;
    const {
      id
    } = node; // 先删文件系统

    this.fileSystem.deleteNodeById(id);
    await api$3.patchFileSys(current.fileSystem);
    console.log(node); // 节点 ids

    const nodeIds = function () {
      if (node._isFolder) {
        const nodeIds = [];
        node.forEach(file => {
          if (!file._isFolder && !file._isVirtual && !file.sub) {
            nodeIds.push(file.id);
          }
        });
        return nodeIds;
      } else {
        return [node.id];
      }
    }(); // 文件详情 （用于获取 fileId和 hash）


    const fileInfos = node._isFolder ? await api$3.getFileInfos(nodeIds) : [node]; // 再删文件详情

    await api$3.deleteFileInfo(nodeIds); // 该文件存在复制的情况，仅引用减一，不删文件

    const counts = await Promise.all(fileInfos.map(info => api$3.decrementReferenceCount(info.fileId))); // 生成可以删除的文件列表

    const couldDeleteFileDetails = fileInfos.filter((_, i) => counts[i] <= 0);

    if (couldDeleteFileDetails.length === 0) {
      return;
    }

    const [couldDeleteFileIds, couldDeleteNodeHashs] = doubleMap(couldDeleteFileDetails, info => [info.fileId, info.hash]);
    console.log(couldDeleteFileDetails); // 再删文件哈希

    await api$3.deleteFileHash(couldDeleteNodeHashs.filter(i => i)); // 最后删文件

    await api$3.deleteFile((_o => {
      (_i => {
        console.log('所删除的文件id为：', _i);
      })(_o);

      return _o;
    })(couldDeleteFileIds));
  }

}

class VirtualNode extends Node {
  constructor(linkNode) {
    super(linkNode.fileSystem);
    this._isVirtual = true;
    this._type = FileType.Virtual;

    if (linkNode instanceof VirtualNode) {
      this._relNode = linkNode._relNode._parentNode();
      this.name = `返回上级 （${linkNode._relNode.name}）`;
    } else {
      this._relNode = linkNode;
      this.name = `返回上级 （${linkNode.name}）`;
    }
  }

}
Promise.resolve().then(() => {
  applyMix(VirtualNode, [CouldOpenNode]);
});

class CouldOpenNode {
  /**
   * 进入某个文件夹
   */
  async open(callback) {
    const node = this instanceof VirtualNode ? this._relNode._parentNode() : this;

    if (node._opened) {
      callback(node);
      return;
    } // 非根节点添加返回上一级


    if (!node.isRoot) {
      node.sub.unshift(new VirtualNode(node));
    }

    node.initSub();
    callback(node);
    await node.loadSub();
    callback(node);
    node._opened = true;
  }

}

class CouldMoveOrCopyNode {
  async moveOrCopy(toFolder, isMove) {
    if (!(this instanceof FileNode)) {
      throw new Error('非文件节点无法复制');
    }

    if (isMove && toFolder === current.folder) {
      throw errorAndTip('文件没有移动');
    }

    if (isMove && toFolder.id === this.id) {
      throw errorAndTip(`无法完成移动：从 ${this.name} 到 ${toFolder.name}`);
    }

    let node = this;

    if (!isMove) {
      node = node.copy();
    } // this.node = node
    // 添加新节点


    await toFolder.append(this, !isMove); // 复制操作，保存新的文件信息

    if (!isMove) {
      await api$3.postFileInfo(node);
    } // 移除当前节点


    if (isMove) {
      const currentIndex = current.folder.sub.findIndex(it => it.id === node.id);
      current.folder.sub.splice(currentIndex, 1);
    } // 保存


    await api$3.patchFileSys(this.fileSystem);

    if (!isMove) {
      await api$3.increaseReferenceCount(node.fileId);
    }

    return node;
  }

}

var FileUploadPercentState;

(function (FileUploadPercentState) {
  FileUploadPercentState[FileUploadPercentState["Success"] = 0] = "Success";
  FileUploadPercentState[FileUploadPercentState["Error"] = 1] = "Error";
  FileUploadPercentState[FileUploadPercentState["Processing"] = 2] = "Processing";
})(FileUploadPercentState || (FileUploadPercentState = {}));

class HasPercentNode {
  get percent() {
    return this._percent;
  }

  get duration() {
    return this._duration;
  }

  get state() {
    return this._state;
  }

  get onTransforming() {
    return this._onTransforming;
  }

  start() {
    this._onTransforming = true;
    this._state = FileUploadPercentState.Processing;
    this._percent = 0;
    this._duration = 400;
    return this;
  }

  updatePercent({
    percent,
    duration
  }) {
    this._percent = percent;
    this._duration = duration;
    return this;
  }

  success() {
    this._duration = 200;
    this._percent = 100;
    this._state = FileUploadPercentState.Success;
    this.end();
  }

  fail() {
    this._duration = 200;
    this._percent = 100;
    this._state = FileUploadPercentState.Error;
    this.end();
  }

  end() {
    this._onTransforming = false;
  }

}

Promise.resolve().then(() => {
  applyMix(FolderNode, [CouldOpenNode, CouldRemoveNode, CouldCreateNode, CouldMoveOrCopyNode, HasPercentNode]);
});
class FolderNode extends Node {
  constructor(fileSystem, {
    id,
    name,
    sub
  }) {
    super(fileSystem);
    this.name = name;
    this.sub = sub || [];
    this._isSubLoaded = false;
    this._isSubInitialized = false;
    this._isFolder = true;
    this._type = FileType.Folder;
    id && (this.id = id);
    this.onNodeLoaded();
  }
  /**
   * 遍历当前节点下的所有内容（包括子文件夹）
   * @param callback (currentNode, parentNode, indexInFolder) => boolean
   */


  forEach(callback) {
    let endTraversal = false;
    const node = this;

    function deepTraversal(node) {
      const sub = node.sub;

      if (!sub || endTraversal) {
        return;
      }

      const length = sub.length;

      for (let i = 0; i < length; i++) {
        if (callback(sub[i], node, i) === false) {
          endTraversal = true;
          return;
        }

        deepTraversal(sub[i]);
      }
    }

    if (isArray(node)) {
      deepTraversal({
        sub: node
      });
    } else if (callback(node) !== false) {
      deepTraversal(node);
    }
  }
  /**
   * 初始化文件夹内的文件节点
   */


  initSub() {
    const {
      sub,
      _isSubInitialized
    } = this;

    if (_isSubInitialized) {
      return;
    }

    this.sub = sub.map(n => this.fileSystem.loadNode(n));
    this._isSubInitialized = true;
  }
  /**
   * 加载文件夹内的文件节点
   * @returns {Promise<void>}
   */


  async loadSub() {
    const {
      sub,
      _isSubLoaded
    } = this;

    if (_isSubLoaded) {
      return this.sub;
    } // 分离文件夹和文件


    const {
      true: files,
      undefined: folders = []
    } = groupBy(sub, node => node._isTempFile);

    if (files) {
      // 拉取文件并显示
      const fileProps = await api$3.getFileInfos(files.map(({
        id
      }) => id));
      this.sub = folders.concat(fileProps.map(fps => {
        const index = sub.findIndex(({
          id
        }) => id === fps.id);
        return sub[index].toFileNode(fps);
      }));
    }

    this._isSubLoaded = true;
    return this.sub;
  }
  /**
   * 查找当前文件夹下是否已存在该文件名
   * @param _name 文件名
   * @returns {Promise<boolean>}
   */


  async isNameExist(_name) {
    const sub = await this.loadSub();
    return sub.find(node => node['name'] === _name);
  }
  /**
   * 往该文件夹内添加文件
   * @param node 文件节点
   * @param shouldRename 是否需要自动重命名（当存在相同文件名时）
   * @returns {Promise<void>}
   */


  async append(node, shouldRename = true) {
    const sub = this.sub;
    let suffix = node.name.split('.').pop(); // 处理重复文件

    const renameExistFile = async () => {
      if (await this.isNameExist(node.name)) {
        if (!shouldRename) {
          throw errorAndTip('文件名重复');
        }

        const tA = node.name.split('.');
        tA.pop();
        node.name = `${tA.join('.')}-副本.${suffix}`;
        await renameExistFile();
      }
    };

    await renameExistFile();

    if (node instanceof FolderNode) {
      const index = sub.findIndex(n => n instanceof FileNode || n instanceof TempFileNode);
      sub.splice(index, 0, node);
    } else {
      sub.push(node);
    }
  }

  toJSON() {
    const copiedNode = super.toJSON();
    copiedNode.sub = [];
    this.sub.forEach(node => {
      if (node instanceof FolderNode) {
        copiedNode.sub.push(node.toJSON());
        return;
      }

      if (node instanceof FileNode) {
        copiedNode.sub.push({
          id: node.id
        });
        return;
      }

      if (node.constructor === Object) {
        // 未处理的数据，原样保存即可
        copiedNode.sub.push(node);
      }
    });
    return copiedNode;
  }

}

/**
 * @property _worker {toFolder: FolderNode}
 * @property fileSystem FileSystem
 */

class CouldCreateNode {
  /**
   * 新建文件夹
   */
  async create(toFolder) {
    if (this instanceof FolderNode) {
      return await this.createFolder(toFolder);
    } else if (this instanceof FileNode) {
      return await this.createFile(toFolder);
    } else {
      throw new Error('该节点类型未知，无法修改该节点');
    }
  }

  async createFolder(toFolder) {
    if (!(this instanceof FolderNode)) {
      throw new Error();
    }

    const node = this;
    await toFolder.append(node, false);

    this.applyToServer = async () => {
      await api$3.patchFileSys(node.fileSystem);
      return this;
    };

    return this;
  }
  /**
   * 创建文件 或 脑图，文档
   * {fileName, fileId, fileSize, fileType, fileHash}
   */


  async createFile(toFolder) {
    if (!(this instanceof FileNode)) {
      throw new Error();
    }

    const node = this; // 保存到 FileInfo

    await api$3.postFileInfo(node); // 追加到 FileSystem

    try {
      await toFolder.append(this, false);
    } catch (e) {
      await api$3.deleteFileInfo(node.id);
      throw e;
    }

    this.applyToServer = async () => {
      await api$3.patchFileSys(node.fileSystem);
      return this;
    };

    return this;
  }

}

class TempFileNode {
  constructor(fileSystem, id) {
    this.fileSystem = fileSystem;
    this.id = id;
    this._isTempFile = true;
  }

  toFileNode(nodeProps) {
    return new FileNode(this.fileSystem, Object.assign({}, nodeProps, {
      id: this.id
    }));
  }

}
Promise.resolve().then(() => {
  applyMix(FileNode, [CouldUploadNode, CouldRemoveNode, CouldCreateNode, CouldMoveOrCopyNode, HasPercentNode]);
});
class FileNode extends Node {
  constructor(fileSystem, {
    fileId,
    name,
    size,
    sizeNumber,
    type,
    hash,
    id,
    updateTime,
    updateUserName
  }) {
    super(fileSystem);
    this.fileId = fileId;
    this.name = name;
    this.sizeNumber = sizeNumber;
    this.size = size;
    this.type = type;
    this.updateTime = updateTime;
    this.updateUserName = updateUserName;
    this._isFile = true;
    id && (this.id = id);
    hash && (this.hash = hash);
    this.onNodeLoaded();
  }

  get _type() {
    return this.type;
  }

  set _type(val) {
    this.type = val;
  }

  copy() {
    return new FileNode(this.fileSystem, Object.assign({}, this, {
      id: undefined
    }));
  }

}

const units = ['B', 'K', 'M', 'G'];

const getSize = (_size, unitIndex) => {
  if (_size > 100) {
    return getSize(_size / 1024, unitIndex + 1);
  }

  const fixedSize = _size > 10 ? _size | 0 : _size.toFixed(1);
  return fixedSize + units[unitIndex];
};

const generateFileType = (() => {
  const eme = Object.entries(FileTypeFileExtensionMap);
  return fileName => {
    let fileType = FileType.File;
    const extension = fileName.split('.').pop();

    for (let e of eme) {
      const [key, value] = e;

      if (value.includes(extension)) {
        fileType = key;
        break;
      }
    }

    return fileType;
  };
})();

class UploadTempNode {
  constructor(tempNode, toFolder) {
    Object.assign(this, tempNode);
    this.fileSystem = toFolder.fileSystem;
    this.tempNode = tempNode;
    this.toFolder = toFolder;
    this.node = undefined;
  }

  toFileNode(fileId, hash) {
    return this.node = new FileNode(this.fileSystem, Object.assign({}, this.tempNode, {
      fileId,
      hash
    }));
  }

  increaseReferenceCount() {
    return this.node._isRelFile ? api$3.increaseReferenceCount(this.node.fileId) : Promise.resolve();
  }

}
class CouldUploadNode {
  static upload(name, sizeNumber, toFolder) {
    const tempNode = {
      name,
      size: getSize(sizeNumber, 0),
      sizeNumber,
      type: generateFileType(name)
    };
    return new UploadTempNode(tempNode, toFolder);
  }

}

const UploadEvents = {
  Initializing: 'Initializing',
  VirtualNodeGenerated: 'VirtualNodeGenerated',
  VirtualNodeRemoving: 'VirtualNodeRemoving',
  PercentUpdating: 'PercentUpdating',
  RateUpdating: 'RateUpdating',
  UploadPaused: 'UploadPaused',
  RelNodeGenerated: 'RelNodeGenerated',
  Success: 'Success',
  Fail: 'Fail'
};
const RollbackSteps = {
  Hashing: 'Hashing',
  Uploading: 'Uploading'
};

const _1M = 1024 * 1024;

const animationTimeOfHash = fileSize => {
  const t = fileSize / 18 / _1M * 1000;
  return t < 400 ? 400 : t | 0;
};

const animationTimeOfServerHash = fileSize => {
  const t = fileSize / 12 / _1M * 1000;
  return t < 400 ? 400 : t | 0;
};

class Upload {
  constructor() {
    _defineProperty(this, "pauseOrStartUpload", (() => {
      let resolve;
      return async shouldPause => {
        if (shouldPause) {
          this._pause.willResolvePromise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            this.rejectWillResolve = _reject;
          });
        } else {
          resolve();
        }

        if (shouldPause) {
          await new Promise(resolve => {
            this._pause.onPromiseGet = resolve;
          });
        }

        this._eUploadPaused(shouldPause);

        this.isPaused = shouldPause;
      };
    })());

    this.event = new SimpleEvent();
    this.percent = 0;
    this.rate = '-';
    this.animationDuration = 0;

    this.step = (_o => {
      (it => {
        return this.event.emit(it);
      })(_o);

      return _o;
    })(UploadEvents.Initializing);

    this.rollbackStep = undefined;
    this.node = undefined;
    this.areWeUseQuickUpload = false;
    this.shouldWeShowUploadPercent = false;
    this.isCanceled = false;
    this.isPaused = false;

    this.rejectWillResolve = () => {};

    this._cancel = (() => {
      const _cancel = {
        cancelCurrent: () => Promise.resolve(),
        onCancel: cancel => {
          _cancel.cancelCurrent = cancel;
        }
      };
      return _cancel;
    })();

    this._pause = (() => {
      const _pause = {
        willResolvePromise: Promise.resolve(),
        onPromiseGet: () => {},

        getWillResolvePromise(data) {
          _pause.onPromiseGet();

          return _pause.willResolvePromise.then(() => data);
        }

      };
      return _pause;
    })();
  }

  step1GenerateVirtualNode(tNode) {
    tNode._onUpload = true;
    tNode.name = tNode.name + '.tmp';
    this.node = tNode;

    this._eUpdateUploadPercent(2);

    this.shouldWeShowUploadPercent && this._eVirtualNodeGenerate(tNode);
  }

  async quickUpload(file) {
    const result = {};
    await delay$1();
    this.rollbackStep = RollbackSteps.Hashing;
    console.time('本次哈希时间为');
    result.hexHash = await hash(file, this._cancel.onCancel, this._pause.getWillResolvePromise);
    console.timeEnd('本次哈希时间为');
    result.fileId = await api$3.getFileIdByHash(result.hexHash);

    if (result.fileId) {
      this._eUpdateUploadPercent(99);

      this.areWeUseQuickUpload = true;
    }

    return result;
  }

  async normalUpload(file) {
    const fileSize = file.size; // 预估服务端哈希时间

    const estimateServerHashTime = () => {
      console.time('服务端哈希时间'); // 预估服务端哈希时间

      setTimeout(() => {
        this._eUpdateUploadPercent(99, (_o => {
          (_i => {
            console.log('服务端哈希时间预计为', _i);
          })(_o);

          return _o;
        })(animationTimeOfServerHash(fileSize)));
      });
    };

    const calcUploadRate = callback => {
      const getNow = () => new Date().getTime();

      let oldTime = getNow() - 1; // 防止 0 / 0

      let oldPercent = 0;
      return percent => {
        const newTime = getNow();
        const timeDuration = newTime - oldTime;
        const percentDuration = (percent - oldPercent) / 100;
        const rate = percentDuration * fileSize / timeDuration; // KB/s

        callback({
          percent,
          rate,
          duration: timeDuration
        });
        oldTime = newTime;
        oldPercent = percent;
      };
    };

    const getRate = rate => rate <= 1 ? '1KB/S' : rate < 10 ? `${rate.toFixed(1)}KB/S` : rate < 1000 ? `${rate | 0}KB/S` : rate < 10000 ? `${(rate / 1000).toFixed(1)}MB/S` : rate < 1000000 ? `${rate / 1000 | 0}MB/S` : `Infinity`; // 手动上传以获得 Id


    this.rollbackStep = RollbackSteps.Uploading;
    console.time('本次上传文件耗时');
    const fileId = await api$3.uploadFileV2(file, calcUploadRate(({
      percent,
      rate,
      duration
    }) => {
      percent >= 100 && estimateServerHashTime();

      this._eUpdateUploadPercent(percent * 0.82 + 12, duration);

      this._eUpdateUploadRate(getRate(rate));
    }), this._cancel.onCancel, this._pause.getWillResolvePromise).catch(shouldTip);
    console.timeEnd('服务端哈希时间');
    console.timeEnd('本次上传文件耗时');
    return fileId;
  }
  /**
   * 第二步，生成哈希和文件id
   */


  async step2GenerateFileId(tNode, file) {
    const fileSize = file.size;
    const shouldWeUseQuickUpload = fileSize > _1M; // 是否尝试开启秒传，>1M尝试
    // 使用秒传生成 Id

    const quickUploadResult = shouldWeUseQuickUpload ? (this._eUpdateUploadPercent(12, (_o => {
      (_i => {
        console.log('哈希时间预计为', _i);
      })(_o);

      return _o;
    })(animationTimeOfHash(fileSize))), await this.quickUpload(file)) : void 0;
    const hexHash = quickUploadResult === null || quickUploadResult === void 0 ? void 0 : quickUploadResult.hexHash;
    let fileId = quickUploadResult === null || quickUploadResult === void 0 ? void 0 : quickUploadResult.fileId; // 生成 Id

    if (!fileId) {
      fileId = await this.normalUpload(file);
      fileId && hexHash && api$3.postFileIdWithHash(hexHash, fileId);
    }

    return {
      fileId,
      hexHash
    };
  }
  /**
   * 第四步，引用计数加1
   */


  async step4Finished(uploadTempNode, relNode) {
    try {
      await uploadTempNode.increaseReferenceCount();

      if (this.shouldWeShowUploadPercent) {
        this._eUpdateUploadPercent(100);

        await delay$1(444);

        this._eVirtualNodePop();
      }

      relNode._uploading = false;

      this._eRelNodeGenerated(relNode);

      this.areWeUseQuickUpload ? utils.success('秒传成功') : utils.success('上传成功');

      this._eUploadSuccess(this.areWeUseQuickUpload);
    } catch (e) {
      this._eUploadFail();

      try {
        shouldTip(e);
      } catch (e) {
        utils.error('上传失败');
        console.error(e);
      }
    }
  }

  async upload(file, toFolder) {
    const name = file.name;
    const sizeNumber = file.size;
    const uploadTempNode = FileNode.upload(name, sizeNumber, toFolder);
    this.shouldWeShowUploadPercent = sizeNumber > _1M; // 第一步：生成虚拟节点（上传中节点，带进度条）

    this.step1GenerateVirtualNode(uploadTempNode); // 第二步：生成 fileId

    const {
      fileId,
      hexHash
    } = await this.step2GenerateFileId(uploadTempNode, file);
    const fileNode = uploadTempNode.toFileNode(fileId, hexHash);
    fileNode._uploading = true; // 第三步：上传完毕

    await fileNode.create(toFolder);
    await fileNode.applyToServer(); // 第四步：文件引用计数加 1，保存成功后的动画

    await this.step4Finished(uploadTempNode, fileNode);
  }

  rollback() {}

  async cancelUpload() {
    if (this.isPaused) {
      this._eUploadFail(1, 200);

      this.rejectWillResolve('canceled');
      await this.rollback();
      this.isCanceled = true;
      return;
    }

    this._eUploadFail(1, 5000);

    console.time('本次回滚花费了');
    this.canceledInfo = await this._cancel.cancelCurrent();
    await delay$1(100);
    await this.rollback();
    console.timeEnd('本次回滚花费了');
    this.isCanceled = true;
  }

  on(eventNames, callback) {
    const isEventNamesArray = isArray(eventNames);
    isEventNamesArray || (eventNames = [eventNames]);
    const indexes = eventNames.map(eventName => this.event.on(eventName, callback));
    return isEventNamesArray ? indexes : indexes[0];
  }

  unbind(eventNames, index) {
    isArray(eventNames) || (eventNames = [eventNames]);
    eventNames.forEach(eventName => this.event.unbind(eventName, index));
  }

  _eUploadPaused(isPaused) {
    this.step = (_o => {
      (it => {
        return this.event.emit(it, {
          node: this.node,
          isPaused
        });
      })(_o);

      return _o;
    })(UploadEvents.UploadPaused);
  }

  _eUpdateUploadPercent(percent, duration = 400) {
    this.animationDuration = duration;
    this.percent = percent;

    this.step = (_o => {
      (it => {
        return this.event.emit(it, {
          node: this.node,
          percent,
          duration
        });
      })(_o);

      return _o;
    })(UploadEvents.PercentUpdating);
  }

  _eUpdateUploadRate(rate) {
    this.rate = rate;

    this.step = (_o => {
      (it => {
        return this.event.emit(it, {
          node: this.node,
          rate
        });
      })(_o);

      return _o;
    })(UploadEvents.RateUpdating);
  }

  _eUploadFail(percent = 100, duration = 400) {
    this.percent = percent;
    this.animationDuration = duration;

    this.step = (_o => {
      (it => {
        return this.event.emit(it, {
          node: this.node,
          percent,
          duration
        });
      })(_o);

      return _o;
    })(UploadEvents.Fail);
  }

  _eUploadSuccess(areQuickUpload) {
    this.percent = 100;
    this.animationDuration = 400;

    this.step = (_o => {
      (it => {
        return this.event.emit(it, areQuickUpload);
      })(_o);

      return _o;
    })(UploadEvents.Success);
  }

  _eRelNodeGenerated(node) {
    this.step = (_o => {
      (it => {
        return this.event.emit(it, node);
      })(_o);

      return _o;
    })(UploadEvents.RelNodeGenerated);
  }

  _eVirtualNodeGenerate(node) {
    this.step = (_o => {
      (it => {
        return this.event.emit(it, node);
      })(_o);

      return _o;
    })(UploadEvents.VirtualNodeGenerated);
  }

  _eVirtualNodePop() {
    this.step = (_o => {
      (it => {
        return this.event.emit(it, this.node);
      })(_o);

      return _o;
    })(UploadEvents.VirtualNodeRemoving);
  }

}

var css$12 = "@-webkit-keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin {\r\n  0% {\r\n    -webkit-transform: rotate(0);\r\n            transform: rotate(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@-webkit-keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n@keyframes check-mark-checked {\r\n  0% {\r\n    -webkit-transform: rotate(45deg) scaleY(0);\r\n            transform: rotate(45deg) scaleY(0);\r\n  }\r\n  100% {\r\n    -webkit-transform: rotate(45deg) scaleY(1);\r\n            transform: rotate(45deg) scaleY(1);\r\n  }\r\n}\r\n\r\n.-upload-percent {\r\n  width: 100%;\r\n  height: 14px;\r\n  background-color: #ffffff;\r\n}\r\n\r\n.-upload-percent .-upload-percent-inner {\r\n    background-color: #00a0e9;\r\n    height: 100%;\r\n  }\r\n\r\n.-upload-percent .-upload-percent-inner.error {\r\n      background-color: red;\r\n    }";
styleInject(css$12);

const FileUploadPercentState$1 = {
  Down: 'down',
  Error: 'error',
  Processing: 'processing'
};
class FileUploadPercent extends React.Component {
  constructor() {
    super();
  }

  render() {
    const {
      percent,
      state = FileUploadPercentState$1.Processing,
      duration = 400
    } = this.props;
    return React.createElement("div", {
      className: '-upload-percent'
    }, React.createElement("div", {
      className: `-upload-percent-inner ${state}`,
      style: {
        width: `${percent}%`,
        transition: `all ${duration}ms linear, opacity .25s cubic-bezier(.71,-.46,.29,1.46)`
      }
    }));
  }

}

let singleEntryBoxInstance;
class EntryBox extends React.Component {
  constructor(props) {
    super(props);

    if (singleEntryBoxInstance) {
      console.error('网盘入口已被注册');
    }

    singleEntryBoxInstance = this;
    this.state = {
      big: false,
      show: true,
      onUploadingCount: 0,
      uploadFail: false
    };
    this.uploaders = [];
    reactAutoBinding(this);

    window.onbeforeunload = e => {
      e = e || window.event;
      const msg = '仍有文件在上传，是否离开';

      if (this.state.onUploadingCount > 0) {
        // For IE and Firefox prior to version 4
        if (e) {
          e.returnValue = msg;
        } // For Safari


        return msg;
      }
    };

    router.onRouterChange(url => {
      if (this.url === url) {
        return;
      }

      this.url = url;
      this.setState({
        big: url.includes('/app/mind') || url.includes('/app/editor'),
        show: !url.includes('/app/login/scan')
      });
    });
    utils.onFullScreenChange(payload => {
      this.setState();
      console.log(payload);
    });
  }

  pushUploader(uploader) {
    this.uploaders.push(uploader);
    const onUploadingCount = this.uploaders.filter(uploader => ![UploadEvents.Success, UploadEvents.Fail].includes(uploader.step)).length;
    this.setState({
      onUploadingCount
    });
    uploader.on(UploadEvents.Success, () => {
      this.setState({
        onUploadingCount: this.state.onUploadingCount - 1
      });
    });
    uploader.on(UploadEvents.Fail, ({
      node,
      percent,
      duration
    }) => {
      if (percent >= 99) {
        this.setState({
          uploadFail: true
        });
      } else {
        this.setState({
          onUploadingCount: this.state.onUploadingCount - 1
        });
      }
    });
  }

  showUploadBox(e) {
    if (this.uploaders.length === 0) {
      return;
    }

    e.stopPropagation();
    showUploadBox(this.uploaders);
  }

  onEntryBoxClick() {
    if (this.url && !this.url.includes('/app/net-disk')) {
      router.targetFolderChange();
    }
  }

  render() {
    const {
      big,
      show,
      onUploadingCount,
      uploadFail
    } = this.state;
    const cBig = big ? 'big' : '';
    return React.createElement("div", {
      className: `-net-disk-entry-box-self-control ${cBig}`,
      style: {
        visibility: show ? 'visible' : 'hidden'
      },
      onClick: this.onEntryBoxClick
    }, React.createElement("div", {
      className: "-icon",
      style: {
        background: `url(${img})`
      },
      onClick: this.showUploadBox
    }), React.createElement("div", {
      className: "-text"
    }, "\u7F51\u76D8"), onUploadingCount > 0 && React.createElement("div", {
      className: 'file-num-on-upload'
    }, uploadFail ? '?' : onUploadingCount));
  }

}
const EntryBoxState = {
  Paused: 'Paused',
  Canceled: 'Canceled',
  UploadFail: 'UploadFail',
  QuickUploaded: 'QuickUploaded',
  Uploaded: 'Uploaded',
  Uploading: 'Uploading'
};
const PauseOrPlayButtonState = {
  Paused: 'Paused',
  PausingOrStarting: 'PausingOrStarting',
  Play: 'Play'
};
const CancelButtonState = {
  Cancelling: 'Cancelling'
};

class UploadBoxBar extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "pauseOrStartUpload", (() => {
      let locked = false;
      return () => {
        const {
          uploader
        } = this.props;
        const {
          pauseButtonState
        } = this.state;

        if (locked) {
          return;
        }

        locked = true;
        this.setState({
          pauseButtonState: PauseOrPlayButtonState.PausingOrStarting
        });
        const isPaused = pauseButtonState === PauseOrPlayButtonState.Paused;
        const shouldPause = !isPaused;

        if (pauseButtonState === PauseOrPlayButtonState.PausingOrStarting) {
          console.error('严重的逻辑错误，发生在暂停按钮');
          return;
        }

        uploader.pauseOrStartUpload(shouldPause).then(() => {
          const newState = shouldPause ? {
            pauseButtonState: PauseOrPlayButtonState.Paused,
            entryBoxState: EntryBoxState.Paused
          } : {
            pauseButtonState: PauseOrPlayButtonState.Play,
            entryBoxState: EntryBoxState.Uploading
          };
          this.setState(newState, () => {
            locked = false;
          });
        });
      };
    })());

    const {
      uploader: _uploader
    } = props;
    const entryBoxState = _uploader.isCanceled ? EntryBoxState.Canceled : _uploader.isPaused ? EntryBoxState.Paused : _uploader.step === UploadEvents.Fail ? EntryBoxState.UploadFail : _uploader.areWeUseQuickUpload ? EntryBoxState.QuickUploaded : _uploader.step === UploadEvents.Success ? EntryBoxState.Uploaded : [UploadEvents.RateUpdating, UploadEvents.PercentUpdating, UploadEvents.VirtualNodeGenerated, UploadEvents.VirtualNodeRemoving, UploadEvents.RelNodeGenerated].includes(_uploader.step) ? EntryBoxState.Uploading : void 0;
    this.state = {
      percent: _uploader.percent,
      duration: 400,
      rate: _uploader.rate,
      percentState: undefined,
      entryBoxState,
      pauseButtonState: _uploader.isPaused ? PauseOrPlayButtonState.Paused : PauseOrPlayButtonState.Play,
      cancelButtonState: undefined
    };
    reactAutoBinding(this);
    const erMap = {
      [UploadEvents.VirtualNodeGenerated]: () => {
        this.setState({
          entryBoxState: EntryBoxState.Uploading
        });
      },
      [UploadEvents.PercentUpdating]: ({
        node,
        percent,
        duration
      }) => {
        this.isCanceled || this.setState({
          percent,
          duration
        });
      },
      [UploadEvents.RateUpdating]: ({
        node,
        rate
      }) => {
        this.isCanceled || this.setState({
          rate
        });
      },
      [UploadEvents.Fail]: ({
        node,
        percent,
        duration
      }) => {
        this.setState({
          percentState: FileUploadPercentState$1.Error
        });
        setTimeout(() => {
          this.setState({
            percent,
            duration
          });
        });

        if (this.isCanceled) {
          return;
        }

        setTimeout(() => {
          this.setState({
            entryBoxState: EntryBoxState.UploadFail
          });
        }, duration + 400);
      },
      [UploadEvents.Success]: areQuickUpload => {
        this.setState({
          entryBoxState: areQuickUpload ? EntryBoxState.QuickUploaded : EntryBoxState.Uploaded
        });
      }
    };
    Object.entries(erMap).forEach(([eventName, eventReceiver]) => {
      const index = _uploader.on(eventName, eventReceiver);

      this.registerOnComponentWillUnmount(() => _uploader.unbind(eventName, index));
    });
  }

  cancelUpload() {
    const {
      uploader
    } = this.props;

    if (this.isCanceled) {
      return;
    }

    this.isCanceled = true;
    this.setState({
      cancelButtonState: CancelButtonState.Cancelling
    });
    uploader.cancelUpload().then(() => {
      this.setState({
        entryBoxState: EntryBoxState.Canceled
      });
    });
  }

  render() {
    var _this = this;

    const {
      percent,
      duration,
      rate,
      percentState,
      pauseButtonState,
      entryBoxState,
      cancelButtonState
    } = this.state;
    const {
      uploader: {
        node
      }
    } = this.props;

    const UploadState = function () {
      const map = {
        [EntryBoxState.Uploading]: React.createElement("div", {
          className: 'upload-inner'
        }, React.createElement("div", {
          className: 'percent'
        }, React.createElement(FileUploadPercent, {
          percent: percent,
          state: percentState,
          duration: duration
        })), React.createElement("span", {
          className: 'rate'
        }, rate)),
        [EntryBoxState.Paused]: React.createElement("div", {
          className: 'finished'
        }, "\u5DF2\u6682\u505C"),
        [EntryBoxState.Canceled]: React.createElement("div", {
          className: 'finished'
        }, "\u5DF2\u53D6\u6D88"),
        [EntryBoxState.UploadFail]: React.createElement("div", {
          className: 'finished'
        }, React.createElement("div", {
          className: 'fail-icon'
        }), "\u4E0A\u4F20\u5931\u8D25"),
        [EntryBoxState.QuickUploaded]: React.createElement("div", {
          className: 'finished'
        }, React.createElement("div", {
          className: 'success-icon'
        }), "\u79D2\u4F20"),
        [EntryBoxState.Uploaded]: React.createElement("div", {
          className: 'finished'
        }, React.createElement("div", {
          className: 'success-icon'
        }), "\u4E0A\u4F20\u6210\u529F")
      };
      return map[entryBoxState];
    }();

    const Operates = function () {
      const showOperates = [EntryBoxState.Uploading, EntryBoxState.Paused].includes(entryBoxState);
      const cPlayOrPauseButtonState = {
        [PauseOrPlayButtonState.Play]: 'pause',
        [PauseOrPlayButtonState.Paused]: 'play',
        [PauseOrPlayButtonState.PausingOrStarting]: 'pausing-or-starting'
      }[pauseButtonState];
      const cCancelling = cancelButtonState === CancelButtonState.Cancelling ? 'closing' : '';

      if (showOperates) {
        return React.createElement("div", {
          className: 'operates'
        }, React.createElement("div", {
          className: `play-pause-button ${cPlayOrPauseButtonState}`,
          onClick: _this.pauseOrStartUpload
        }), React.createElement("div", {
          className: `-close ${cCancelling}`,
          onClick: _this.cancelUpload
        }));
      } else {
        return React.createElement("div", {
          className: 'operates'
        });
      }
    }();

    const fileName = node.name.substring(0, node.name.length - 4);
    return React.createElement("div", {
      className: 'upload-box-bar',
      key: node.id + node.name
    }, React.createElement("span", {
      className: 'file-name'
    }, fileName), React.createElement("span", {
      className: 'file-size'
    }, node.size), React.createElement("div", {
      className: 'upload-state'
    }, UploadState), Operates);
  }

  registerOnComponentWillUnmount(callback) {
    const callbacks = this.callbacks || (this.callbacks = []);
    callbacks.push(callback);
  }

  componentWillUnmount() {
    this.callbacks.forEach(cb => cb());
  }

}

const showUploadBox = uploaders => {
  showDialog(props => React.createElement("div", {
    className: 'upload-box',
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: '-title'
  }, "\u5927\u6587\u4EF6\u4E0A\u4F20\u5217\u8868", React.createElement("div", {
    className: '-close',
    onClick: props.onClose
  })), uploaders.map(uploader => React.createElement(UploadBoxBar, {
    uploader: uploader,
    key: uploader.node.name + uploader.node.id
  }))), 1001);
};

const showEntryBox = once(() => {
  const dom = document.createElement("div");
  document.body.appendChild(dom);
  render(React.createElement(EntryBox, null), dom);
});
function pushUploaderToEntryBox(uploader) {
  singleEntryBoxInstance.pushUploader(uploader);
}

let isFileUpload = true;
function generateCouldDragFileNode(fileInfo, moveOrCopy) {
  const draggable = !fileInfo._isFolder && !fileInfo._isVirtual && !fileInfo._onUpload;
  return {
    onDrop: e => {
      var _e$nativeEvent$dataTr;

      if (draggable) {
        return;
      }

      isFileUpload = true;
      const id = (_e$nativeEvent$dataTr = e.nativeEvent.dataTransfer.getData('id'), Number.parseFloat(_e$nativeEvent$dataTr));
      const needMoveFileDetail = current.folder.sub.find(fd => fd.id === id);
      const targetFolder = fileInfo._isVirtual ? fileInfo._relNode._parentNode() : fileInfo;
      moveOrCopy((_o => {
        (_i => {
          console.log(_i);
        })(_o);

        return _o;
      })(needMoveFileDetail))((_o => {
        (_i => {
          console.log(_i);
        })(_o);

        return _o;
      })(targetFolder), 'move');
      e.stopPropagation();
    },

    onDragStart(e) {
      e.nativeEvent.dataTransfer.setData('id', fileInfo.id);
      e.nativeEvent.dataTransfer.dropEffect = 'move';
      e.nativeEvent.dataTransfer.effectAllowed = 'move';
      const image = e.nativeEvent.target.querySelector('.main .icon');
      e.nativeEvent.dataTransfer.setDragImage(image, 22, 22);
    },

    draggable,
    title: draggable ? '拖拽此处移动文件' : ''
  };
}
/**
 * 上传拖放
 */

function bindUpload(setShowUploadContainerState) {
  const dropBox = getRootElement();
  const updateShowUploadContainer = throttle(show => {
    setShowUploadContainerState(show);
  }, 80);
  let countOfShow = 0;
  let countOfHide = 0;

  const showOrHideUploadContainer = showOrHide => {
    if (showOrHide === 'show') {
      countOfShow++;
    } else {
      countOfHide++;
    }

    updateShowUploadContainer(countOfShow > countOfHide);
  };

  dropBox.addEventListener('dragstart', function (e) {
    isFileUpload = false;
  });
  dropBox.addEventListener('dragend', function (e) {
    isFileUpload = true;
  });
  dropBox.addEventListener('dragenter', function (e) {
    isFileUpload && showOrHideUploadContainer('show');
    e.preventDefault();
  });
  dropBox.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  dropBox.addEventListener('dragleave', function (e) {
    isFileUpload && showOrHideUploadContainer('hide');
    e.preventDefault();
  });
  dropBox.addEventListener("drop", e => {
    isFileUpload && showOrHideUploadContainer('hide');
    e.preventDefault();
  });
}
const handleUploadContainerDrag = (() => {
  let enterCount = 0;
  let leaveCount = 0;
  return (eventName, setCouldMouseUpState) => {
    if (!isFileUpload) {
      return;
    }

    if (eventName === 'enter') {
      enterCount++;
    } else {
      leaveCount++;
    }

    setCouldMouseUpState(enterCount > leaveCount);
  };
})();

const style = {
  width: '100%',
  height: '100%'
};
function VideoContainer(props) {
  return React.createElement("video", {
    src: props.content,
    controls: true,
    style: {
      maxWidth: '100%',
      maxHeight: '96%'
    }
  });
}
function PdfContainer(props) {
  return React.createElement("embed", {
    src: props.content,
    style: style
  });
}

function IFrameContainer(props) {
  return React.createElement("iframe", {
    src: props.content,
    style: style,
    frameBorder: 0
  });
}
 // export function TextContainer (props) {
//   const isTxt = () => {
//     return props.payload.name.endsWith('.txt')
//   }
//   if (isTxt()) {
//     const src = `
// <meta charset="GBK" />
// <iframe src="${props.content}" style="width: 100%; height: 95%" frameborder="0"/>
// `
//     return <iframe srcDoc={src} style={style} frameBorder={0} />
//   }
//   return <iframe src={props.content} style={style} frameBorder={0}/>
// }
// export class ZipContainer extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       files: []
//     }
//     this.fetch()
//   }
//
//   fetch () {
//     const {fileId} = this.props.payload
//
//     api.getFileContent(fileId)
//       .then(uInt8FileData => jsZip.loadAsync(uInt8FileData))
//       .alsoPrint()
//       .then(zip => {
//         const files = zip.files
//         this.setState({
//           files: Object.values(files)
//         })
//       })
//   }
//
//   render () {
//     const {files} = this.state
//     return <div>
//       {files.map(file => <div key={file.name}>{file.name}</div>)}
//     </div>
//   }
// }

/**
 * @see http://www.zhangxinxu.com/wordpress/2017/07/js-text-string-download-as-html-json-file/
 * browser
 * change logs:
 * 2018/2/4 herbluo created
 */
function downloadFile(fileName, href) {
  const eleLink = document.createElement('a');
  eleLink.download = fileName;
  eleLink.style.display = 'none';
  eleLink.href = href;
  eleLink.click();
}
function downloadBlob(fileName, content, blobOptions = {}) {
  // blobOptions = {
  //     type: 'text/csv',
  //     endings: 'native' // or transparent
  // };
  const blob = new Blob([content], blobOptions);
  const a = document.createElement('a');
  a.innerHTML = fileName;
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  const evt = document.createEvent("MouseEvents");
  evt.initEvent("click", false, false);
  a.dispatchEvent(evt);
  document.body.removeChild(a);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var StreamSaver = createCommonjsModule(function (module) {
((name, definition) => {
	module.exports = definition();
})('streamSaver', () => {
	let
	iframe, loaded,
	secure = location.protocol == 'https:' || location.hostname == 'localhost',
	streamSaver = {
		createWriteStream,
		supported: false,
		version: {
			full: '1.0.0',
			major: 1, minor: 0, dot: 0
		}
	};

	streamSaver.mitm = 'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=' +
		streamSaver.version.full;

	try {
		// Some browser has it but ain't allowed to construct a stream yet
		streamSaver.supported = 'serviceWorker' in navigator && !!new ReadableStream() && !!new WritableStream();
	} catch(err) {
		// if you are running chrome < 52 then you can enable it
		// `chrome://flags/#enable-experimental-web-platform-features`
	}

	function createWriteStream(filename, queuingStrategy, size) {

		// normalize arguments
		if (Number.isFinite(queuingStrategy))
			[size, queuingStrategy] = [queuingStrategy, size];

		let channel = new MessageChannel,
		popup,
		setupChannel = () => new Promise((resolve, reject) => {
			channel.port1.onmessage = evt => {
				if(evt.data.download) {
					resolve();
					if(!secure) popup.close(); // don't need the popup any longer
					let link = document.createElement('a');
					let click = new MouseEvent('click');

					link.href = evt.data.download;
					link.dispatchEvent(click);
				}
			};

			if(secure && !iframe) {
				iframe = document.createElement('iframe');
				iframe.src = streamSaver.mitm;
				iframe.hidden = true;
				document.body.appendChild(iframe);
			}

			if(secure && !loaded) {
				let fn;
				iframe.addEventListener('load', fn = evt => {
					loaded = true;
					iframe.removeEventListener('load', fn);
					iframe.contentWindow.postMessage(
						{filename, size}, '*', [channel.port2]);
				});
			}

			if(secure && loaded) {
				iframe.contentWindow.postMessage({filename, size}, '*', [channel.port2]);
			}

			if(!secure) {
				popup = window.open(streamSaver.mitm, Math.random());
				let onready = evt => {
					if(evt.source === popup){
						popup.postMessage({filename, size}, '*', [channel.port2]);
						removeEventListener('message', onready);
					}
				};

				// Another problem that cross origin don't allow is scripting
				// so popup.onload() don't work but postMessage still dose
				// work cross origin
				addEventListener('message', onready);
			}
		});

		return new WritableStream({
			start(error) {
				// is called immediately, and should perform any actions
				// necessary to acquire access to the underlying sink.
				// If this process is asynchronous, it can return a promise
				// to signal success or failure.
				return setupChannel()
			},
			write(chunk) {
				// is called when a new chunk of data is ready to be written
				// to the underlying sink. It can return a promise to signal
				// success or failure of the write operation. The stream
				// implementation guarantees that this method will be called
				// only after previous writes have succeeded, and never after
				// close or abort is called.

				// TODO: Kind of important that service worker respond back when
				// it has been written. Otherwise we can't handle backpressure
				channel.port1.postMessage(chunk);
			},
			close() {
				channel.port1.postMessage('end');
				console.log('All data successfully read!');
			},
			abort(e) {
				channel.port1.postMessage('abort');
			}
		}, queuingStrategy)
	}

	return streamSaver
});
});

// Port of lower_bound from http://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comp) {
	let first = 0;
	let count = array.length;

	while (count > 0) {
		const step = (count / 2) | 0;
		let it = first + step;

		if (comp(array[it], value) <= 0) {
			first = ++it;
			count -= step + 1;
		} else {
			count = step;
		}
	}

	return first;
}

class PriorityQueue {
	constructor() {
		this._queue = [];
	}

	enqueue(run, opts) {
		opts = Object.assign({
			priority: 0
		}, opts);

		const element = {priority: opts.priority, run};

		if (this.size && this._queue[this.size - 1].priority >= opts.priority) {
			this._queue.push(element);
			return;
		}

		const index = lowerBound(this._queue, element, (a, b) => b.priority - a.priority);
		this._queue.splice(index, 0, element);
	}

	dequeue() {
		return this._queue.shift().run;
	}

	get size() {
		return this._queue.length;
	}
}

class PQueue {
	constructor(opts) {
		opts = Object.assign({
			concurrency: Infinity,
			autoStart: true,
			queueClass: PriorityQueue
		}, opts);

		if (!(typeof opts.concurrency === 'number' && opts.concurrency >= 1)) {
			throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${opts.concurrency}\` (${typeof opts.concurrency})`);
		}

		this.queue = new opts.queueClass(); // eslint-disable-line new-cap
		this._queueClass = opts.queueClass;
		this._pendingCount = 0;
		this._concurrency = opts.concurrency;
		this._isPaused = opts.autoStart === false;
		this._resolveEmpty = () => {};
		this._resolveIdle = () => {};
	}

	_next() {
		this._pendingCount--;

		if (this.queue.size > 0) {
			if (!this._isPaused) {
				this.queue.dequeue()();
			}
		} else {
			this._resolveEmpty();
			this._resolveEmpty = () => {};

			if (this._pendingCount === 0) {
				this._resolveIdle();
				this._resolveIdle = () => {};
			}
		}
	}

	add(fn, opts) {
		return new Promise((resolve, reject) => {
			const run = () => {
				this._pendingCount++;

				try {
					Promise.resolve(fn()).then(
						val => {
							resolve(val);
							this._next();
						},
						err => {
							reject(err);
							this._next();
						}
					);
				} catch (err) {
					reject(err);
					this._next();
				}
			};

			if (!this._isPaused && this._pendingCount < this._concurrency) {
				run();
			} else {
				this.queue.enqueue(run, opts);
			}
		});
	}

	addAll(fns, opts) {
		return Promise.all(fns.map(fn => this.add(fn, opts)));
	}

	start() {
		if (!this._isPaused) {
			return;
		}

		this._isPaused = false;
		while (this.queue.size > 0 && this._pendingCount < this._concurrency) {
			this.queue.dequeue()();
		}
	}

	pause() {
		this._isPaused = true;
	}

	clear() {
		this.queue = new this._queueClass(); // eslint-disable-line new-cap
	}

	onEmpty() {
		// Instantly resolve if the queue is empty
		if (this.queue.size === 0) {
			return Promise.resolve();
		}

		return new Promise(resolve => {
			const existingResolve = this._resolveEmpty;
			this._resolveEmpty = () => {
				existingResolve();
				resolve();
			};
		});
	}

	onIdle() {
		// Instantly resolve if none pending
		if (this._pendingCount === 0) {
			return Promise.resolve();
		}

		return new Promise(resolve => {
			const existingResolve = this._resolveIdle;
			this._resolveIdle = () => {
				existingResolve();
				resolve();
			};
		});
	}

	get size() {
		return this.queue.size;
	}

	get pending() {
		return this._pendingCount;
	}

	get isPaused() {
		return this._isPaused;
	}
}

var pQueue = PQueue;

/**
 * @type {StreamSaver}
 */
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


class Download {
  // 3M * 10
  constructor(file, generateTypedArray) {
    if (generateTypedArray) {
      this.generateTypedArray = true;
    } else {
      const fileStream = StreamSaver.createWriteStream(file.name, file.sizeNumber);
      this.writer = fileStream.getWriter();
    }

    this.fileId = (_o => {
      (_i => {
        console.log(_i);
      })(_o);

      return _o;
    })(file).fileId;

    this.fileSize = file.sizeNumber;
  }

  async download(concurrency = 8) {
    const {
      fileSize,
      fileId
    } = this;
    const downloadFragmentQueue = new pQueue({
      concurrency
    });
    const append2WriterQueue = new pQueue({
      concurrency: 1
    });
    const resultTypedArrays = [];

    const downloadFile$$1 = (from, to) => {
      const saveUInt8Array = uInt8Array => this.generateTypedArray ? resultTypedArrays.push(uInt8Array) : this.writer.write(uInt8Array);

      (_o => {
        (it => {
          return append2WriterQueue.add(() => it).then(saveUInt8Array);
        })(_o);

        return _o;
      })(downloadFragmentQueue.add(() => api$3.getFileContent(fileId, from, to - from)));

      if (to < fileSize) {
        downloadFile$$1(to, to + Download.step);
      }
    };

    downloadFile$$1(0, 1024 * 64);
    await append2WriterQueue.onIdle();
    console.log('end');
    setTimeout(() => {
      var _this$writer, _this$writer$close;

      return (_this$writer = this.writer) === null || _this$writer === void 0 ? void 0 : (_this$writer$close = _this$writer.close()) === null || _this$writer$close === void 0 ? void 0 : _this$writer$close.catch(console.error);
    });
    return resultTypedArrays;
  }

  static fixUInt8Arrays(uInit8Arrays) {
    const length = uInit8Arrays.reduce((sum, it) => sum + it.length, 0);
    const uInit8Array = new Uint8Array(length);
    let index = 0;
    uInit8Arrays.forEach(uia => {
      uInit8Array.set(uia, index);
      index += uia.length;
    });
    return uInit8Array;
  }

}

_defineProperty(Download, "step", 1024 * 1024 * 3);

class FolderDownload {
  constructor(folder) {
    var _ref, _folder;

    // 简单地复制即可
    this.folder = (_ref = (_folder = folder, JSON.stringify(_folder)), JSON.parse(_ref));
    this.flatFiles = [];
    this.jsZip = undefined;
  }

  async download() {
    this.flatFiles = await this.fetchFileNodes();

    if (this.isFolderSizeTooBig()) {
      utils.warning('该文件夹大于1G，不支持下载');
      return;
    }

    await this.generateZipFile();
    await this.downloadZipFile();
  }

  async fetchFileNodes() {
    var _this = this;

    const flatFiles = [];

    const simpleFileNodes = function () {
      let simpleFileNodes = [];

      _this.folderForEach(node => {
        flatFiles.push(node);

        if (!node.sub) {
          simpleFileNodes.push(node);
        }
      });

      return simpleFileNodes;
    }();

    const fileDetails = await api$3.getFileInfos(simpleFileNodes.map(({
      id
    }) => id));
    fileDetails.forEach(detail => {
      const node = simpleFileNodes.find(({
        id
      }) => detail.id === id);
      Object.assign(node, detail);
      node._fullPathName += node.name;
    });
    return flatFiles;
  }

  isFolderSizeTooBig() {
    const size = this.flatFiles.reduce((sum, it) => {
      return sum + (it.sizeNumber || 0);
    }, 0);
    return size > 1024 * 1024 * 1024; // 1GB
  }

  async generateZipFile() {
    const jsZip = this.jsZip = new JsZip();
    const promises = [];
    this.flatFiles.forEach(node => {
      if (node._isFolder) {
        jsZip.folder(node._fullPathName);
      } else {
        const downloader = new Download(node, true);
        const promise = downloader.download(6).then(uInit8Arrays => {
          jsZip.file(node._fullPathName, Download.fixUInt8Arrays(uInit8Arrays));
        });
        promises.push(promise);
      }
    });
    await Promise.all(promises);
  }

  async downloadZipFile() {
    const blob = await this.jsZip.generateAsync({
      type: "uint8array"
    });
    downloadBlob(this.folder.name + '.zip', blob);
  }

  folderForEach(callback) {
    function deepTraversal(node) {
      const sub = node.sub;

      if (!sub) {
        return;
      }

      const length = sub.length;

      for (let i = 0; i < length; i++) {
        const currentNode = sub[i];
        currentNode._fullPathName = node._fullPathName ? node._fullPathName + '/' + (currentNode.name || '') : currentNode.name || '';
        currentNode._isFolder = !!currentNode.sub;
        callback(currentNode);
        deepTraversal(currentNode);
      }
    }

    deepTraversal(this.folder);
  }

}

class FileSystem extends FolderNode {
  constructor(rootNode) {
    super({}, rootNode || {
      name: '根目录'
    });
    this.isRoot = true;
    this.fileSystem = this;
  }

  findParentNode(node) {
    let result = undefined;
    this.forEach((_node, parentNode) => {
      if (_node.id === node.id) {
        result = this.loadNode(parentNode);
        return false;
      }
    });
    return result;
  }

  deleteNodeById(id) {
    this.forEach((node, parentNode, i) => {
      if (node.id === id) {
        parentNode.sub.splice(i, 1);
        return false;
      }
    });
  }

  findNodeById(id) {
    typeof id === "string" && (id = Number.parseFloat(id));
    let result = undefined;
    this.forEach(node => {
      if (node.id === id) {
        result = this.loadNode(node);
        return false;
      }
    });
    return result;
  }

  replaceNode(newNode) {
    const id = newNode.id;
    this.forEach((node, parentNode, i) => {
      if (node.id === id) {
        parentNode.sub[i] = newNode;
        return false;
      }
    });
  }

  loadNode(node) {
    if (node.constructor !== Object) {
      return node;
    } else if (node.sub) {
      const newNode = new FolderNode(this, node);
      this.replaceNode(newNode);
      return newNode;
    } else {
      return new TempFileNode(this, node.id);
    }
  }

}

class NetDisk extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "uploadPercentCallback", (() => {
      const update = throttle((node, percent, duration) => {
        node._percent = percent;
        node._duration = duration;
        this.setState({});
      }, 100);
      return (node, percent, duration) => {
        update(node, percent, duration);
      };
    })());

    _defineProperty(this, "uploadRateCallback", (() => {
      const update = throttle((node, rate) => {
        node._rate = rate;
        this.setState({});
      }, 1500);
      return (node, rate) => {
        update(node, rate);
      };
    })());

    this.state = {
      fileDetails: [],
      showUploadContainer: false,
      couldMouseUp: false
    };
    reactAutoBinding(this);

    this._fetchDetail();

    showEntryBox();
  }

  setState(state, func) {
    super.setState(state, func);

    if (state.fileDetails) {
      router.targetFolderChange(current.folder.id);
    }
  }

  _fetchDetail() {
    api$3.getFileSys().then(fileSystem => {
      console.debug(fileSystem);
      current.fileSystem = new FileSystem(fileSystem);
      const currentFolder = router.initFolder ? current.fileSystem.findNodeById(router.initFolder) || current.fileSystem : current.fileSystem;

      this._renderCurrentFileNode(currentFolder);
    });
  }
  /**
   * 进入当前文件夹
   * @param currentNode {FolderNode & CouldOpenNode}
   * @private
   */


  _renderCurrentFileNode(currentNode) {
    currentNode.open(folderNode => {
      current.folder = folderNode;
      this.setState({
        fileDetails: folderNode.sub
      });
    }).catch(console.error);
  }
  /**
   * 预览文件或 打开此文件夹
   */


  show(fileDetail) {
    return () => {
      // 文件夹
      if (fileDetail._isFolder || fileDetail._isVirtual) {
        this._renderCurrentFileNode(fileDetail);

        return;
      } // 上传时的临时文件


      if (fileDetail._onUpload) {
        return;
      } // 获取当前文件夹下所有相同类型的文件


      const getSameTypeOf = type => {
        // 获取该文件夹下的所有图片
        const typedFiles = this.state.fileDetails.filter(it => it.type === type); // 使 当前图片 提前至第一张

        const index = typedFiles.findIndex(it => it.id === fileDetail.id);
        [typedFiles[0], typedFiles[index]] = [typedFiles[index], typedFiles[0]]; // 生成标题和内容

        const titles = [];
        const contents = [];
        const payload = [];
        typedFiles.forEach(it => {
          titles.push(it.name);
          contents.push(api$3.getFileUrl(it));
          payload.push(it);
        });
        return {
          titles,
          contents,
          payload
        };
      }; // 类型: 预览器


      const map = {
        [FileType.Image]: undefined,
        [FileType.Video]: VideoContainer,
        [FileType.Pdf]: PdfContainer,
        [FileType.Text]: IFrameContainer // [FileType.Word]: DocContainer
        // [FileType.Zip]: ZipContainer
        // 显示预览弹窗

      };

      if (Object.keys(map).includes(fileDetail.type)) {
        showPreviewBox((_o => {
          (it => {
            return it.Component = map[fileDetail.type];
          })(_o);

          return _o;
        })(getSameTypeOf(fileDetail.type))).catch(console.error);
        return;
      }

      if ([FileType.Mind, FileType.Doc].includes(fileDetail.type)) {
        return;
      } // utils.toast('w', '暂不支持该文件')


      downloadFile(fileDetail.name, (_o => {
        (_i => {
          console.log(_i);
        })(_o);

        return _o;
      })(api$3.getFileUrl(fileDetail)) + `&filename=${fileDetail.name}`);
    };
  }
  /**
   * 重命名
   */


  rename(fileDetail) {
    return async newFileName => {
      const {
        fileDetails
      } = this.state;
      fileDetail.name = newFileName;
      fileDetail.version = (fileDetail.version || 1) + 1;

      if (fileDetail._isFolder) {
        await api$3.patchFileSys(current.fileSystem);
      } else {
        await api$3.patchFileInfo(fileDetail.id, fileDetail);
      }

      this.setState({
        fileDetails
      });
    };
  }
  /**
   * 删除文件，文件夹
   * @returns {Function}
   */


  remove(node) {
    return () => {
      const content = node instanceof FolderNode ? '是否将该文件夹删除?\n(该操作需要较长时间，且会清空文件夹内原有文件)' : '是否将该文件删除?';
      const confirmBoxPromise = showConfirmBox({
        content,
        beforeClose: () => confirmBoxPromise.then(() => node.remove()).then(() => {
          this.setState({});
          utils.toast('s', '删除成功');
        }).catch(shouldTip).catch(e => {
          console.error(e);
          utils.error('我们遇到了一些问题，删除失败，请尝试刷新界面');
        })
      });
      confirmBoxPromise.catch(() => {
        console.log('用户取消了操作');
      });
    };
  } // 支持超大文件的上传


  uploadFileV2(files) {
    files = Array.prototype.slice.call(files);

    const getFile = item => new Promise(resolve => item.file(resolve));

    files.forEach(async (file, i) => {
      file = file.isFile ? await (_o => {
        (_i => {
          console.log(_i);
        })(_o);

        return _o;
      })(getFile(file)) : file;
      setTimeout(() => {
        file.isDirectory ? this._uploadDirectory(file).catch(console.error) : this._uploadFileV3(file).catch(console.error);
      }, 800 * i);
    });
  } // 上传文件夹


  async _uploadDirectory(directoryEntry) {
    const {
      fileSystem
    } = current;
    const folderNode = new FolderNode(fileSystem, {
      name: directoryEntry.name
    });
    await folderNode.create(current.folder);
    folderNode._onUpload = true;
    this.uploadPercentCallback(folderNode, 2, 200);

    const pReadEntries = directoryEntry => {
      var _context;

      return new Promise((_context = directoryEntry.createReader()).readEntries.bind(_context));
    };

    const readFilePromise = entry => new Promise(entry.file.bind(entry)); // 总文件大小


    let folderSize = 0;
    const promises = [];
    const fileFolderPairs = [];

    const readEntries = async (directoryEntry, folder) => {
      const entries = await pReadEntries(directoryEntry);

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (entry.isFile) {
          const p = readFilePromise(entry).then(file => fileFolderPairs.push([folder, (_o => {
            (f => folderSize += f.size)(_o);

            return _o;
          })(file)]));
          promises.push(p);
        } else if (entry.isDirectory) {
          await new FolderNode(fileSystem, {
            name: entry.name
          }).create(folder).then(_curry(readEntries)(entry));
        }
      }
    };

    await readEntries(directoryEntry, folderNode);
    await Promise.all(promises);
    await Promise.all(fileFolderPairs.map(([folder, file]) => this._uploadFileSimple(file, folder, ({
      percent,
      duration,
      rate
    }) => {
      percent && (file.percent = percent);
      const percentOfFolder = fileFolderPairs.reduce((sum, [folder, file]) => {
        return sum + file.size * (file.percent || 0) / folderSize;
      }, 0);
      this.uploadPercentCallback(folderNode, (_o => {
        (_i => {
          console.log(_i);
        })(_o);

        return _o;
      })(percentOfFolder), duration);
    })));
    await folderNode.applyToServer();
    folderNode._onUpload = false;
    this.setState({});
    console.log('文件夹上传完毕');
  } // 上传文件夹中的文件，计算总进度


  async _uploadFileSimple(file, toFolder, stateCallback) {
    await this._uploadFileV3(file, toFolder, stateCallback);
  }
  /**
   * 主要代码转移至 Upload类中
   * @param file any
   * @param toFolder FolderNode
   * @param stateCallback ({percent, duration})
   * @returns {Promise<void>}
   * @private
   */


  async _uploadFileV3(file, toFolder, stateCallback = () => {}) {
    let toCurrent = !toFolder ? (toFolder = current.folder, true) : toFolder !== current.folder ? false : true;

    if (await toFolder.isNameExist(file.name)) {
      utils.error('文件名重复');
      return;
    }

    const uploader = new Upload();
    const {
      fileDetails
    } = this.state;
    file.size > 1024 * 1024 * 60
    /* 60M */
    && pushUploaderToEntryBox(uploader);
    toCurrent && uploader.on(UploadEvents.VirtualNodeGenerated, node => {
      this._appendNodeToState((_o => {
        (_i => {
          console.log(_i);
        })(_o);

        return _o;
      })(node));
    });
    toCurrent && uploader.on(UploadEvents.VirtualNodeRemoving, node => {
      arrayRemove(fileDetails, node, (a, b) => a.id === b.id);
      this.setState({});
    });
    toCurrent && uploader.on(UploadEvents.RelNodeGenerated, node => {
      this.setState({});
    });
    uploader.on(UploadEvents.PercentUpdating, ({
      node,
      percent,
      duration
    }) => {
      stateCallback({
        percent,
        duration
      });
      this.uploadPercentCallback(node, percent, duration);
    });
    uploader.on(UploadEvents.RateUpdating, ({
      node,
      rate
    }) => {
      stateCallback({
        rate
      });
      this.uploadRateCallback(node, rate);
    });
    uploader.on(UploadEvents.Fail, ({
      node,
      percent,
      duration
    }) => {
      stateCallback({
        fail: true
      });
      node._state = FileUploadPercentState$1.Error;
      this.uploadPercentCallback(node, percent, duration);
      setTimeout(() => {
        arrayRemove(fileDetails, node);
        this.setState({});
      }, 1000);
    });
    uploader.on(UploadEvents.UploadPaused, ({
      node,
      isPaused
    }) => {
      stateCallback({
        paused: true
      });
      node._isPaused = isPaused;
      this.setState({});
    });
    await uploader.upload(file, toFolder, []).catch(console.error);
  }

  /**
   * 添加节点到视图
   */
  _appendNodeToState(node) {
    const {
      fileDetails
    } = this.state;

    if (node._isFolder) {
      const indexOfFirstFile = fileDetails.findIndex(it => !it._isFolder && !it._isVirtual);
      fileDetails.splice(indexOfFirstFile === -1 ? fileDetails.length : indexOfFirstFile, 0, node);
    } else {
      fileDetails.push(node);
    }

    this.setState({});
  }
  /**
   * 新建（文件夹，脑图，文档）
   */


  async create(type, name) {
    const areWeCreatingAFolder = type === FileType.Folder;
    let node = areWeCreatingAFolder ? new FolderNode(current.fileSystem, {
      name
    }) : new FileNode(current.fileSystem, {
      name,
      type
    });

    try {
      await node.create(current.folder);
      await node.applyToServer();
      this.setState({});
      utils.toast('s', '创建成功');
    } catch (e) {
      shouldTip(e);
    }
  }

  share(fileDetail) {
    return () => {
      const url = api$3.getShareUrl(fileDetail);
      showConfirmBox({
        title: '分享',
        type: 'render',
        Component: React.createElement("input", {
          style: {
            width: 360,
            height: 40,
            fontSize: 14,
            padding: '0 12px'
          },
          id: 'thisIsAClipboardInput',
          readOnly: true,
          value: url
        }),
        ensureText: '复制链接',

        beforeClose() {
          document.getElementById('thisIsAClipboardInput').select();
          document.execCommand('copy');
        }

      }).catch(e => {
        if (e === 'canceled') {
          console.log('用户取消了操作');
          return;
        }

        console.error(e);
      });
    };
  }

  moveOrCopy(node) {
    return (toFolder, type) => {
      const isMove = type === 'move';
      node.moveOrCopy(toFolder, isMove).then(fileDetail => {
        this.setState({});
      }).catch(loge);
    };
  }

  setCouldMouseUpState(couldMouseUp) {
    this.setState({
      couldMouseUp
    });
  }

  handleDropEnd(e) {
    const items = Array.prototype.slice.call(e.nativeEvent.dataTransfer.items);
    this.uploadFileV2(items.map(item => item.webkitGetAsEntry()).filter(i => i));
    handleUploadContainerDrag('leave', this.setCouldMouseUpState);
  }

  downloadFile(fileDetail) {
    return async () => {
      if (!window.useNewDownloader && !fileDetail._isFolder) {
        downloadFile(fileDetail.name, api$3.getFileUrl(fileDetail) + `&filename=${fileDetail.name}`);
        return;
      }

      fileDetail._onDownload = true;
      fileDetail._percent = 1;
      this.setState({});
      const downloader = fileDetail._isFolder ? new FolderDownload(fileDetail) : new Download(fileDetail);
      console.time('下载用时');
      setTimeout(() => {
        fileDetail._percent = 95;
        fileDetail._duration = 10000;
        this.setState({});
      });
      await downloader.download().catch(console.error);
      setTimeout(() => {
        fileDetail._onDownload = false;
        this.setState({});
      }, 500);
      console.timeEnd('下载用时');
    };
  }

  render() {
    const {
      fileDetails,
      showUploadContainer,
      couldMouseUp
    } = this.state;
    const cnShowUploadContainer = showUploadContainer ? 'show-upload-container' : '';
    const cnCouldMouseUp = couldMouseUp ? 'mouse-up' : '';
    const FileBars = fileDetails.map((fileDetail, i) => fileDetail && !(fileDetail instanceof TempFileNode) && !fileDetail._uploading && React.createElement(FileBar, _extends({
      fileInfo: fileDetail,
      version: fileDetail.version,
      style: i % 2 === 0 ? {
        backgroundColor: '#dddddd'
      } : {},
      events: {
        show: this.show(fileDetail),
        rename: this.rename(fileDetail),
        remove: this.remove(fileDetail),
        moveOrCopy: this.moveOrCopy(fileDetail),
        share: this.share(fileDetail),
        downloadFile: this.downloadFile(fileDetail)
      }
    }, generateCouldDragFileNode(fileDetail, this.moveOrCopy), {
      key: fileDetail.id + fileDetail.name + i
    }), React.createElement("div", {
      className: 'upload'
    }, fileDetail._isPaused ? React.createElement("div", null, "\u5DF2\u6682\u505C") : fileDetail._onDownload ? React.createElement("div", {
      className: 'upload-inner'
    }, React.createElement("div", {
      className: 'percent'
    }, React.createElement(FileUploadPercent, {
      percent: fileDetail._percent,
      state: fileDetail._state,
      duration: fileDetail._duration
    })), React.createElement("span", {
      className: 'rate'
    }, fileDetail._rate || '-')) : fileDetail._onUpload ? React.createElement("div", {
      className: 'upload-inner'
    }, React.createElement("div", {
      className: 'percent'
    }, React.createElement(FileUploadPercent, {
      percent: fileDetail._percent,
      state: fileDetail._state,
      duration: fileDetail._duration
    })), React.createElement("span", {
      className: 'rate'
    }, fileDetail._rate || '-')) : void 0)));
    return React.createElement("div", {
      className: 'net-disk'
    }, React.createElement("div", {
      className: 'title-bar'
    }, "\u6211\u7684\u7F51\u76D8", React.createElement(OperateButtonsInTitle, {
      events: {
        create: this.create,
        upload: this.uploadFileV2
      }
    })), React.createElement("div", {
      className: `form ${cnShowUploadContainer} ${cnCouldMouseUp}`,
      onDrop: this.handleDropEnd,
      onDragEnter: () => handleUploadContainerDrag('enter', this.setCouldMouseUpState),
      onDragLeave: () => handleUploadContainerDrag('leave', this.setCouldMouseUpState)
    }, React.createElement(TitleBar, null), FileBars));
  }

  componentDidMount() {
    bindUpload(show => {
      this.setState({
        showUploadContainer: show
      });
    });
  }

}

var css$14 = "\r\n@font-face {font-family: \"iconfont\";\r\n  src: url('iconfont.eot?t=1523414179137'); /* IE9*/\r\n  src: url('iconfont.eot?t=1523414179137#iefix') format('embedded-opentype'), /* IE6-IE8 */\r\n  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),\r\n  url('iconfont.ttf?t=1523414179137') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/\r\n  url('iconfont.svg?t=1523414179137#iconfont') format('svg'); /* iOS 4.1- */\r\n}\r\n\r\n.iconfont {\r\n  font-family:\"iconfont\" !important;\r\n  font-size:16px;\r\n  font-style:normal;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n[class*=\"icon-font\"] {\r\n  font-family:\"iconfont\" !important;\r\n  font-size:16px;\r\n  font-style:normal;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n.icon-font-gengduo:before { content: \"\\e617\"; }\r\n\r\n.icon-font-dustbin_icon:before { content: \"\\e659\"; }\r\n\r\n.icon-font-xiazai:before { content: \"\\e794\"; }\r\n\r\n.icon-font-sousuo:before { content: \"\\e517\"; }\r\n\r\n";
styleInject(css$14);

var css$16 = "/* all the .scss file is not scss, it's cssnext */\r\n\r\n* {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n.relative {\r\n  position: relative;\r\n}\r\n\r\n.net-disk {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n      -ms-flex-direction: column;\r\n          flex-direction: column;\r\n  padding: 0 22px;\r\n}\r\n\r\n.net-disk a {\r\n    text-underline: none!important;\r\n  }\r\n\r\n.net-disk a:hover, .net-disk a:active {\r\n      text-underline: none!important;\r\n    }\r\n\r\n.net-disk >.title-bar {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    font-size: 18px;\r\n    height: 68px;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between\r\n  }\r\n\r\n.net-disk >.form {\r\n    background-color: #f2f2f2;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    color: #323232;\r\n    position: relative;\r\n  }\r\n\r\n.net-disk >.form.show-upload-container::after {\r\n      content: '拖动到此处以上传';\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n      width: 100%;\r\n      height: 100%;\r\n      display: -webkit-box;\r\n      display: -ms-flexbox;\r\n      display: flex;\r\n      -webkit-box-pack: center;\r\n          -ms-flex-pack: center;\r\n              justify-content: center;\r\n      -webkit-box-align: center;\r\n          -ms-flex-align: center;\r\n              align-items: center;\r\n\r\n      color: #666;\r\n      background-color: rgba(238, 238, 238, 0.8);\r\n    }\r\n\r\n.net-disk >.form.show-upload-container.mouse-up::after {\r\n      content: '松开鼠标以上传';\r\n    }\r\n\r\n.net-disk >.form .upload {\r\n      position: relative;\r\n      width: 250px;\r\n    }\r\n\r\n.net-disk >.form .upload .upload-inner {\r\n        display: -webkit-box;\r\n        display: -ms-flexbox;\r\n        display: flex;\r\n        -webkit-box-align: center;\r\n            -ms-flex-align: center;\r\n                align-items: center;\r\n      }\r\n\r\n.net-disk >.form .upload .percent {\r\n        width: 170px;\r\n      }\r\n\r\n.net-disk >.form .upload .rate {\r\n        margin-left: 8px;\r\n      }";
styleInject(css$16);

var img$1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFwmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNC0yNVQxMDowNzowMiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNC0yNVQxMDowNzowMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDQtMjVUMTA6MDc6MDIrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MGY2MWNiOTctNGQzYi04MTQxLWJlZjUtMmY1MmViYzU0MmI1IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDIxMTZmMTEtNjBhOC0zYjQ5LThlYjMtZGQ5ZTA3ZDg4ZmMzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Yzk4YmExMDQtMzEyNS1mZTQ0LWFmMjItNDM2Y2RkNzk5MTY3IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Yzk4YmExMDQtMzEyNS1mZTQ0LWFmMjItNDM2Y2RkNzk5MTY3IiBzdEV2dDp3aGVuPSIyMDE4LTA0LTI1VDEwOjA3OjAyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZjYxY2I5Ny00ZDNiLTgxNDEtYmVmNS0yZjUyZWJjNTQyYjUiIHN0RXZ0OndoZW49IjIwMTgtMDQtMjVUMTA6MDc6MDIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+BShFNwAAPGhJREFUeJzt3VeTHNeBsOn0leW6Gw0QdKLnyHyaiP1h+zP3ei8+O9qR6EQRJAACaFMmfe5FUxyOhjM0baqrzvMEQoEQgNYRENGVbx4X/9//z/8bAQAAYUh2PQAAAODuCAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiI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IgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAiIAAAAgIAIAAAACIgAAACAgAgAAAAIiAAAAICACAAAAAvL/AyqhGXOx5DBlAAAAAElFTkSuQmCC';

var img$2 = 'data:image/png;base64,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';

var img$3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFwmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNC0yNVQxMDowNzozMiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNC0yNVQxMDowNzozMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDQtMjVUMTA6MDc6MzIrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZWQ1MTc2NDctNDdjMy1jMDQ0LWI5ODUtNDRmZDdkNDI0Yzc2IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDA4NDhmODQtNGY4Mi0zYjQyLWEzNzctYmM1MGY1MTM2NmY5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGFiMDhmODktN2IyNS01MDRiLThjOWYtZjlkMzg0MzE3YTA1IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGFiMDhmODktN2IyNS01MDRiLThjOWYtZjlkMzg0MzE3YTA1IiBzdEV2dDp3aGVuPSIyMDE4LTA0LTI1VDEwOjA3OjMyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplZDUxNzY0Ny00N2MzLWMwNDQtYjk4NS00NGZkN2Q0MjRjNzYiIHN0RXZ0OndoZW49IjIwMTgtMDQtMjVUMTA6MDc6MzIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bq8OJQAAKoFJREFUeJzt3dl629iZhlFi5CRV7v+u+lrKIiXOffDHKEUu27ItizK/tQ70qJ1KN9Ixif0Ce2j+7//+bwYAAGRor30BAADA+xEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAEAQAQAAAEEEAAAABBEAAAAQRAAAAECQ/toXAMDPa5pm+lm/NE3TdV3btl3XdV03/Utt2zafTf/kbDa7XC7n8/nyWf1+Pp/P5/PpdDqdTpfLpf6x+t/z4n8E4I8jAAD+SDWCbz+bhvXT0L9+ed4G0z82+98AeD70n36vAJj+8Pm/Ov0DMgDgTyQAAP48bdsOw9B/NgzDlAHT6P/58/7ytd+fP9Sffr4Y7p9Op+PxWElwOp0On53P5/f7jw3AWxAAAB9d+79qiP+1AKhf3vYCLpfL1wKg/mR6IVD/qjcDAB+ZAAD4uGq4PwzDOI7DMEyD/ukZ//Ofzx/qv62maer/6IspQNNMoePxeDgc6ud+v9/tdhoA4MMSAAAfy/SY//kD/ucB0HXdVS7sa41xuVy+DIB6XVBMEwL4UAQAwEfx/Hn/fD6fz+fDMNTD/heLfT+UpmnqOl+8E9jtdrvd7unpab/fH4/Ha18mAP8lAACurOb0Tw/7nwfAtR72/4QXaw8ul0sFwDiO+/1+v9/Xq4B6M3DF6wRAAABcU9/3i8VisViM41jzfKYdPN98Le97appmPp/Xf7ppkcB+v398fNxutxoA4IoEAMAV1FT+vu/HcVwulxUAV5zf/zvU0uG+72ef1wns9/taxlCTgioMrn2ZAHEEAMC7qhnzi8ViuVzO5/PnT/0/4Pz+tzKtExiGYbVaHQ6Hx8fHx8fHp6enw+FgyyCA9yQAAN7J9Mh/Pp9PAXBLj/y/q23bmul0uVym1Q61QqCOFLj2BQJEEAAA76Hv++VyuVqtarbP9NT/2td1HU3TLBaLvu+ntwGbzWaz2dgwFOAdCACA36v29lksFqvVarVapT31/5p6GzCbzRaLReVQ13V1gMDxeDQpCOD3EQAAv1Gt8V2v18vlspb5xj71/5p6G9B13XK5fHp62m632+3WWcIAv48AAPgtaoL78wf/N7zG9xc1TTN+VhsHPT4+1toAGQDw5gQAwNsbx3G9XteD/9r40uj/NYZhWK/X8/l8tVptt9tPnz49PT1pAIC3JQAA3lLXdeM4rlaru7u71WpV09x5vXoDMI5j13VN07RtWwsDrn1dALdDAAC8mdrq5+7urh5j1xlY/IS2bVerVa2ffnh42G63+/3+2hcFcCPcnADeQNu2wzDUet+7uzsz/n9d27aLxaL9rBrAPqEAv04AAPyqtm1r6D9t82/0/1bq/5l1atjDw8Pj46MGAPhFAgDgl9Qe/zXjvw63uvYV3Zo6JaDWA3Rd9/T0dDgcrAwG+GluVAA/r3b7qdF/jVOvfUW3qd6x9H0/n883m83ff/+92+2ufVEAfyoBAPAz7Pbzztq2nc/nU2U9PDwcDge7AwH8BAEA8MPs9nMt9Sqg6uvTp0/b7VYDAPwoNy2AH1C7/dSkf7v9XEXXddUAtSrg8fHxcDhYGQzwegIA4LVqY8rValVH/Nrt54rGcby/v69TljebzW630wAAryQAAF6l5qDXtJ86o+raV5RuOi24aZrL5bLb7WwNBPAabmAA31fP/tfr9f39fc0/ufYVMZvNZl3XrVar2WxWQ38NAPAaAgDgO9q2rQ1/jP4/oFoScD6fL5fL5XLZ7/caAODbBADAtzRNU5v9G/1/WH3fr9frtm1ns1mtB9AAAN8gAAC+pe/72uzfKb8fWW3MWuuAz+fzfr+/9hUBfFxuZgBf1XVd7fi5Xq+N/j+4eg8wm81Op9P5fHY+AMDXuJ8B/LuaXF4zf4ZhuPbl8H31uuZ0Ol0ul81mowEA/pUAAPgXNfr/z3/+c39/P47jtS+H1xqG4f7+floPoAEAviQAAF6q0f9ff/11f38/n8+vfTn8mGEY1ut17Qu02WxOp9O1rwjgYxEAAP/Ds/8bMAzD3d1dbQy63W41AMBzAgDgH3Xg1/39vWf/f7ravLXeAzw+PmoAgIkAAPivpmkWi0XN/PHs/wbM5/OmaZqmmc1mGgBgIgAAZrPZrGma+Xy+Xq9ry/8aNfJHq/9OZ7NZvQfYbrcOCAOYCQCAMo7j3d1dzfwx+r8l4zj+9ddfl8vleDzudrtrXw7A9bXXvgCA6+v7frFYrNfr5XLZdd21L4e3VO8BVqtVneWs7gAEAJCujvut0b/jfm9SNcDd3Z3AA5iZAgRQ+34a/d+26ZDgw+HgdDAgnDcAQLSmacZxXC6Xi8XCs+EbVhu8rlar+Xzuv2ggnAAAcr2YHX7ty+H3atu2NnqyyxMQzg0PyNX3fe37adf/EMMw3N/fn89nOwIBybwBAELVnBA7/0SZ3vnM5/O2dQcEQvn6AxJNM8Kt/U3zfNWHBgAyue0Bifq+Xy6X6/Xa6D9Q13Xr9fp0Oh2Px/1+f+3LAXhv7nxAnHoGbOP/WLXx6/l83u12h8Phcrlc+4oA3pW3n0CW5zNAjP4zNU1TZz/XYgA7AgFp3PyALLXzz3q9tvNPuGEY1uv18Xis08GufTkA70cAAEHath3Hsdb+WgAarhaC136gp9PpfD5f+4oA3on7H5CiJv/U6H8YBhM/GIZhsVgsl8txHP19AHIIACBF13VGe7xQE4GcBQFEEQBAimEYlsuloR7PdV23Wq1sCAtEEQBAhLZth2GYz+cm//Bc0zT1F2McR8tCgBC+7IDbV4O8cRzHcfT4ny/VYgBzw4AQAgC4fbX818b/fE1NBDI9DAghAIDb1/d9nfxleMe/shIAiCIAgBtXe/+b5M03WAkARPE1B9yyGtgtFgvzf/iuaSWABgBum+844JZNj/9t/sN3dV1XG8UKAOC2+Y4DblnXdfP5fD6fm/3Pd00B4GURcNsEAHDLKgBs78hr1G5R9ooFbp4AAG7WtLLT/B9eqWmavu/7vvcXBrhhAgC4TdPhX8MwmNLN69Wh0RoAuGFuisBtatvW7H9+Qk0bWywWuhG4Vb7dgNs0BYBhHD+k67raN1Y6ArfKfRG4TV3X1YJOAcAPadvWwRHAbXNfBG5Q0zRd15nJzU+odcDDMHRd5y8PcJMEAHCDah2n5b/8tK7r+r739we4Sb7agFvjCS6/rm1b+4ECt0oAALfG439+Xdu21pAAt8r3GnBrprOcDN34afYCAm6YuyNwa7wB4NfZCwi4Ye6OwK2ZAsDsbX7atJJERgK3x/cacGtq3CYA+HVt2/pbBNweAQDclNq90QIA3kS9B7CdFHBj3CCB2zFN2zBvmzcx7QUkAIBbIgCA2zHt/2O4xptwGgBwkwQAcDuapmnb1rxt3krTNF3XmQIE3BgBANyOtm0N13hDkhK4SQIAuB1N0zgBgDc0TQHyNwq4Jb7RgNthuMbbsqoEuEnukcDtMFzjbXmnBNwk32jA7ag1AMZqvKH6SyUpgVviNgncDgHA71BLga99FQBvxjcacCNqlOZJLW+u1pZoAOBm+DoDbsE0V7vrumtfC7em67r5fL5cLodhUJjADeivfQEAr9I+U4Ow6ZF/GYZhtVp5TMub67putVo1TbPf74/H4/l8vnxWv08/z+fztS8W4PsEAPDR1cz+vu+Hz6YMqBn/FQA1T8MbAN5c13XL5XIcxxriT0P/0+l0PB6nn4fPrn29AN8hAICPqPtftbnnlwFQv1z7Yrlx0/ayz//wcrl8LQBOp1PlQf28XC7XunKAfyUAgI+lBls15Xo+n9dD/dqHsYb79YzfVGyuq/6idl33YgpQDfr3n+12u91upwGAD0UAANc3jez7z54HgLE+H9Y0/ezFn78IgOPxWG8JvBAAPgIBAFxZ3/fjOI7jOJ/P5/N57eQzufbVwc8Yx7H2DlqtVjVH6PHx8enpabfb1Ryha18gEE0AAFdQz/vrkf/4WQWAQT+3of6GD8Mwm80ul8swDOM47na7/X5fDVBsHAS8PwEAvLd6MrpYLObzeQ39azMfh/hyq5qmWSwWtVNtLReu2UFPT09PT08aAHhnAgB4P/VAtOb3VwA4uosQtdClXghUA+x2u2EY+r6v4wUsDwDejQAA3knf98vlcrVarVarcRxrBxULfAlUL7umxe673W5aIaABgHcgAIDfrh78T6N/E/1hOlug3onVARdd1+12O68CgN9NAAC/Vz34X6/XNfTv+95Ef5hMC2DGcRyGYbvdPj4+7vd7DQD8PgIA+C3qAecwDIvFogJgsViY8ANfapqmFgPUvljDMEwbhsoA4HcQAMDba5qmdkBfr9c1vcF5XvBt9anpuq5WBTw8PGw2m6enJw0AvDkBALyl2udkHMdpxn9tewJ8V70KKNPZ2HVugK1CgTckAIA303XdYrF4Pt2/733JwA/ruq7ieblcbrfbehXg/GDgrbg3A2+jpi7c3d3d3d0tl0srfeFX1EHC04a5bdtut1sNALwJAQC8gRr9//XXX3d3d/P53Ogf3kTbtsvlsvbOulwu2+3WXCDg1wkA4FfVRp/17N9WP/C22radz+ez2exyuTRN8/j4eDwer31RwJ9NAAC/pO/71WpVz/6HYTD6h99hHMf//Oc/9Spgs9loAOBXCADgJ9WOJcvl8v7+vmb+XPuK4GY1TTOOY9M09R5gu906JQD4aQIA+BnTTv93d3fr9dpen/AOhmG4v7+v9cGbzWa322kA4CcIAOCHtW07juN6vTb6h3c2DMN6vZ7NZjXdbr/fWxYM/CgBAPyYtm0Xi8Vqtbq/v18ul0b/8M76vl+v123bNk3z8PCw2+00APBDBADwA2pDknrwb/QP11KL72ezWdM0TdPsdjtHBACvJwCA16pn/+v1+v7+frFYOOUXrqhOC673AE3TOCoYeD33b+BVas+faeZP13XXviJIVwfw1e+n0+l8PlsTDLyGAAC+bxr9393dGf3Dx1FHBZ/P58PhUD81APBdAgD4vppsUKN/M3/gQ6m5eXd3d/USwBlhwHe5kQPfUVv+393d1Vm/174c4KVhGO7u7mr0fzqdvAQAvk0AAN9S54+uVqvVajWO47UvB/h3dT7A4XA4nU4OCAO+TQAA31KjivV6bfQPH9w4jvf39+fz+Xw+7/f7a18O8HEJAOCr+r6vucXL5bJt22tfDvAttRjgdDrV8cDmAgFf444O/Luu62rX/zrwq2maa18R8B21Mehff/21Xq/t1gV8jTcAwL+ofT9r8o/RP/xB6pDg0+lU6wG8BAC+JACAl6Zd/9fr9WKx8BwR/iC1bVctBT4ej04GAL5kChDw0rTrv9E//Ilq8671er1arXyEgS95AwD8j6ZpauGvXf/hz9X3/Xq9rpMBNpuNlwDAc94AAP+j7/v5fF4Lf699LcBPmk7wWC6X4zhaxgM8JwCAf9TOP4vFwugfbkAt5lkulyYCAc8JAOAftfH/YrGw6z/cgEr65XLZ92b8Av9wjwf+q+YMLJdLAQC3YfpQmwUEPOceD/xX3/fjOM7n877vjRXgNrRtOwzDfD7XAMBEAACz2bPZ/6YKwI2po8GsBAAmAgCYzZ7N/jdEgBvTtq2VAMBzAgAw+x9uWdu2VgIAz7nTA2b/w42zEgB4TgBAOrP/IYGVAMBEAEA6s/8hgZUAwEQAQDSz/yGElQDAxP0ecjVNU9OCzf6HBFYCAMV7QMjVtu00+r/2tQDvoVYCHA6H8/l8OByufTnAdXgDALlqSsA4jmb/Q4hpJYBPPSQTAJCr5gMMw2D2P4SYst+nHpL5/EOutm37vjf7H6K0bdt1nQCAZD7/kKvO/7IAANJoAAjnww+huq7r+77rOo//IU29/fPxh1gCABLV7H/LfyGTlQAQzicfEtUGoG7/kKnrutoAwBsAyOTeD4k8/4NkdgCDcD75kGja/8ftHwLVKeAmAUIs935I1DSNDUAhlgCAcAIA4tTo3yaAkKxeAw7DoAEgkNs/xKm7vum/EK7rOmuBIJPPPGSxAShQni8FNhsQoggACNI0zfTe3zM/CGcvIIjlMw9ZpgUAHvhBuOebAfhCgCgCALLYABQovg0gls88BKnnfF3XeQMAzGaztm0tAIBAAgCyTM/83PKB6XGALwSIIgAgS70B8MYfmH3eGMDoH9IYBECQes5XL/2vfS3AhzB9LVz7QoD34wMPQdzpgRc8FIBAPvAQxPJf4IVpY4BrXwjwfgQABDHZF3jBGwAI5AMPQWz5B7zQfHbtCwHejwCAIG7zwJd8M0AaAQBBPOoDvuRrAdIIAADI5bkABBIAABDN7sCQxgcegnjOB7zgMGAIJAAgiAAAvuQNAKTxgYcgJvsCAAIAAKJdLpfz+XztqwDejwCAIJfPrn0hwEdRo39fCxBFAEAQo3/gS94AQBoBAEEEAAAgACBIvejXAACQTABAEC/6gRcsDYJAAgCCuNMDX/K1AGkEAARxmwe+dD6fvRuEKAIAglgDALxw/uzaFwK8HwEAQWz4DbxwuVxOp9PpdLr2hQDvRwBAkHrOdzqdPO0DyvS1cO0LAd6PAIAgNf9HAACl3gqaAgRpBABkme73174Q4Ppq8o9pgZBGAECWab6vWz6Emx4H+DaANAIAgtT9vgLASwAId7lcjsfj8Xj0bQBpBABkmW75nvlBuOfvA30hQBQBAEHqDcDhcDgcDp75Qbjz+ewNAGQSAJBFAADlcrnUt4HH/5BGAECW6ZYvACDc6XQ6HA77/d46YEgjACCOs8CAWgBwOBzsCQaBBAAk0gAQrmYDWgAAmQQAJKrFf578QaZpKuDpdLr2tQBXIAAg0fl83u/3Nff32tcCvLd6/O8bAGIJAEhUc3/t/gGZ6hGAzQAglgCARDYDhWTTN4ApQJBJAECimgG83+/d/iHQdASYd4CQSQBAogqA3W7nJQAEOh6P+/3+eDxe+0KA6xAAEKoeAdoFHKLY/h+YCQBIdjqd7AUEUc7n82632+12Hv9DMgEAuaahgAeBEOJyuex2O9kP4QQA5DqdThUAlgJDCO/9gJkAgGTTXkAOBIAEl8ullv9a/Q/hBABEq8eBtR2QBoDbdjweLQAAZrNZf+0LAK7scDhst9u+77uu67ru2pcD/BZ1+u/T05PaB7wBgHTH43Gz2Wy3Ww8F4YYdj8ftdvv4+OiTDggASHe5XOq5oHWBcKtqwc/T09Nut/MxBwQA8N8GeHx83O/35gbAjanR/+Pj49PTk8f/wEwAAGWaHmBLULgxtfe/2f/ARAAAs9lsdjqdttvtZrPxgBBuzPF4rMf/8h4oAgCYzT5PEnBEKNwYH23gSwIA+EctE7QSAG7DtPbX7H/gOQEA/KMmAlkJALfhcrk8PT1tt1uz/4HnBADwDysB4JbU5j/2/gdeEADAP6bpwjYLhz9dHf1re1/gSwIAeGnaMlwDwB/qfD7X5J/dbmdGH/BCf+0LAD6cmgjU933XdfP5/NqXA/ywOtnDdD7gXwkA4KXT6fT4+Ng0TTVA3/uigD/J6XSqx/8W9AP/yn0deOlyudTJQcMwtG27Xq+7rrv2RQGvUpN/NpuNtb/A1wgA4N8dj8dPnz41TdN13Wq1aprm2lcEfEft+/n3339/+vRpv99f+3KAD0oAAP/ucrns9/uHh4eu69q2XSwWGgA+svrM1tT/p6cnO/8AXyMAgG/Z7XZ///13vQcYx/HalwN81eFw2Gw2Dw8Pu93O6B/4BgEAfEvNKKjRfy0L9h4APqBat/Pw8GDhL/BdzgEAvmOaVfzw8GBNIXxAtXPXw8PDdrs9HA4e/wPf5g0A8H11MkC9B/ASAD6U2vbH6B94PW8AgO+7XC51PHAdLGqEAR/EtOlnLfx1ejfwGt4AAK9SG4xsNpu2bdu2tSAYPoI68ffh4cHoH3g9AQC81ul02mw2s9msNgZ1QjBcVy38rTO/LPwFXs/9G3itOiG4FgPMZrPlcllHBV/7uiDO+Xyu0f+nT5+c+Av8KAEA/JjD4fDp06fj8Xg8HtfrtQPC4J3VvP868Ovx8dGJv8CPEgDADzscDufz+XK5nM/n8/m8WCzqnQDwu51Op2nV73a79ewf+AkCAPgZtTHo+Xw+nU7n83m1WmkA+N3qc/fw8FDH/Zr3D/wcAQD8pKkB6m1ALQm49kXBzZom/deeP3bjBX6aAAB+3uVy2e12tR7xeDze399rAPgdDofD9Ox/v98b/QO/QgAAv+R8PtdUhMvl0jTNarUax9GyYHhD+/1+u91++vTJSXzAmxAAwBs4Ho+bzaYODL6/v7c1ELyV/X5fD/43m83hcDD6B36dAADeRjVAnUV6Op3m83nf9zIAftrpdKpn/w8PD9vt1nafwFsRAMCbqWXBx+Nxt9ut1+vVajWfzzUA/IRa8lsP/m34A7wtAQC8pTqi6PTMOI5eBcAr1da6h8Nht9vVs3+T/oE3JwCAt3c4HGq+8m63W61WXgXAa0xzfp6enh4fHw+Hg0n/wO8gAIDf4vi/6pSAYRicFwZfmp76Pz09VQCY8Q/8PgIA+I32+33tE7rZbJbL5Xq9Xi6Xfe+bB/5R0/232+3j4+N+vz8cDsfj8doXBdwyt2Hg96o3ALvd7nA41GPOWhXgbQDh6gS9evBfAWCxL/A+BADwHurM4NomaBiGxWJR2wRpADKdTqda5vv4+Fh5fDweaxddgN9NAADv5Hw+7/f7/X7fNM1+vz+dTufzeRzH7rNrXyD8drU1Vj34n6b9mPADvDMBALy3y+VSW4Xudrv5fD6fzxeLxWKxsDaA23Y8Hp+enmqB736/n+bFXfu6gDhut8AVXC6XWuxYDVDjoeltQNu2XdfZNpQ/3eVyqX396+d+v398fKwAOB6Phv7AtQgA4GoqA+pVwGaz6ft+/KzeDGgA/lzn8/lwONST/srdUj1gd3/gigQAcGU1K7p2PX8RAH3ft581TVO/XPt64V9cLpca2U/qb/XzALDGF/ggBADwgUwvBLbbbdd1tVvoMAx93087h5ogxIdSY/1a1zvt4l9b+pw+88gf+FAEAPCx1IDpcDjMZrOmab4WAM/fDJT6tz//HX5dDdynn196vrHPFACn08mIH/iwBADwcdUigePx+OVwv2YEVRvUn89msxfThKYYqIHaTB7wg2p8P43+p7k99bP+5PlPD/uBP4IAAD66GlGdTqdplF9/3rbt6XTq+77OEJiqQADwVr4MgOezesrsi7cE171mgO8SAMAf4F+HVtNMIQDg9eynAQAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABBEAAAAQBABAAAAQQQAAAAEEQAAABDk/wG844piAAx1qQAAAABJRU5ErkJggg==';

var img$4 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNkU5MzIyQjNFRjkxMUU4OUE0M0U4M0YxQkQxQzU0OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNkU5MzIyQzNFRjkxMUU4OUE0M0U4M0YxQkQxQzU0OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RTkzMjI5M0VGOTExRTg5QTQzRTgzRjFCRDFDNTQ4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RTkzMjJBM0VGOTExRTg5QTQzRTgzRjFCRDFDNTQ4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Z2gYLwAAABVQTFRFEpbcEZbaEpbaEpfaEpfbEpbbAAAA6HZvrgAAAAd0Uk5T////////ABpLA0YAAABXSURBVHja7NUxDsAgDENRp8S5/5HLippWeEAVKH9+E4oMQggRhjF+4MZHr5jOaY2E0hR8LcN5Eia3xOIhCdibT3f+OxcuXPhPDIQw/X3rhG9CGcZbgAEA31Emi0ADzuAAAAAASUVORK5CYII=';

var img$5 = 'data:image/png;base64,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';

var img$6 = 'data:image/png;base64,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';

var img$7 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAGcUlEQVR4nO3dsWpbZxjGcV2CLyGX4EvIJfhSNESngQzOUsQRBGlpEe1gDAG3UBxI6dCaxEMMLdSQgj0ZTPCQIUudyXh7OxwLu4nzRkc60vt83/d/4Lebj+8f6Vi20+sxxhhjjDHGGGOMMcbuzMb9DRsNNq2utqyuxjYaHCLAi+f96LvAPtlNGG+trgzB/vnLiERkNu5vWF31ra4uwy8GbgMhEo3ZsHoafiFwfyBEEjsbPnpovHLouRsIkcTs5q0VzxyKPg2ESNY/a5474i8D5guESNY7Gw0Owy8C2gVCJOub1dW78IuA9oEQyepnw8cPwi8BFg+ESFY7AhE3TyBEsroRiLh5AyGS1YxAxLUJhEi6H4GIaxsIkXQ7AhG3SCBE0t0IRNyigRBJNyMQccsEQiTLj0DELRsIkSw3AhHXRSBEsvgIRFxXgRDJYiMQcV0GQiTtRyDiug6ESNqNQMStIhAimX8EIm5VgRDJfCMQcasMhEi+PgIRt+pAiMQfgYhbRyBE8uURiLh1BUIk949AxK0zECL5fAQibt2BEMn/RyDiIgIhktsRiLioQIikGYGIiwyESAhEXnQgpUdCIOKi4yg9EgIRFx1G6ZEQiLjoKEqPhEDERQdReiQEIi46htIjIRBx0SGUHgmBiIuOoPRICERcdAClR0Ig4qIvf+mREIi46ItfeiQEIu7P1/EXv+RICETcH/vxl77kSAhE3C878Re+5EgIRNz338Zf9pIjIZAEpPg2K5dICCQBz56k97CeSyQEkogfR/EXvcRICCQhz56Yvf41/rKXFAmBJOinH8ze/B5/4UuIhEAStzMxe/5dWsb9jeh7P/cIBGs3fPwg+t7PPQLB2hEI4CAQwEEggINAAAeBAA4CARwEAjgIBHAQCOAgEMBBIICDQAAHgQAOAhFwdGB2dqrh5Lj5en772Wx/12xvGn8+BDLfsg3k7NTkd3LcBBN9VgTy5RGIwK6vmleX6DMjkM9HIEL78L75FdrosyOQ2xGI4HJ/RiEQASkHYpZ3JAQiIPVAzMymw/hzJBACkd3Fefw5EgiBSC/H724RiIBcArm+ij9LAhE4tOhA9qbNt1i7sr/b/Os/+0R/meX2YSKBCGh7KSfbq/16dibNJ+eL7OQ4/jwJJDNqgczsTdsHktvbLAIRoBpIXTVvvdoup0/YCUSAciB11fxYSZu9ehl/pl0hEAHqgbR9FTk6iD/TrhCIAPVAJtvtvr6z0/gz7QqBCFAPpK6ah28C0R6BBAbS5jnkw/v4M+0KgQhIIZCLcwJRH4EkEkhOP7hIIAJSCOTjv/N/fTyDxIxAggKZbLd7SM/px00IRIB6IPu77b4+PgeJGYEEBdL2Bxdz+hVcAhGgHMjOpN3bK35YMW4EsuZApsN2D+dmeT2g1xWBSFALZG9q9vebdq8cs/ELU3EjkDuXcG/ajdlvE7562URxcb5YGGbNq030WRKIwKFFB6K6nL57RSBCcgjk4jzmA0wCuR2BiO76Kq/fIiQQMakHkuPfwyIQIakGUsJ/hUAgAlIMpIQ4CEREaoFcnOf7zEEgglIJ5OK8jFcNAhGjGsj1VRPF0UE5rxgEIqhtILP/gXYVZn/3N8fPNAgkUWo/i4VbBCKAQHQRiAAC0UUgAghEF4EIIBBdBCKAQHQRiAAC0UUgAghEF4EIIBBdBCKAQHQRiAAC0UUgAghEF4EIIBBdBCKAQHQRiAAC0UUgAghEF4EIIBBdBCKAQHQRiAAC0UUgAghEF4EIIBBdBCKAQHQRiICjg+bvT82LQNaHQAAHgQAOAgEcBAI4CARwEAjgIBDAQSCAg0AAB4EADgIBHAQCOAgEcBAI4CAQwEEggINAAAeBAA4CARwEAjgIBHAQCOAgEMBBIICDQAAHgQAOAgEcBAI4CARwEAjgIBDAQSCAg0AAB4EADgIBHAQCOAgEcBAI4CAQwEEggINAAAeBAA4CARwEAjgIBHAQCOAgEMCRVCDj/kb4gaEsKQXS6/V6Vlfvwg8NpbiMvu+tZ3X1QuDgUILR4DD6vreeDaun4QeHUoyj73vr3TyHXAocHvJ2aeP+RvR9X2g2fPRQ4ACRt63oe77UjGcRrMrom53o+93JeB5Bxy6trsbJvrW6bzYabBrf+sXy3lrqb6u8WV1tWV31ra7GNhocAl/VvE3v22iwmdWrBmOMMcYYY4wxxhhjnew/V+h2NheIrSAAAAAASUVORK5CYII=';

var img$8 = 'data:image/png;base64,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';

var img$9 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAgAElEQVR4nOzd53Zc953v6W/lHFEAGMAMRpGSLXf3nLmCeTF3O7cxfc6Zc7pttxwk2xIpJgBEBgoFYF4wtOx2UCBZIPfzeHlRFiXxx2UtoPZn/0Pp//p//u/TAAAAAB+18rwHAAAAAN49AQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACAAhAAAAAAoAAEAAAAACgAAQAAAAAKQAAAAACA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AAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAIABAQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgQAAAAADAgAAAAACAAQEAAAAAAwIAAAAABgQAAAAADAgAAAAAGBAAAAAAMCAAAAAAYEAAAAAAwIAAAAAAgAEBAAAAAAMCAAAAAAYEAAAAAAwIAAAAABgII+goXGvXRtYAAAAASUVORK5CYII=';

var img$10 = 'data:image/png;base64,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';

var img$11 = 'data:image/png;base64,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';

var img$12 = 'data:image/png;base64,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';

const style$1 = [{
  types: ['others', 'file'],
  base64Url: img$3
}, {
  audio: img$1
}, {
  excel: img$2
}, {
  image: img$5
}, {
  pdf: img$6
}, {
  virtual: img$12
}, {
  ppt: img$7
}, {
  text: img$8
}, {
  video: img$9
}, {
  word: img$10
}, {
  zip: img$11
}, {
  folder: img$4
}].map(it => {
  const types = it.types || Object.keys(it);
  const value = it.base64Url || it[types[0]];
  return `${types.map(type => `.icon-file-type-${type}`).join(',')}{background:url(${value})}`;
}).join('');
const Base64IconStyles = React.createElement("style", null, style$1);

let _element;

function initPage(element, config) {
  initApi(config.api);
  initUtils(config);
  initRouter(config.router);
  _element = element;
  render(React.createElement("div", null, Base64IconStyles, React.createElement(NetDisk, null)), element);
}
function destroyPage(element) {
  unmountComponentAtNode(element);
}
function getRootElement() {
  return _element;
}
function initSharePage(element, config) {}
function destroySharePage(element) {}

export { destroyPage, getRootElement, initSharePage, destroySharePage, setOnFullScreenChange };
export default initPage;

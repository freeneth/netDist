import {current} from "../modules/current"
import {throttle} from "../util/utils"
import {getRootElement} from "../main"

let isFileUpload = true

export function generateCouldDragFileNode (fileInfo, moveOrCopy) {
  const draggable = !fileInfo._isFolder && !fileInfo._isVirtual && !fileInfo._onUpload

  return {
    onDrop: (e) => {
      if (draggable) {
        return
      }
      isFileUpload = true
      const id = e.nativeEvent.dataTransfer.getData('id') |> Number.parseFloat
      const needMoveFileDetail = current.folder.sub.find(fd => fd.id === id)
      const targetFolder = fileInfo._isVirtual ? fileInfo._relNode._parentNode() : fileInfo
      moveOrCopy(needMoveFileDetail.alsoPrint())(targetFolder.alsoPrint(), 'move')
      e.stopPropagation()
    },
    onDragStart (e) {
      e.nativeEvent.dataTransfer.setData('id', fileInfo.id)
      e.nativeEvent.dataTransfer.dropEffect = 'move'
      e.nativeEvent.dataTransfer.effectAllowed = 'move'
      const image = e.nativeEvent.target.querySelector('.main .icon')
      e.nativeEvent.dataTransfer.setDragImage(image, 22, 22)
    },
    draggable,
    title: draggable ? '拖拽此处移动文件' : ''
  }
}

/**
 * 上传拖放
 */
export function bindUpload (setShowUploadContainerState) {
  const dropBox = getRootElement()

  const updateShowUploadContainer = throttle((show) => {
    setShowUploadContainerState(show)
  }, 80)

  let countOfShow = 0
  let countOfHide = 0
  const showOrHideUploadContainer = (showOrHide) => {
    if (showOrHide === 'show') {
      countOfShow ++
    } else {
      countOfHide ++
    }
    updateShowUploadContainer(countOfShow > countOfHide)
  }

  dropBox.addEventListener('dragstart', function (e) {
    isFileUpload = false
  })
  dropBox.addEventListener('dragend', function (e) {
    isFileUpload = true
  })

  dropBox.addEventListener('dragenter', function (e) {
    isFileUpload && showOrHideUploadContainer('show')
    e.preventDefault()
  })

  dropBox.addEventListener('dragover', function (e) {
    e.preventDefault()
  })

  dropBox.addEventListener('dragleave', function (e) {
    isFileUpload && showOrHideUploadContainer('hide')
    e.preventDefault()
  })

  dropBox.addEventListener("drop", (e) => {
    isFileUpload && showOrHideUploadContainer('hide')
    e.preventDefault()
  });
}

export const handleUploadContainerDrag = (() => {
  let enterCount = 0
  let leaveCount = 0
  return (eventName, setCouldMouseUpState) => {
    if (!isFileUpload) {
      return
    }
    if (eventName === 'enter') {
      enterCount ++
    } else {
      leaveCount ++
    }
    setCouldMouseUpState(enterCount > leaveCount)
  }
})()

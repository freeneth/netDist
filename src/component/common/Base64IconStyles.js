import React from "react";

import audio from '../../common/img/audio.png'
import excel from '../../common/img/excel.png'
import file from '../../common/img/file.png'
import folder from '../../common/img/folder2.png'
import image from '../../common/img/image.png'
import pdf from '../../common/img/pdf.png'
import ppt from '../../common/img/ppt.png'
import text from '../../common/img/text.png'
import video from '../../common/img/video.png'
import word from '../../common/img/word.png'
import zip from '../../common/img/zip.png'
import virtual from '../../common/img/backward.png'

const style = [
  {types: ['others', 'file'], base64Url: file},
  {audio}, {excel}, {image}, {pdf}, {virtual},
  {ppt}, {text}, {video}, {word}, {zip}, {folder}
]
  .map(it => {
    const types = it.types || Object.keys(it)
    const value = it.base64Url || it[types[0]]
    return `${types.map(type => `.icon-file-type-${type}`).join(',')}{background:url(${value})}`
  })
  .join('')

export const Base64IconStyles = <style>{style}</style>

import React from 'react'

const style = {width: '100%', height: '100%'}

export function VideoContainer (props) {
    return <video src={props.content} controls={true} style={{maxWidth: '100%', maxHeight: '96%'}}/>
}

export function PdfContainer (props) {
  return <embed src={props.content} style={style}/>
}

export function DocContainer (props) {
  const url = do {
    if (window.hostParams && hostParams.host.length > 1) {
      `http://${hostParams.host[1]}/file?id=${props.payload.fileId}&filename=doc.docx`;
    } else {
      `http://api.qingkaoqin.com:33362/file?id=${props.payload.fileId}&filename=doc.docx`;
    }
  }
  const src = `http://api.idocv.com/view/url?url=${encodeURIComponent(url)}`
  // const src = `http://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
  return <iframe src={src.alsoPrint()} style={style} frameBorder={0}/>
}

export function IFrameContainer (props) {
  return <iframe src={props.content} style={style} frameBorder={0} />
}

export function AudioContainer(props) {
  return <audio src={props.content}/>
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

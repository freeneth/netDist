import React from 'react'
import './FileUploadPercent.pcss'

export const FileUploadPercentState = {
  Down: 'down',
  Error: 'error',
  Processing: 'processing'
}

export default class FileUploadPercent extends React.Component {
  constructor () {
    super()
  }

  render () {
    const {
      percent,
      state = FileUploadPercentState.Processing,
      duration = 400
    } = this.props
    
    return (<div className={'-upload-percent'}>
      <div className={`-upload-percent-inner ${state}`} style={{
        width: `${percent}%`,
        transition: `all ${duration}ms linear, opacity .25s cubic-bezier(.71,-.46,.29,1.46)`
      }}/>
    </div>)
  }
}

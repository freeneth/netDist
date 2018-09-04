import React from 'react'
import './LightButton.pcss'

export class LightButton extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    const {text, children, className, ...others} = this.props

    return <div className={`-light-btn ${className}`} {...others} ref={'lightButton'}>
      {text}
      {children}
      <div className={'light'}/>
    </div>
  }

  componentDidMount () {
    const domLightButton = this.refs.lightButton
    const domLight = domLightButton.querySelector('.light')
    domLightButton.addEventListener('mousemove', (e) => {
      domLight.style.visibility = 'visible'
      domLight.style.top = domLightButton.offsetTop + 'px'
      domLight.style.left = e.clientX + 'px'
    })
    domLightButton.addEventListener('mouseleave', (e) => {
      domLight.style.visibility = 'hidden'
    })
  }
}
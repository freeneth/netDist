import React from 'react'
import {render} from 'react-dom'
import './LoadingBar.pcss'
import {delay} from "../../util/delay"

/* ********
 * 该文件未使用到
 ******** */

let _update

const LoadingBarState = {
  Down: 'down',
  Error: 'error',
  Processing: 'processing'
}

function renderLoadingBar () {
  const dom = document.createElement("div");
  document.body.appendChild(dom);

  class LoadingBar extends React.Component {
    constructor () {
      super()
      this.state = {
        percent: 0,
        state: LoadingBarState.Processing,
      }
      _update = ::this.update
    }

    update (percent, isError) {
      this.setState({
        percent
      })
      if (percent >= 100) {
        isError ? this.error() : this.down()
      }
    }

    async down () {
      await delay(500)
      this.setState({
        state: LoadingBarState.Down
      })
      await delay(500)
      this.setState({
        percent: 0,
      })
      await delay(300)
      this.setState({
        state: LoadingBarState.Processing,
      })
    }

    async error () {
      this.setState({
        state: LoadingBarState.Error
      })
      await delay(1000)
      this.setState({
        percent: 0,
      })
      await delay(300)
      this.setState({
        state: LoadingBarState.Processing,
      })
    }

    render () {
      const {state, percent} = this.state
      return (<div className={'-loading-bar'}>
        <div className={`-loading-bar-inner ${state}`}
             style={{width: `${percent}%`}}/>
      </div>)
    }
  }

  render(
    <LoadingBar/>,
    dom
  );
}

renderLoadingBar()

const start = () => _update(99)
const finish = () => _update(100)
const error = () => _update(100, true)
const update = (percent) => _update(percent)

const LoadingBar = {
  start,
  finish,
  error,
  update
}
export default LoadingBar

window.LoadingBar = LoadingBar
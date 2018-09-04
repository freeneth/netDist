import React from 'react'
import { isArray } from "../util/object-utils"
import './InputTree.pcss'

export class InputTree extends React.Component {
  constructor (props) {
    super(props)

    props.onInput(props.currentFolder)
    this.state = {
      currentNode: props.currentFolder,
      showPopBox: false
    }
  }

  render () {
    // tree: Tree: {id: string | number, name: string, sub: Array<Tree>} | Array<Tree>
    const {tree, onInput} = this.props
    const {currentNode, showPopBox} = this.state

    // make tree
    const makeNodes = (tree, level) => {
      const handleNodeClick = (node) => {
        this.setState({
          currentNode: node,
          showPopBox: false
        })
        onInput(node)
      }

      return tree.map(it => it.name && <div
        className={'-tree-group'}
        key={it.id}>
        <div className={'-tree-node'} style={{paddingLeft: 18 * (level - 1)}}
             onClick={() => handleNodeClick(it)}>
          <i className={'-arrow down'}/>
          {it.name}
        </div>
        {it.sub && makeNodes(it.sub, level + 1)}
      </div>)
    }
    const Tree = makeNodes(isArray(tree) ? tree : [tree], 1)

    return (<div className={'-input-tree'}>
      <input className={'-input'}  value={currentNode.name} readOnly={true}
             onClick={() => this.setState({showPopBox: true})}/>
      <i className={`-arrow -selector-arrow ${showPopBox ? 'down' : ''}`}/>
      {showPopBox && <div className={'-event-mask'}
                          onClick={() => this.setState({showPopBox: false})}/>}
      <div className={`-pop-box ${showPopBox ? 'show' : ''}`}>{Tree}</div>
    </div>)
  }
}

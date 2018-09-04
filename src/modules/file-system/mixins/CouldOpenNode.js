import {VirtualNode} from "../VirtualNode"

export class CouldOpenNode {
  /**
   * 进入某个文件夹
   */
  async open (callback) {
    const node = do {
      // 保存当前文件夹到 current
      if (this instanceof VirtualNode) {
        this._relNode._parentNode()
      } else {
        this
      }
    }

    if (node._opened) {
      callback(node)
      return
    }

    // 非根节点添加返回上一级
    if (!node.isRoot) {
      node.sub.unshift(new VirtualNode(node))
    }

    node.initSub()
    callback(node)
    await node.loadSub()
    callback(node)
    node._opened = true
  }
}

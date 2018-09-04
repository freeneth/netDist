import api from "../../../api"
import {doubleMap} from "../../../util/utils"
import {current} from "../../current"

/**
 * @property fileSystem FileSystem
 */
export class CouldRemoveNode {
  async remove() {
    console.log('enter')
    const node = this
    const {id} = node

    // 先删文件系统
    this.fileSystem.deleteNodeById(id)
    await api.patchFileSys(current.fileSystem)

    console.log(node)
    // 节点 ids
    const nodeIds = do {
      if (node._isFolder) {
        const nodeIds = []
        node.forEach(file => {
          if (!file._isFolder && !file._isVirtual && !file.sub) {
            nodeIds.push(file.id)
          }
        })
        nodeIds
      } else {
        [node.id]
      }
    }

    // 文件详情 （用于获取 fileId和 hash）
    const fileInfos = do {
      if (node._isFolder) {
        await api.getFileInfos(nodeIds)
      } else {
        [node]
      }
    }

    // 再删文件详情
    await api.deleteFileInfo(nodeIds)

    // 该文件存在复制的情况，仅引用减一，不删文件
    const counts = await Promise.all(
      fileInfos.map(info => api.decrementReferenceCount(info.fileId))
    )

    // 生成可以删除的文件列表
    const couldDeleteFileDetails = fileInfos.filter((_, i) => counts[i] <= 0)
    if (couldDeleteFileDetails.length === 0) {
      return
    }
    const [couldDeleteFileIds, couldDeleteNodeHashs] =
      doubleMap(couldDeleteFileDetails, info => [info.fileId, info.hash])

    console.log(couldDeleteFileDetails)

    // 再删文件哈希
    await api.deleteFileHash(couldDeleteNodeHashs.filter(i => i))

    // 最后删文件
    await api.deleteFile(couldDeleteFileIds.alsoPrint('所删除的文件id为：'))
  }
}

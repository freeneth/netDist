import React from "react";
import {flexMixin} from "../util/helper";

export default class TitleBar extends React.Component {
  render () {
    return (<div style={styles.top}>
      <div style={styles.file}>
        <div style={styles.file.name}>文件名</div>
        <span style={styles.file.block} />
      </div>
      <div style={styles.info}>
        <span style={styles.info.item}>大小</span>
        <span style={styles.info.item}>更新人</span>
        <span style={styles.info.item}>更新时间</span>
        <span style={styles.autoGrow} />
      </div>
      <div style={styles.operators} />
    </div>)
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
      flex: 'none',
    },
    block: {
      display: 'block',
      width: 652,
    }
  },
  info: {
    flex: 10,
    item: {
      flex: 1,
      minWidth: 82,
      justifyContent: 'center'
    },
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

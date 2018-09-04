import initPage from '../src/main'

const fidA = window.location.search.match(/fid=([^&]+)/)
const fid = fidA && fidA.length >= 2 ? fidA[1] : null

if (!fidA) {
  window.history.pushState(null, null,
    window.location.search.length > 0
      ? window.location.href + '&fid=null'
      : window.location.href + '?fid=null'
  )
}

initPage(
  document.getElementById('root'),
  {
    router: {
      initFolder: fid,
      targetFolderChange (val) {
        window.history.pushState(null, null,
          window.location.href.replace(/fid=([^&]+)/, `fid=${val}`))
      }
    },
    isFullScreen: false,
    onFullScreenChange (handleFullScreenChange) {
      //进入全屏
      document.onkeydown = (e) => {
        if (e.keyCode === 122 && window.screen.height !== window.innerHeight) {
          if (e.keyCode === 123) {
            return;
          }
          handleFullScreenChange ({
            sider: true
          })
        }
      }
    }
  }
);

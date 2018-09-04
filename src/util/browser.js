/**
 * @see http://www.zhangxinxu.com/wordpress/2017/07/js-text-string-download-as-html-json-file/
 * browser
 * change logs:
 * 2018/2/4 herbluo created
 */
export function downloadFile (fileName, href) {
  const eleLink = document.createElement('a')
  eleLink.download = fileName
  eleLink.style.display = 'none'
  eleLink.href = href
  eleLink.click()
}

export function downloadBlob (fileName, content, blobOptions = {}) {
  // blobOptions = {
  //     type: 'text/csv',
  //     endings: 'native' // or transparent
  // };

  const blob = new Blob([content], blobOptions)
  const a = document.createElement('a')
  a.innerHTML = fileName;
  a.download = fileName;
  a.href = URL.createObjectURL(blob);

  document.body.appendChild(a);

  const evt = document.createEvent("MouseEvents")
  evt.initEvent("click", false, false);

  a.dispatchEvent(evt);

  document.body.removeChild(a);
}

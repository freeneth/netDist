export const router = {
  initFolder: '',
  targetFolderChange: () => {},
  onRouterChange: () => {}
}

export function initRouter(_router) {
  Object.assign(router, _router)
}
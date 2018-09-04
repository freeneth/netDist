import localStorageApi from './localStorageAdapter'
import ldbnApi from './ldbnAdapter'

const api = process.env.NODE_ENV === 'production'
  ? ldbnApi
  : localStorageApi

export default api

window.api = api

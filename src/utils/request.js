import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})
// request interceptor
request.interceptors.request.use(
  config => {
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (getToken()) {
    config.headers['X-Token'] = getToken()
  }
  return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  })

// response interceptor
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 401) {
      notification.error({
        message: '登录过期',
        description: '即将跳至登录页'
      })
      store.dispatch('Logout').then(() => {
        window.location.reload()
      })
    }
    if (response.config.url === '/grade/export' || response.config.url === '/grade/rankExport') {
      console.log('aaawf')
      return response
    }
    if (res.code !== 200) {
      notification.error({
        message: res.code,
        description: res.message
      })
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('erroraaa')
    } else {
      return response.data
    }
  },
    error => {
      console.log('err' + error) // for debug
      notification.error({
        message: '错误',
        description: error.message
      })
      return Promise.reject(error)
    }
  )

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}

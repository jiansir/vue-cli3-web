import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui' //element-ui的提示框组件
axios.defaults.baseURL = process.env.API_BASE_URL
axios.defaults.timeout = 12000 // 请求超时时间

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded; charset=UTF-8' //post请求头设置

//axios请求拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },
  error => {
    // error 的回调信息,自定义提示
    Message({
      showClose: true,
      message: error && error.data.error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)
//统一跳转登录方法
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          toLogin()
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Message({
            showClose: true,
            message: '登录过期，请重新登录',
            type: 'error'
          })
          // 清除token
          localStorage.removeItem('token')
          store.commit('loginSuccess', null)
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            toLogin()
          }, 1000)
          break

        // 404请求不存在
        case 404:
          Message({
            showClose: true,
            message: '网络请求不存在',
            type: 'error'
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          Message({
            showClose: true,
            message: error.response.data.message,
            type: 'error'
          })
      }
      return Promise.reject(error.response)
    }
  }
)
//get方法
export const get = (url, data) => {
  let defaultConfig = {
    url,
    method: 'GET',
    params: data
  }
  let config = { ...defaultConfig, ...extend }
  return axios(config).then(res => {
    return Promise.resolve(res)
  })
}
//post方法
export const post = (url, data, extend = { isJson: true }) => {
  let defaultConfig = {
    url,
    method: 'POST',
    data: extend.isJson ? data : qs.stringify(data)
    // 通过isJson来确定传参格式是json还是formData，默认是json
  }
  let config = { ...defaultConfig, ...extend }
  return axios(config).then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

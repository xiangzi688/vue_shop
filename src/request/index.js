import axios from 'axios'
// 导入进度条工具
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://120.79.10.35:8360/api/private/v1/'

// 在request 拦截器 展示进度条，Nprogress.start
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//  在response 拦截器 隐藏进度条，Nprogress.done
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

export default axios

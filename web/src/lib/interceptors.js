// 接口请求拦截
import axios from 'axios'
export const $axios = axios.create()
$axios.defaults.timeout = 5000
// 拦截请求
$axios.interceptors.request.use(
  config => {
    // 如果是登录的接口就跳过
    if (config.url === '/api/user/login') {
      return config
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 拦截响应
$axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response) {
      // 拦截状态码
      switch (err.response.status) {
        case 400:
          // 这里写清除token的代码
          console.log(err);
          break
      }
    }
    return Promise.reject(err)
  }
)

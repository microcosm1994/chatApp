// 接口请求拦截
import axios from 'axios'
import config from './config'
import {message} from 'antd'

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
            // 错误信息
            let m = err.response.data.error
            // 拦截状态码
            switch (err.response.status) {
                // 服务器不理解请求的语法
                case 400:
                    break
                // 身份验证不通过
                case 401:
                    message.error(m)
                    window.location.href = config.domain + '/login'
                    break
                // 拒绝请求
                case 403:
                    message.error(m)
                    window.location.href = config.domain + '/login'
                    break
                default:
                    break
            }
        }
        return Promise.reject(err)
    }
)

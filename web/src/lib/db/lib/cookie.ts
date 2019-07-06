import utils from './utils'
/**
 * 进行cookie相关的操作
 * @interface:setCookieOptions
 * */
interface setCookieOptions {
    expires: number, // cookie过期时间
    path: string, // cookie保存路径
    domain: string, // cookie保存域名
    secure: boolean // 是否开启安全模式
}
/**
 * 进行cookie相关的操作
 * @class:cookie
 * @constructor
 * @param:无
 * */
class cookie {
    constructor() {
        this.cookies = this.getCookie()
    }
    /**
     * 获取所有cookie
     * @method:getCookie
     * @param:无
     * @return:{object} 返回处理后的cookie对象
     * */
    getCookie () {
        let cookieArr = {}
        document.cookie.split(';').forEach((res) => {
            if (res) {
                let arr = res.split('=')
                cookieArr[utils.trim(arr[0])] = utils.trim(arr[1])
            }
        })
        return cookieArr
    }
    /**
     * 获取指定的cookie
     * @method:get
     * @param:{string} name:cookie名称
     * @return:{string} 返回cookie的值
     * */
    get (name:string) {
        let cookie = this.cookies[name]
        return decodeURIComponent(cookie)
    }
    /**
     * 设置或覆盖cookie
     * @method:set
     * @param:{string, any, object}
     *         key:cookie名称, value:cookie值, options[expires]:cookie保存时间，options[path]:cookie保存路径，options[domain]:cookie保存域名，options[secure]:是否开启安全模式
     * @return:{string} 返回true或者false
     * */
    set (key:string, value:any, options?:setCookieOptions) {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false
        let sExpires:string = ''
        if (options) {
            if (options.expires) {
                sExpires = options.expires === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + options.expires
            }
            document.cookie = encodeURIComponent(key) + '=' + value + sExpires + (options.domain ? '; domain=' + options.domain : '') + (options.path ? '; path=' + options.path : '') + (options.secure ? '; secure' : '')
        } else {
            if (value) {
                document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value)
            } else {
                if (!this.hasCookie(key)) return false
                if (options) {
                    document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( options.domain ? '; domain=' + options.domain : '') + ( options.path ? '; path=' + options.path : '')
                } else {
                    document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                }
            }
        }
        return true
    }
    hasCookie (key) {
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
    }
}
export default new cookie()

// 验证用户
module.exports = (options, app) => {
    return async function userVerif (ctx, next) {
        let url = ctx.request.url
        // 如果是白名单列表中的接口直接放过
        if (options.whiteList.includes(url)) {
            await next()
        } else {
            let token = ctx.cookies.get('t')
            let uid = ctx.cookies.get('uid')
            let redisToken = await app.redis.get(uid)
            if (token && redisToken) {
                if (token === redisToken) {
                    await next()
                } else {
                    ctx.status = 401
                    ctx.body = {
                        error: '用户验证不通过，请重新登陆'
                    }
                }
            } else {
                ctx.status = 401
                ctx.body = {
                    error: '用户验证不通过，请重新登陆'
                }
            }
        }
    }
}

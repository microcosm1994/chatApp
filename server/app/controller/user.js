const Controller = require('egg').Controller;

class User extends Controller {
    // 注册
    async register() {
        const { ctx } = this;
        let form = ctx.request.body
        await ctx.service.user.create(form).then((data) => {
            if (data[1]) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '账号已经被注册'
                }
            }
        })
    }
    // 登陆
    async login() {
        const { app, ctx } = this;
        // 过期时间
        let time = 3600 * 24 * 30
        let {username, password} = ctx.request.body
        // 加密密码
        password = await ctx.service.utils.sha256(password, username)
        // 查询用户
        await ctx.service.user.findOne({username: username, password: password}).then(async (data) => {
            if (data) {
                // 生成token
                let token = await ctx.service.verif.createToken({_id: data.id}, time)
                // 保存用户信息到cookie
                ctx.cookies.set('t', token,{
                    maxAge: time * 1000,
                    path: '/',
                    // domain: 'www.dubo.world',
                    domain: 'localhost',
                    httpOnly: false,
                });
                ctx.cookies.set('uid', data.id,{
                    maxAge: time * 1000,
                    path: '/',
                    // domain: 'www.dubo.world',
                    domain: 'localhost',
                    httpOnly: false,
                });
                // 保存token到redis
                await app.redis.set(data.id, token)
                // 设置token过期时间
                await app.redis.expire(data.id, time)
                // 删除密码
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '账号或密码错误，请重试！'
                }
            }
        })
    }
    // 退出登陆
    async logout () {
        const {ctx} = this
        await ctx.cookies.set('uid', null)
        await ctx.cookies.set('t', null)
        ctx.status = 200
        ctx.body = {}
    }
    // 查询用户
    async get () {
        const {ctx} = this
        let form = ctx.request.body
        await ctx.service.user.findAll(form).then (async (data) => {
            if (data) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '没有此用户'
                }
            }
        })
    }
    // 查询一个用户
    async getuser () {
        const {ctx} = this
        let form = ctx.request.body
        await ctx.service.user.findOne(form).then (async (data) => {
            if (data) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '没有此用户'
                }
            }
        })
    }
}

module.exports = User;

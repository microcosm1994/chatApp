const Controller = require('egg').Controller;

class User extends Controller {
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
                    domain: 'localhost',
                    httpOnly: false,
                });
                ctx.cookies.set('uid', data.id,{
                    maxAge: time * 1000,
                    path: '/',
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
    async logout () {
        const {ctx} = this
        await ctx.cookies.set('uid', null)
        await ctx.cookies.set('t', null)
        ctx.status = 200
        ctx.body = {}
    }
    async get () {
        const {ctx} = this
        let form = ctx.request.body
        let uid = ctx.cookies.get('uid')
        await ctx.service.user.findAll(form).then (async (data) => {
            if (data) {
                let result = JSON.parse(JSON.stringify(data))
                // 查找好友消息表中已发送的好友请求
                await ctx.service.friendsMsg.findAll({userid: uid}).then((res) => {
                    // 对比搜索的用户中有没有已经发送好友请求的用户
                    for (let i = 0; i < res.length; i++) {
                        for (let k = 0; k < data.length; k++) {
                            if (res[i].targetid === data[k].id) {
                                // 设置当前用户与目标用户关系为加好友但未通过：0：未通过；1：通过；
                                result[k]['relation'] = 0
                            }
                        }
                    }
                    ctx.status = 200
                    ctx.body = result
                })
            } else {
                ctx.status = 400
                ctx.body = {}
            }
        })
    }
}

module.exports = User;

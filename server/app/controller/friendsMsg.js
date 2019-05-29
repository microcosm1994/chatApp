const Controller = require('egg').Controller;

class FriendsMsg extends Controller{
    // 添加
    async add () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.friends.create(form).then((data) => {
            if (data[1]) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '好友已存在'
                }
            }
        })
    }
    // 查找
    async get () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.friends.find(form).then((data) => {
            if (data) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '好友不存在'
                }
            }
        })
    }
}
module.exports = FriendsMsg

const Controller = require('egg').Controller;

class MsgRecord extends Controller{
    // 添加
    async add () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.msgrecord.create(form).then((data) => {
            if (data[1]) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '服务器错误'
                }
            }
        })
    }
    // 获取聊天记录
    async get () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.msgrecord.findAll(form).then(async (data) => {
            if (data) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '服务器错误'
                }
            }
        })
    }
}
module.exports = MsgRecord

'use strict';

const Controller = require('egg').Controller;

class chat extends Controller {
    async chat() {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        const message = ctx.args[1];
        // 广播
        // app.io.emit('CHAT_RES', message)
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            content: message
        }
        await ctx.service.msgrecord.create(result.data).then(async res => {
            if (res) {
                // 使用用户的socket实例发送消息
                if (usocket[info.targetid]) {
                    result.status = 200

                    await usocket[info.targetid].emit('CHAT_RES', result)
                }
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '服务器错误'
                }
            }
        })
    }
}

module.exports = chat;

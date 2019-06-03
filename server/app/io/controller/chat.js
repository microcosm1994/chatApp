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
        // 使用用户的socket实例发送消息
        if (usocket[info.targetInfo.id]) {
            result.status = 200
            result.data = {
                source: info.user.uid,
                time: Date.now(),
                message
            }
            await usocket[info.targetInfo.id].emit('CHAT_RES', result)
        } else {
            result.status = 403
            result.data = {
                source: info.user.uid,
                time: Date.now(),
                type: '离线',
                message,
            }
            await usocket[info.user.uid].emit('CHAT_RES', result)
        }
    }
}

module.exports = chat;

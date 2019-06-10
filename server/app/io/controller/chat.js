'use strict';

const Controller = require('egg').Controller;

class chat extends Controller {
    async chat() {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        const message = ctx.args[1];
        const uid = ctx.cookies.get('uid')
        // 广播
        // app.io.emit('CHAT_RES', message)
        let result = {}
        result.data = {
            userid: uid,
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
    async videoAnswer () {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        // 信令
        const answer = ctx.args[1];
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            data: answer //信令
        }
        // await usocket[uid].emit('CHATVIDEO_ANSWER_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_ANSWER_RES', result)
        }
    }
    async videoAsk () {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        // 信令
        const ask = ctx.args[1];
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            data: ask //信令
        }
        result.status = 200
        // await usocket[uid].emit('CHATVIDEO_ASK_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_ASK_RES', result)
        }
    }
    async videoRecvAnswer () {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        // 信令
        const answer = ctx.args[1];
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            data: answer //信令
        }
        // await usocket[uid].emit('CHATVIDEO_ANSWER_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_RECV_ANSWER_RES', result)
        }
    }
    async videoRecvAsk () {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        // 信令
        const ask = ctx.args[1];
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            data: ask //信令
        }
        result.status = 200
        // await usocket[uid].emit('CHATVIDEO_ASK_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_RECV_ASK_RES', result)
        }
    }
}

module.exports = chat;

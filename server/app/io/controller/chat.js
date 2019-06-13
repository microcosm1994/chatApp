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
        console.log(message);
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
    // 视频聊天请求
    async videoReq() {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        // 广播
        // app.io.emit('CHAT_RES', message)
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid
        }
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_REQ', result)
        }
    }
    // 视频聊天结果回复
    async videoRes() {
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
            data: message
        }
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_RES', result)
        }
    }
    // 交换offer、candidate等建立连接所需的信息
    async videoIce () {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        // 信令
        const Ice = ctx.args[1];
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            type: info.type,
            data: Ice //信令
        }
        result.status = 200
        // await usocket[uid].emit('CHATVIDEO_ASK_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_ICE', result)
        }
    }
    // 交换offer、candidate等建立连接所需的信息
    async videoOffer () {
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
            type: info.type,
            data: ask //信令
        }
        result.status = 200
        // await usocket[uid].emit('CHATVIDEO_ASK_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_OFFER', result)
        }
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
            await usocket[info.targetid].emit('CHATVIDEO_ANSWER', result)
        }
    }
    // 关闭视频聊天
    async videoClose () {
        const { ctx, app } = this;
        const usocket = app.usocket.getState()
        let info = ctx.args[0]
        let result = {}
        result.data = {
            userid: info.userid,
            createtime: Date.now(),
            targetid: info.targetid,
            data: 'close'
        }
        // await usocket[uid].emit('CHATVIDEO_ANSWER_RES', result)
        // 使用用户的socket实例发送消息
        if (usocket[info.targetid]) {
            result.status = 200
            await usocket[info.targetid].emit('CHATVIDEO_CLOSE', result)
        }
    }
}

module.exports = chat;

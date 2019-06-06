module.exports = app => {
    return async (ctx, next) => {
        const {socket} = ctx
        const query = socket.handshake.query
        // 用自己的uid创建一个房间
        // if (!Object.keys(app.io.rooms).includes(query.uid)) {
        //     app.io.rooms[query.uid] = query.uid
        // }
        // 保存用户的socket实例
        let usocket = app.usocket.getState()
        if (!Object.keys(usocket).includes(query.uid)) {
            socket.uid = query.uid
            app.usocket.setState(query.uid, socket)
        }
        await next();
        // 断开连接时执行.
        app.usocket.removeState(query.uid)
    }
}

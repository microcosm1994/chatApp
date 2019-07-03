module.exports = app => {
    return async (ctx, next) => {
        const {socket} = ctx
        const query = socket.handshake.query
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

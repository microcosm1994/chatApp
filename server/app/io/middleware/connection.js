module.exports = app => {
    return async (ctx, next) => {
        const {socket} = ctx
        const query = socket.handshake.query
        // 用自己的uid创建一个房间
        if (!Object.keys(socket.rooms).includes(query.uid)) {
            socket.rooms[query.uid] = query.uid
        }
        await next();
        // 断开连接时执行.
    }
}

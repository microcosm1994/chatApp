module.exports = app => {
    const { io } = app;
    io.of('/').route('CHAT_SEND', io.controller.chat.chat)
    io.of('/').route('CHATVIDEO_REQ', io.controller.chat.videoReq)
    io.of('/').route('CHATVIDEO_RES', io.controller.chat.videoRes)
    io.of('/').route('CHATVIDEO_ASK', io.controller.chat.videoAsk)
    io.of('/').route('CHATVIDEO_ANSWER', io.controller.chat.videoAnswer)
    io.of('/').route('CHATVIDEO_CLOSE', io.controller.chat.videoClose)
}

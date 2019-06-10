module.exports = app => {
    const { io } = app;
    io.of('/').route('CHAT_SEND', io.controller.chat.chat)
    io.of('/').route('CHATVIDEO_ASK', io.controller.chat.videoAsk)
    io.of('/').route('CHATVIDEO_ANSWER', io.controller.chat.videoAnswer)
    io.of('/').route('CHATVIDEO_RECV_ASK', io.controller.chat.videoRecvAsk)
    io.of('/').route('CHATVIDEO_RECV_ANSWER', io.controller.chat.videoRecvAnswer)
}

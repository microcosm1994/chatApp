module.exports = app => {
    const { io } = app;
    io.of('/').route('CHAT_SEND', io.controller.chat.chat)
}

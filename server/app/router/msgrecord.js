module.exports = app => {
    app.router.post('/msgrecord/add', app.controller.msgrecord.add);
    app.router.post('/msgrecord/get',  app.controller.msgrecord.get)
    app.router.post('/msgrecord/getUnread',  app.controller.msgrecord.getUnread)
    app.router.post('/msgrecord/setRead',  app.controller.msgrecord.setRead)
}

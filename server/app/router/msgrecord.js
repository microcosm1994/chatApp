module.exports = app => {
    app.router.post('/msgrecord/add', app.controller.msgrecord.add);
    app.router.post('/msgrecord/get',  app.controller.msgrecord.get)
}

module.exports = app => {
    app.router.post('/friendsMsg/add', app.controller.friendsMsg.add);
    app.router.post('/friendsMsg/get',  app.controller.friendsMsg.get)
    app.router.post('/friendsMsg/del',  app.controller.friendsMsg.del)
}

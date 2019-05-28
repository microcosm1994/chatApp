module.exports = app => {
    app.router.post('/friends/add', app.controller.friends.add);
    app.router.post('/friends/get',  app.controller.friends.get)
    app.router.post('/friends/del',  app.controller.friends.del)
}

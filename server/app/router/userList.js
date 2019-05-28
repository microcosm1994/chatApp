module.exports = app => {
    app.router.post('/userList/add', app.controller.user.add);
    app.router.post('/userList/get',  app.controller.user.register)
    app.router.post('/userList/del',  app.controller.user.logout)
}

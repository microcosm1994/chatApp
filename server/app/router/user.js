module.exports = app => {
    app.router.post('/user/login', app.controller.user.login);
    app.router.post('/user/register',  app.controller.user.register)
    app.router.post('/user/logout',  app.controller.user.logout)
    app.router.post('/user/get',  app.controller.user.get)
    app.router.post('/user/getuser',  app.controller.user.getuser)
    app.router.post('/user/getAll',  app.controller.user.getAll)
}

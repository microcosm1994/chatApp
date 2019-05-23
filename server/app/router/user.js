module.exports = app => {
    app.router.post('/user/login', app.controller.user.login);
    app.router.post('/user/register', app.controller.user.register)
}

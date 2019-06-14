module.exports = app => {
    app.router.post('/file/save', app.controller.file.save);
}

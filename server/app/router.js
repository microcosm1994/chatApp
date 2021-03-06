'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    require('./router/user')(app)
    require('./router/friends')(app)
    require('./router/friendsMsg')(app)
    require('./router/msgrecord')(app)
    require('./router/file')(app)
    // socket
    require('./router/io')(app)
}

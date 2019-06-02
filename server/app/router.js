'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    require('./router/user')(app)
    require('./router/friends')(app)
    require('./router/friendsMsg')(app)
    // socket
    require('./router/io')(app)
}

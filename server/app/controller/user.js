'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
    async register() {
        const { ctx } = this;
        let form = ctx.request.body
        let user = await ctx.service.user.create(form)
        let result = {}
        if (user[1]) {
            result.status = 200
            result.data = user[0]
        } else {
            result.status = 405
            result.data = form
        }
        ctx.status = 200
        ctx.body = result
    }
    async login() {
        const { ctx } = this;
        let {username, password} = ctx.request.body
        let user = await ctx.service.user.find({username: username})
        ctx.status = 200
        ctx.body = user
    }
}

module.exports = User;

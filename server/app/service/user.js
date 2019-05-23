const Service = require('egg').Service;

class user extends Service {
    async create(obj) {
        const ctx = this.ctx;
        let getUser = {
            username: obj.username
        }
        const user = await ctx.model.User.findOrCreate({
            where: getUser,
            defaults: obj
        })
        return user
    }
    async find (obj) {
        const ctx = this.ctx;
        const user = await ctx.model.User.findOne({where: obj})
        return user
    }
}

module.exports = user;

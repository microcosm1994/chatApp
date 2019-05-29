const Service = require('egg').Service;

class friendsMsg extends Service{
    // 创建
    async create(obj) {
        const ctx = this.ctx;
        const data = await ctx.model.FriendsMsg.findOrCreate({
            where: obj,
            defaults: obj
        })
        return data
    }
    // 查找
    async find (obj) {
        const ctx = this.ctx;
        const data = await ctx.model.FriendsMsg.findAll({where: obj})
        return data
    }
}
module.exports = friendsMsg

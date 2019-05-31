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
    async findAll (obj) {
        const ctx = this.ctx;
        const data = await ctx.model.FriendsMsg.findAll({where: obj})
        return data
    }
    // 按id查找
    async findByPk (id) {
        const ctx = this.ctx;
        const data = await ctx.model.FriendsMsg.findByPk({param: id})
        return data
    }
    // 修改
    async put (value, query) {
        const ctx = this.ctx;
        await ctx.model.FriendsMsg.update(value, {where: query}).then(async res => {
            if (res[0]) {
                let data = await this.findByPk(query.id)
            }
        })
        return data
    }
}
module.exports = friendsMsg

const Service = require('egg').Service;

class friends extends Service{
    // 创建
    async create(obj) {
        const ctx = this.ctx;
        let query = {
            parentId: obj.parentId
        }
        const data = await ctx.model.Friends.findOrCreate({
            where: query,
            defaults: obj
        })
        return data
    }
    // 查找
    async find (obj) {
        const ctx = this.ctx;
        const data = await ctx.model.Friends.findAll({where: obj})
        return data
    }
}
module.exports = friends

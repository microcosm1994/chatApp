const Service = require('egg').Service;

class userList extends Service{
    // 创建
    async create(obj) {
        const ctx = this.ctx;
        let query = {
            parentId: obj.parentId
        }
        obj.password = await ctx.service.utils.sha256(obj.password, obj.username)
        const data = await ctx.model.User.findOrCreate({
            where: query,
            defaults: obj
        })
        return data
    }
    // 查找
    async find (obj) {
        const ctx = this.ctx;
        const data = await ctx.model.UserList.findAll({where: obj})
        return data
    }
}
module.exports = userList

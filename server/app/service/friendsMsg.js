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
        const {ctx} = this;
        const data = await ctx.model.FriendsMsg.findAll({where: obj})
        return data
    }
    // 按userid或targetid查找
    async findAllid (id) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        let uid = ctx.cookies.get('uid')
        const data = await ctx.model.FriendsMsg.findAll({
            where: {
                [Op.or]: [
                    { userid: {[Op.like]: '%' + id + '%'}},
                    { targetid: {[Op.like]: '%' + id + '%'}}
                ],
                id: {
                    [Op.not]: uid,
                }
            }
        })
        return data
    }
    // 按id查找
    async findByPk (id) {
        const ctx = this.ctx;
        const data = await ctx.model.FriendsMsg.findByPk(id)
        return data
    }
    // 修改
    async put (value, query) {
        const ctx = this.ctx;
        let result = []
        // 只要有更新，就把状态改为已读
        value['state'] = 1
        value['delete'] = 1
        await ctx.model.FriendsMsg.update(value, {where: query}).then(async res => {
            result[0] = res[0]
            if (res[0]) {
                result[1] = await this.findByPk(query.id)
            }
        })
        return result
    }
}
module.exports = friendsMsg

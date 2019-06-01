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
        return await ctx.model.FriendsMsg.findAll({where: obj})
    }
    // 按userid或targetid查找
    async findAllid (id) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        let uid = ctx.cookies.get('uid')
        return await ctx.model.FriendsMsg.findAll({
            where: {
                [Op.or]: [
                    { userid: {[Op.like]: '%' + id + '%'}},
                    { targetid: {[Op.like]: '%' + id + '%'}}
                ]
            }
        })
    }
    // 按id数组查询
    async findidArr (idArr) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        return await ctx.model.FriendsMsg.findAll({
            where: {
                [Op.or]: [
                    { userid: {[Op.in]: idArr}},
                    { targetid: {[Op.in]: idArr}}
                ]
            }
        })
    }
    // 按id查找
    async findByPk (id) {
        const ctx = this.ctx;
        return await ctx.model.FriendsMsg.findByPk(id)
    }
    // 修改
    async put (value, query) {
        const ctx = this.ctx;
        // 只要有更新，就把状态改为已读
        value['state'] = 1
        value['delete'] = 1
        return await ctx.model.FriendsMsg.update(value, {where: query})
    }
}
module.exports = friendsMsg

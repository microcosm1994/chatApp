const Service = require('egg').Service;

class user extends Service {
    async create(obj) {
        const ctx = this.ctx;
        let getUser = {
            username: obj.username
        }
        obj.password = await ctx.service.utils.sha256(obj.password, obj.username)
        const user = await ctx.model.User.findOrCreate({
            where: getUser,
            defaults: obj
        })
        return user
    }
    async findOne (obj) {
        const ctx = this.ctx;
        const user = await ctx.model.User.findOne({where: obj})
        return user
    }
    // 模糊查询
    async findVague (obj) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        let uid = ctx.cookies.get('uid')
        const user = await ctx.model.User.findAll({
            where: {
                [Op.or]: [
                    { username: {[Op.like]: '%' + obj.username + '%'}},
                    { nickname: {[Op.like]: '%' + obj.nickname + '%'}}
                ],
                id: {
                    [Op.not]: uid,
                }
            }
        })
        return user
    }
    // 模糊查询
    async findAll () {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        let uid = ctx.cookies.get('uid')
        const user = await ctx.model.User.findAll({
            where: {
                delete: 0,
                id: {
                    [Op.not]: uid,
                }
            }
        })
        return user
    }
    // 按id数组查找
    async findidArr (idArr) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        let uid = ctx.cookies.get('uid')
        const user = await ctx.model.User.findAll({
            where: {
                id: {
                    [Op.in]: idArr,
                    [Op.not]: uid,
                }
            }
        })
        return user
    }
}

module.exports = user;

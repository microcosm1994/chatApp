const Service = require('egg').Service;

class friends extends Service {
    // 创建
    async create(obj) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        const data = await ctx.model.Friends.findOrCreate({
            where: {
                [Op.or]: [
                    {[Op.and]: [
                            {userid: obj.userid},
                            {targetid: obj.targetid}
                        ]},
                    {[Op.and]: [
                            {userid: obj.targetid},
                            {targetid: obj.userid}
                        ]},
                ]
            },
            defaults: obj
        })
        return data
    }

    // 查找
    async find(obj) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        const data = await ctx.model.Friends.findAll({
            where: {
                [Op.or]: [
                    {userid: obj.uid},
                    {targetid: obj.uid}
                ]
            }
        })
        return data
    }
}

module.exports = friends

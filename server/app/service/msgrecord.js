const Service = require('egg').Service

class msgrecord extends Service{
    async create(obj) {
        const ctx = this.ctx;
        const user = await ctx.model.Msgrecord.create(obj)
        return user
    }
    // 查询
    async findAll (obj) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        const user = await ctx.model.Msgrecord.findAll({
            where: {
                [Op.or]: [
                    { [Op.and]: [
                            { userid: obj.userid},
                            { targetid: obj.targetid}
                        ]},
                    { [Op.and]: [
                            { userid: obj.targetid},
                            { targetid: obj.userid}
                        ]}
                ]
            }
        })
        return user
    }
}
module.exports = msgrecord;

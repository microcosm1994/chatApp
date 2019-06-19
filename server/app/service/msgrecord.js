const Service = require('egg').Service

class msgrecord extends Service{
    async create(obj) {
        const ctx = this.ctx;
        return await ctx.model.Msgrecord.create(obj)
    }
    // 查询
    async findAll (obj) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        return await ctx.model.Msgrecord.findAll({
            offset: obj.offset,
            limit: obj.limit,
            order: [
                ['createtime', 'DESC']
            ],
            where: {
                [Op.or]: [
                    {
                        userid: obj.userid,
                        targetid: obj.targetid
                    },
                    {
                        userid: obj.targetid,
                        targetid: obj.userid
                    }
                ]
            }
        })
    }
    // 查询指定好友的未读消息
    async findUnread (obj) {
        const {app, ctx} = this;
        const {Op} = app.Sequelize
        const uid = ctx.cookies.get('uid')
        return await ctx.model.Msgrecord.findAll({
            where: {
                targetid: uid,
                state: 0,
                delete: 0,
                userid: {
                    [Op.in]: obj.userid
                }
            }
        })
    }
    // 设置消息已读
    async setRead (obj) {
        const {ctx} = this;
        const uid = ctx.cookies.get('uid')
        return await ctx.model.Msgrecord.update({
            state: 1
        }, {
            where: {
                targetid: uid,
                state: 0,
                delete: 0,
                userid: obj.targetid
            }
        })
    }
}
module.exports = msgrecord;

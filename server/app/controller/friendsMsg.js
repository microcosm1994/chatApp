const Controller = require('egg').Controller;

class FriendsMsg extends Controller{
    // 添加
    async add () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.friendsMsg.create(form).then((data) => {
            if (data[1]) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '您已发送过好友请求，请等待对方处理。'
                }
            }
        })
    }
    // 查找
    async get () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.friendsMsg.findAll(form).then(async (data) => {
            if (data) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '好友不存在'
                }
            }
        })
    }
    // 查找消息列表
    async getList () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.friendsMsg.findAll(form).then(async (data) => {
            if (data) {
                let idArr = []
                // 深拷贝查询数据
                let result = JSON.parse(JSON.stringify(data))
                for (let i = 0; i < data.length; i++) {
                    // 如果id数组中没有这个id就添加，如果有就不添加
                    if (!idArr.includes(data[i].userid)) {
                        idArr.push(data[i].userid)
                    }
                }
                // 如果id数组大于0，就按id查询用户数据
                if (idArr.length > 0) {
                    await ctx.service.user.findidArr(idArr).then(res => {
                        if (res) {
                            // 把查询到的用户数据添加到好友消息数据中
                            for (let i = 0; i < data.length; i++) {
                                for (let k = 0; k < res.length; k++) {
                                    if (data[i].userid === res[k].id) {
                                        // 删除用户id信息
                                        delete result[i].targetid
                                        delete result[i].userid
                                        result[i]['target'] = res[k]
                                    }
                                }
                            }
                        }
                    })
                }
                ctx.status = 200
                ctx.body = result
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '好友不存在'
                }
            }
        })
    }
    // 修改
    async put () {
        let {ctx} = this
        let form = ctx.request.body
        let result = {}
        await ctx.service.friendsMsg.put(form.update, form.where).then(async data => {
            // 修改成功后再做对应的操作
            if (data[0]) {
                let updata = await ctx.service.friendsMsg.findByPk(form.where.id)
                let userid = updata.userid
                let targetid = updata.targetid
                let opera = updata.opera
                // 如果接受好友请求，就在好友表中添加一条数据
                if (opera === 1) {
                    await ctx.service.friends.create({userid: userid, targetid: targetid})
                }
                ctx.status = 200
                ctx.body = result
            } else {
                ctx.status = 405
                ctx.body = {
                    error: '服务器错误'
                }
            }
        })
    }
}
module.exports = FriendsMsg

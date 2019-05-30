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
                    error: '好友请求已发送'
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
                let idArr = []
                let result = JSON.parse(JSON.stringify(data))
                for (let i = 0; i < data.length; i++) {
                    if (!idArr.includes(data[i].userid)) {
                        idArr.push(data[i].userid)
                    }
                }
                if (idArr.length > 0) {
                    await ctx.service.user.findidArr(idArr).then(res => {
                        if (res) {
                            for (let i = 0; i < data.length; i++) {
                                for (let k = 0; k < res.length; k++) {
                                    if (data[i].userid === res[k].id) {
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
        await ctx.service.friendsMsg.put(form.update, form.where).then(data => {
            console.log(data);
        })
    }
}
module.exports = FriendsMsg

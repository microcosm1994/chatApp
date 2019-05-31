const Controller = require('egg').Controller;

class friends extends Controller{
    async add () {
        let {ctx} = this
        let form = ctx.request.body
        await ctx.service.friends.create(form).then((data) => {
            if (data[1]) {
                ctx.status = 200
                ctx.body = data
            } else {
                ctx.status = 403
                ctx.body = {
                    error: '好友已存在'
                }
            }
        })
    }
    async get () {
        let {ctx} = this
        let form = ctx.request.body
        let result = null
        await ctx.service.friends.find(form).then(async (data) => {
            if (data) {
                result = JSON.parse(JSON.stringify(data))
                // id数组
                let idArr = []
                for (let i = 0; i < data.length; i++) {
                    idArr.push(data[i].userid)
                    idArr.push(data[i].targetid)
                }
                // 数组去重
                idArr = [...new Set(idArr)]
                console.log(idArr);
                if (idArr.length > 0) {
                    // 按id数组查询用户（好友）信息
                    await ctx.service.user.findidArr(idArr).then(data1 => {
                        for (let k = 0; k < result.length; k++) {
                           for (let k1 = 0; k1 < data1.length; k1++) {
                               if (result[k].userid === data1[k1].id || result[k].targetid === data1[k1].id) {
                                   // 好友信息
                                   result[k]['targetInfo'] = data1[k1]
                                   // 从返回结果中删除userid和targetid
                                   delete result[k].userid
                                   delete result[k].targetid
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
}
module.exports = friends

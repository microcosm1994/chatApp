const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

class file extends Controller{
    // 保存文件
    async save () {
        let {ctx} = this
        const parts = ctx.multipart();
        let part;
        let filePathArr = []
        // parts() 返回 promise 对象
        while ((part = await parts()) != null) {
            if (part.length) {
                // 获取其他参数
            } else {
                if (!part.filename) return
                // 处理文件流
                let filePath = path.join('E:\\myproject\\img', part.filename)
                let writable = fs.createWriteStream(filePath)// 创建写入流
                await part.pipe(writable)
                filePathArr.push(filePath)
            }
        }
        ctx.status = 200
        ctx.body = {
            data: filePathArr
        }
    }
}
module.exports = file

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

class file extends Controller{
    // 保存文件
    async save () {
        let {ctx} = this
        const parts = ctx.multipart();
        let part;
        let result = []
        // parts() 返回 promise 对象
        while ((part = await parts()) != null) {
            let length = 0
            if (part.length) {
                length = part[1]
                // 获取其他参数
            } else {
                if (!part.filename) return
                // 处理文件流
                let file = {}
                file.name = part.filename
                file.type = part.mimeType
                let filePath = path.join('E:/myproject/chatApp/server/app/public/upload', part.filename)
                let writable = fs.createWriteStream(filePath)// 创建写入流
                await part.pipe(writable)
                file.cover = fileIcon(part.mimeType, 'http://localhost:7001/public/upload/' + part.filename)
                file.path = filePath
                result.push(file)
            }
        }
        ctx.status = 200
        ctx.body = {
            data: result
        }
    }
}
module.exports = file

function fileIcon (type, path) {
    let fileName = ''
    if (type === 'image/jpeg') {
        return path
    } else {
        switch (type) {
            case 'text/plain':
                fileName = 'file_txt'
                break
            default:
                fileName = 'file-b-'
                break
        }
        return 'http://localhost:7001/public/icon/' + fileName + '.png'
    }
}

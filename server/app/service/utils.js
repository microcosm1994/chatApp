const Service = require('egg').Service
const Crypto = require('crypto')

class utils extends Service{
    // md5加密方式
    async md5 (str) {
        const hash = Crypto.createHash('md5');
        hash.update(str)
        return hash.digest('hex')
    }
    // sha256加密方式
    async sha256 (str, username) {
        const hmac = Crypto.createHmac('sha256', username);
        hmac.update(str)
        return hmac.digest('hex')
    }
}
module.exports = utils;

const Service = require('egg').Service;
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

class verif extends Service{
    async createToken (data, time) {
        let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem'));//私钥
        let token = jwt.sign({
            data,
            exp: created + time
        }, cert, {algorithm: 'RS256'});
        return token
    }
    async verifToken (token) {
        let cert = await fs.readFileSync(path.join(__dirname, '../public/rsa_public_key.pem'));//公钥
        let res = ''
        try {
            let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
            let {exp, iat} = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            console.log(e);
        }
        return res;
    }
}
module.exports = verif

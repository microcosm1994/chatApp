/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1558251025314_7295';

    // 中间件
    config.middleware = ['user'];
    // 中间件配置
    config.user = {
        whiteList: ['/user/login', '/user/register']
    }
    // mysql数据库
    config.sequelize  = {
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        database: 'chatapp',
        username: 'root', //账号
        password: '113655', //密码
    };
    // 跨域问题
    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
        },
        domainWhiteList: ['http://localhost:3000']
    };
    config.cors = {
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    }
    // redis
    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: 'auth',
            db: 0,
        }
    }
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
    }
}

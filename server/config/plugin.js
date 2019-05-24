'use strict';

/** @type Egg.EggPlugin */
// 操作mysql数据库
module.exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};
// 跨域
module.exports.cors = {
    enable: true,
    package: 'egg-cors',
};
// redis
module.exports.redis = {
    enable: true,
    package: 'egg-redis',
};


module.exports = app => {
    const { STRING, INTEGER, DATE, UUID } = app.Sequelize;

    const User = app.model.define('users', {
        id: {
            type: UUID,
            primaryKey: true,
            autoIncrement: true
        },
        nickname: STRING(30),
        username: {
            type: STRING,
            unique: true
        },
        password: STRING,
        admin: INTEGER,
        deleete: INTEGER,
        createtime: {
            type: DATE,
            defaultValue: DATE.NOW
        },
        updatetime: {
            type: DATE,
            defaultValue: DATE.NOW
        }
    },{
        timestamps: false,
        // 默认作用域
        defaultScope: {
            attributes: {
                // 排除密码，不返回密码
                exclude: ['password']
            }
        }
    });
    return User;
};

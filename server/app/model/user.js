module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const User = app.model.define('users', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nickname: STRING(30),
        username: STRING,
        password: STRING,
        admin: INTEGER,
        createtime: DATE,
        updatetime: DATE
    },{
        timestamps: false,
    });

    return User;
};

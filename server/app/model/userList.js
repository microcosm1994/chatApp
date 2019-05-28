
module.exports = app => {
    const {STRING, DATE, UUID, INTEGER} = app.Sequelize

    const UserList = app.model.define('userList', {
        id: {
            type: UUID,
            primaryKey: true,
            autoIncrement: true
        },
        parentId: INTEGER,
        target: STRING,
        type: {
            type: INTEGER,
            defaultValue: 1
        },
        delete: {
            type: INTEGER,
            defaultValue: 0
        },
        createtime: {
            type: DATE,
            defaultValue: DATE.NOW
        },
        updatetime: {
            type: DATE,
            defaultValue: DATE.NOW
        }
    }, {
        timestamps: false
    })
    UserList.associate = function() {
        app.model.UserList.belongsTo(app.model.User, { foreignKey: 'parenrId', targetKey: 'id' })
    }
    return UserList
}

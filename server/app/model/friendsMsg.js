module.exports = app => {
    const {STRING, DATE, UUID, INTEGER} = app.Sequelize

    const FriendsMsg = app.model.define('friendsMsg', {
        id: {
            type: UUID,
            primaryKey: true,
            autoIncrement: true
        },
        userId: INTEGER,
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
    FriendsMsg.associate = function() {
        app.model.FriendsMsg.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id' })
    }
    return FriendsMsg
}

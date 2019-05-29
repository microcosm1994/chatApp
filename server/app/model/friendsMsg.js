module.exports = app => {
    const {STRING, DATE, UUID, INTEGER} = app.Sequelize

    const FriendsMsg = app.model.define('friendsmsgs', {
        id: {
            type: UUID,
            primaryKey: true,
            autoIncrement: true
        },
        userid: INTEGER,
        targetid: INTEGER,
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
        app.model.FriendsMsg.belongsTo(app.model.User, { foreignKey: 'userid', targetKey: 'id' })
    }
    return FriendsMsg
}

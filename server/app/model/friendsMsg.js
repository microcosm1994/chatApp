module.exports = app => {
    const {STRING, DATE, INTEGER} = app.Sequelize

    const FriendsMsg = app.model.define('friendsmsgs', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: STRING,
        targetid: STRING,
        opera: {
            type: INTEGER,
            defaultValue: 0
        },
        state: {
            type: INTEGER,
            defaultValue: 0
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

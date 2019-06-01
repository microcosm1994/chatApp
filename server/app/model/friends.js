module.exports = app => {
    const {STRING, DATE, INTEGER} = app.Sequelize

    const Friends = app.model.define('friends', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: STRING,
        targetid: STRING,
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
    Friends.associate = function() {
        app.model.Friends.belongsTo(app.model.User, { foreignKey: 'userid', targetKey: 'id' })
    }
    return Friends
}

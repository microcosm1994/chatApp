module.exports = app => {
    const {STRING, DATE, UUID, INTEGER} = app.Sequelize

    const Friends = app.model.define('friends', {
        id: {
            type: UUID,
            primaryKey: true,
            autoIncrement: true
        },
        userid: INTEGER,
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
    Friends.associate = function() {
        app.model.Friends.belongsTo(app.model.User, { foreignKey: 'userid', targetKey: 'id' })
    }
    return Friends
}

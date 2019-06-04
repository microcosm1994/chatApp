module.exports = app => {
    const {STRING, DATE, INTEGER} = app.Sequelize

    const Msgrecord = app.model.define('msgrecords', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: STRING,
        targetid: STRING,
        createtime: {
            type: DATE,
            defaultValue: DATE.NOW
        },
        content: STRING
    }, {
        timestamps: false
    })
    Msgrecord.associate = function() {
        app.model.Msgrecord.belongsTo(app.model.User, { foreignKey: 'userid', targetKey: 'id' })
    }
    return Msgrecord
}

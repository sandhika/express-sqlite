module.exports = function(sequelize, Sequalize) {
    var UserSchema = sequelize.define("Users", {
        email: Sequalize.STRING,
        username: Sequalize.STRING,
        password: Sequalize.STRING

    }, {
        timestamps: false
    });
    return UserSchema;
}
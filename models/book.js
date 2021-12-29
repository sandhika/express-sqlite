module.exports = function(sequelize, Sequalize) {
    var BookSchema = sequelize.define("Books", {
        title: Sequalize.STRING,
        author: Sequalize.STRING,
        category: Sequalize.STRING
    }, {
        timestamps: false
    });
    return BookSchema;
}
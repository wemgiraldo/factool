/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('dte_info', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        folio: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        type: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
            tableName: 'dte_info'
        });
};

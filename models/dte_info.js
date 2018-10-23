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
        instruction: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        type: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        operation: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        urlCedible: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        urlOriginal: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        file_url_cen: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        invoice_file_id_cen: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        xml: {
            type: DataTypes.TEXT,
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

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('bank_account', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      id_company: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      account_number: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'bank_account'
    });
  };
  
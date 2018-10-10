/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('transaction_type', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
      tableName: 'transaction_type'
    });
};

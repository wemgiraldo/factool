/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dte_acceptance_status', {
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
    tableName: 'dte_acceptance_status'
  });
};

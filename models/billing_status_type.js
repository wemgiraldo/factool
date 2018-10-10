/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('billing_status_type', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    natural_key: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'billing_status_type'
  });
};

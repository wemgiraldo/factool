/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment_due_type', {
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
    tableName: 'payment_due_type'
  });
};

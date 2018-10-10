/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('billing_type', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    natural_key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    system_prefix: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_prefix: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_window: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    department: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    enabled: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'billing_type'
  });
};

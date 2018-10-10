/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const billing_windows = sequelize.define('billing_windows', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    natural_key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_type: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    periods: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_ts: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_ts: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'billing_windows'
    });

  billing_windows.associate = (models) => {
    // associations can be defined here
    billing_windows.belongsTo(models.billing_type, { foreignKey: "billing_type", as: "billingType" });
  };

  return billing_windows;
};

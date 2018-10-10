/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const payment_matrices = sequelize.define('payment_matrices', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_cen: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    auxiliary_data: {
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
    },
    payment_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    version: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payment_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    letter_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    letter_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    letter_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    matrix_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    publish_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_days: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_window: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    natural_key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reference_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_window: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payment_due_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
      tableName: 'payment_matrices'
    });

  payment_matrices.associate = (models) => {
    // associations can be defined here
    payment_matrices.belongsTo(models.billing_windows, { foreignKey: "billing_window", as: "billingWindow" });
  };

  return payment_matrices;
};

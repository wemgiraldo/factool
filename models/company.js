/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const company = sequelize.define('company', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rut: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    verification_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    business_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    commercial_business: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dte_reception_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank_account: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank_account_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    commercial_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    postal_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    manager: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    p_c_first_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    p_c_last_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    p_c_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    p_c_phones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    p_c_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_c_first_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_c_last_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_c_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_c_phones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_c_email: {
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
      tableName: 'company'
    });

  company.associate = (models) => {
    // associations can be defined here
    company.belongsTo(models.banks, { foreignKey: "bank", as: "bank_info" });
  };

  return company;

};

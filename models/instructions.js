/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const instructions = sequelize.define('instructions', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_cen: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    payment_matrix: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    creditor: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    debtor: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    amount_gross: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    closed: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status_billed: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status_paid: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    max_payment_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    informed_paid_amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_paid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    aux_data_payment_matrix_natural_key: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    aux_data_payment_matrix_concept: {
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
      tableName: 'instructions',
      indexes: [
        // Create a index
        {
          unique: false,
          fields: ['id_cen']
        }
      ]
    });

  instructions.associate = (models) => {
    // associations can be defined here
    instructions.belongsTo(models.company, { foreignKey: "creditor", as: "creditor_info" });
    instructions.belongsTo(models.company, { foreignKey: "debtor", as: "debtor_info" });
    
  };

  return instructions;

};

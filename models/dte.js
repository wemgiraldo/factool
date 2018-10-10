/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('dte', {
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
    instruction: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    folio: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gross_amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    net_amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reported_by_creditor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emission_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    emission_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emission_erp_a: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emission_erp_b: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reception_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    reception_erp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acceptance_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    acceptance_erp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    acceptance_status: {
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
      tableName: 'dte',
      indexes: [
        // Create a index
        {
          unique: false,
          fields: ['instruction']
        }
      ]
    });
};

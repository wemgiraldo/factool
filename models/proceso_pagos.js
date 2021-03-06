/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('proceso_pagos', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      idCompany: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      bank_account: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      dtes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      closed_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
        tableName: 'proceso_pagos'
      });
  };
  
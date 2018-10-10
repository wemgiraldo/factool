/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dte_type', {
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
    },
    sii_code: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    factor: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'dte_type'
  });
};

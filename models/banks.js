/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banks', {
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
    sbif: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'banks'
  });
};

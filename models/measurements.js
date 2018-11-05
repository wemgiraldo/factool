/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('measurements', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    plant_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    item_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      tableName: 'measurements'
    });
};

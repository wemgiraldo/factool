/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('plants', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      plant_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      device_id: {
        type: DataTypes.DATE,
        allowNull: true
      },
      log_id: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      item_id: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      company_cen_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      enable: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      company_cen_name: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'plants'
    });
  };
  
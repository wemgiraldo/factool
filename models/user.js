/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    enabled: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    locked: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    expired: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    confirmation_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_requested_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    credential_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    credential_expired: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    roles: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};

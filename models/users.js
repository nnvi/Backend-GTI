'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.container,{foreignKey:"user_id"}),
      users.hasMany(models.repair,{foreignKey:"user_id"}),
      users.hasMany(models.shipment,{foreignKey:"user_id"}),
      users.hasMany(models.log_activity,{foreignKey:"user_id"})
    }
  }
  users.init({
    user_uuid: {
      type: DataTypes.STRING,
      defaultValue:DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(100),
    role: DataTypes.ENUM("Super Admin","Customer Service","Operasional"),
    location: DataTypes.ENUM("Jakarta","Makassar","Medan","Surabaya"),
    user_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};
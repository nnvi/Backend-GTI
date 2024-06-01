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
    uuid: {
      type: DataTypes.STRING,
      defaultValue:DataTypes.UUIDV4,
      allowNull: false,
      validate:{
        isUUID:4
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate:{
        isEmail:true
      }
    },
    password: {
      type:DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("Super Admin","Customer Service","Operasional"),
      allowNull: false,
      validate:{
        isIn:[["Super Admin","Customer Service","Operasional"]]
      }
    },
    location: {
      type:DataTypes.ENUM("Jakarta","Makassar","Medan","Surabaya"),
      allowNull: false,
      validate:{
        isIn:[["Jakarta","Makassar","Medan","Surabaya"]]
      }
    },
    user_image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate:{
        isUrl: true
      }
    }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};
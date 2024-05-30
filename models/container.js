'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class container extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      container.hasOne(models.repair,{foreignKey:"container_id"}),
      container.hasMany(models.shipment,{foreignKey:"container_id"}),
      container.belongsTo(models.users,{foreignKey:"user_id"})
    }
  }
  container.init({
    container_uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate:{
        isUUID:4
      }
    },
    container_number: {
      type:DataTypes.STRING(100),
      allowNull:false,
      unique: true
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate:{
        isNumeric:true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        isNumeric:true
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iddle_days: {
      type: DataTypes.INTEGER,
      allowNull:false 
    },
    type: {
      type: DataTypes.ENUM("20 feet","40 feet"),
      allowNull:false,
      validate:{
        isIn:[["20 feet","40 feet"]]
      }
    },
    status: {
      type: DataTypes.ENUM("Ready","In-Use","Repair"),
      allowNull: false,
      validate:{
        isIn:[["Ready","In-Use","Repair"]]
      }
    }
  }, {
    sequelize,
    modelName: 'container',
  });
  return container;
};
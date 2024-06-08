'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shipment.hasMany(models.log_activity,{foreignKey:"shipment_id"}),
      shipment.belongsTo(models.users,{foreignKey:"user_id"}),
      shipment.belongsTo(models.shipment_detail,{foreignKey:"shipment_detail_id"}),
      shipment.hasMany(models.shipment_containers,{foreignKey:"shipment_id"})
    }
  }
  shipment.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate:{
        isUUID:4
      }
    },
    number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    user_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    return_empty: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("Arrive","Departure","Pickup","Return","Gate in","Accident"),
      allowNull: false,
      validate:{
        isIn:[["Arrive","Departure","Pickup","Return","Gate in","Accident"]]
      }
    },
    shipment_detail_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    remark_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active_status: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    },
    delete_by: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'shipment',
  });
  return shipment;
};
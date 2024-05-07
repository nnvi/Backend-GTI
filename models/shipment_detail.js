'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipment_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shipment_detail.hasOne(models.shipment,{foreignKey:"shipment_detail_id"})
    }
  }
  shipment_detail.init({
    POL: DataTypes.STRING(100),
    POD: DataTypes.STRING(100),
    ETD: DataTypes.DATE,
    ETA: DataTypes.DATE,
    stuffing_date: DataTypes.DATE,
    shipper: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'shipment_detail',
  });
  return shipment_detail;
};
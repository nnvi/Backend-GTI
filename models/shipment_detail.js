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
    POL: {
      type:DataTypes.STRING(100),
      allowNull: false
    },
    POD: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ETD: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ETA: {
      type:DataTypes.DATE,
      allowNull: false
    },
    stuffing_date: {
      type:DataTypes.DATE,
      allowNull: false
    },
    shipper: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'shipment_detail',
  });
  return shipment_detail;
};
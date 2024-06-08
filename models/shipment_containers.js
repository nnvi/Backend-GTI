'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipment_containers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shipment_containers.belongsTo(models.container,{foreignKey:"container_id"})
      shipment_containers.belongsTo(models.shipment,{foreignKey:"shipment_id"})
    }
  }
  shipment_containers.init({
    container_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'shipment_containers',
  });
  return shipment_containers;
};
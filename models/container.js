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
      defaultValue: DataTypes.UUIDV4
    },
    container_number: DataTypes.STRING(100),
    user_id: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    location: DataTypes.ENUM("Jakarta","Makassar","Medan","Surabaya"),
    iddle_days: DataTypes.INTEGER,
    type: DataTypes.ENUM("20 feet","40 feet"),
    status: DataTypes.ENUM("Ready","In Use","Repair")
  }, {
    sequelize,
    modelName: 'container',
  });
  return container;
};
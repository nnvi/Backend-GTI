'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class repair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      repair.hasMany(models.log_activity,{foreignKey:"repair_id"}),
      repair.belongsTo(models.users,{foreignKey:"user_id"}),
      repair.belongsTo(models.container,{foreignKey:"container_id"})
    }
  }
  repair.init({
    uuid: {
      type:DataTypes.STRING,
      defaultValue:DataTypes.UUIDV4,
      allowNull: false,
      validate:{
        isUUID:4
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    container_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'repair',
  });
  return repair;
};
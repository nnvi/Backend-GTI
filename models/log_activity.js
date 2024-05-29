'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      log_activity.belongsTo(models.users,{foreignKey:"user_id"}),
      log_activity.belongsTo(models.shipment,{foreignKey:"shipment_id"}),
      log_activity.belongsTo(models.repair,{foreignKey:"repair_id"})
    }
  }
  log_activity.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    repair_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    activity_info: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'log_activity',
  });
  return log_activity;
};
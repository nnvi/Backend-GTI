'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shipment_uuid: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4
      },
      shipment_number: {
        type: Sequelize.STRING(100)
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      container_id: {
        type: Sequelize.INTEGER
      },
      return_empty: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM("Arrive","Departure","Pickup","Return","Gate in","Accident")
      },
      shipment_detail_id: {
        type: Sequelize.INTEGER
      },
      remark_description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      active_status: {
        type: Sequelize.BOOLEAN
      },
      delete_by: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shipments');
  }
};
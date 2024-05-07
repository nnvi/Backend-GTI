'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipment_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      POL: {
        type: Sequelize.STRING(100)
      },
      POD: {
        type: Sequelize.STRING(100)
      },
      ETD: {
        type: Sequelize.DATE
      },
      ETA: {
        type: Sequelize.DATE
      },
      stuffing_date: {
        type: Sequelize.DATE
      },
      shipper: {
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
    await queryInterface.dropTable('shipment_details');
  }
};
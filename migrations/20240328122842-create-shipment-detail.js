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
        type: Sequelize.STRING(100),
        allowNull: false
      },
      POD: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      ETD: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ETA: {
        type: Sequelize.DATE,
        allowNull: false
      },
      stuffing_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      shipper: {
        type: Sequelize.STRING,
        allowNull: false
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
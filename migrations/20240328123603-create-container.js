'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('containers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      container_uuid: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4
      },
      container_number: {
        type: Sequelize.STRING(100)
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      age: {
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.ENUM("Jakarta","Makassar","Medan","Surabaya")
      },
      iddle_days: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM("20 feet","40 feet")
      },
      status: {
        type: Sequelize.ENUM("Ready","In Use","Repair")
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
    await queryInterface.dropTable('containers');
  }
};
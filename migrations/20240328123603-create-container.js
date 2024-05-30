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
      uuid: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        validate:{
          isUUID:4
        }
      },
      number: {
        type: Sequelize.STRING(100),
        allowNull:false,
        unique: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
          isNumeric:true
        }
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
          isNumeric:true
        }
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      iddle_days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM("20 feet","40 feet"),
        allowNull:false,
        validate:{
          isIn:[["20 feet","40 feet"]]
        }
      },
      status: {
        type: Sequelize.ENUM("Ready","In-Use","Repair"),
        allowNull: false,
        validate:{
          isIn:[["Ready","In-Use","Repair"]]
        }
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
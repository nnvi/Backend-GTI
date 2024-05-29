'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_uuid: {
        type: Sequelize.STRING,
        defaultValue : Sequelize.UUIDV4,
        allowNull: false,
        validate:{
          isUUID:4
        }       
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate:{
          isEmail:true
        }
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM("Super Admin","Customer Service","Operasional"),
        allowNull: false,
        validate:{
          isIn:[["Super Admin","Customer Service","Operasional"]]
        }
      },
      location: {
        type: Sequelize.ENUM("Jakarta","Makassar","Medan","Surabaya"),
        allowNull: false,
        validate:{
          isIn:[["Jakarta","Makassar","Medan","Surabaya"]]
        }
      },
      user_image: {
        type: Sequelize.STRING,
        allowNull: true,
        validate:{
          isUrl: true
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
    await queryInterface.dropTable('users');
  }
};
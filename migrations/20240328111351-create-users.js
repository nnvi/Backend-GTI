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
        defaultValue : Sequelize.UUIDV4        
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING(100)
      },
      password: {
        type: Sequelize.STRING(100)
      },
      role: {
        type: Sequelize.ENUM("Super Admin","Customer Service","Operasional")
      },
      location: {
        type: Sequelize.ENUM("Jakarta","Makassar","Medan","Surabaya")
      },
      user_image: {
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
    await queryInterface.dropTable('users');
  }
};
'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      user_uuid: uuidv4(),
      name: "SPV 1",
      email: "superadmin@giant.com",
      password: "$2b$10$fzwCu3A5AxnuFCDTkLQdnOMUrYDPHHs0KO9fNL0H1xhXfvPQSi50q",// password: superadmin
      role: "Super Admin",
      location: "Jakarta",
      user_image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

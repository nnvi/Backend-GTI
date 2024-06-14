'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      uuid: uuidv4(),
      name: "SPV 1",
      email: "superadmin@giant.com",
      password: "$2b$10$fzwCu3A5AxnuFCDTkLQdnOMUrYDPHHs0KO9fNL0H1xhXfvPQSi50q",// password: superadmin
      role: "Super Admin",
      location: "Jakarta",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "SPV 2",
      email: "superadmin2@giant.com",
      password: "$2b$10$ZvU/OvfUICnjaSd8mfkJ5enQnc8RTs0pm51g2Si19h61GBrPcOHri",// password: superadmin2
      role: "Super Admin",
      location: "Medan",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "SPV 3",
      email: "superadmin3@giant.com",
      password: "$2b$10$zonwJNGrviOL3ZExWXdm.O7rkWwNg6yjxBQnJwP97SHAebJMAPgz.",// password: superadmin3
      role: "Super Admin",
      location: "Surabaya",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "CS 1",
      email: "customerservice@giant.com",
      password: "$2b$10$mXzjbWzrjEbVzJ1JSKtaeukyqFCVGCb6B7Fdz8U4SobLYUIXd6k5S",// password: customerservice
      role: "Customer Service",
      location: "Jakarta",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "OPR 1",
      email: "operational@giant.com",
      password: "$2b$10$jV4dMgCkSCxZYAhG7eo0oOA6B2q9wOjtpRL3akphGwLz.278OFzrW",// password: operational
      role: "Operasional",
      location: "Jakarta",
      image: "https://source.unsplash.com/200x200/?woman",
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

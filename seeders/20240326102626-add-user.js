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
      password: "$2y$10$cucalmUwA8lWYKKsVAqmj.ri2.ITCK74vBeqwTxuGQmU5UiPWBU8K",// password: superadmin2
      role: "Super Admin",
      location: "Medan",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "SPV 3",
      email: "superadmin3@giant.com",
      password: "$2y$10$d1URa9Q4qmn6HJdnqXiXH.uDZYnlFPTLNdG4AGFJCCiubCU6fFRK6",// password: superadmin3
      role: "Super Admin",
      location: "Surabaya",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "CS 1",
      email: "customerservice@giant.com",
      password: "$2y$10$n7f3Aw0PrsIYMArv8BOUIeh3J1hCPU9xW9rcL7Ubwr7RWz3Ct/2ry",// password: customerservice
      role: "Customer Service",
      location: "Jakarta",
      image: "https://source.unsplash.com/200x200/?woman",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      name: "OPR 1",
      email: "operational@giant.com",
      password: "$2y$10$hDkqS0WFZLOQ2pUTowqs4eNDLBeIgbO9GD5/1Hq4WlfHmHZRqaNne",// password: operational
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

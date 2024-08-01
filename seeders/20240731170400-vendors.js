'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('vendors', [{
      name:"TANTO",
      book_code:"TNT",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:"SPIL",
      book_code:"SPIL",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:"MERATUS",
      book_code:"MRT",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:"TEMAS",
      book_code:"TMS",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
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

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('shipment_containers', [{
      container_id:"11",
      shipment_id:"1",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"12",
      shipment_id:"2",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"13",
      shipment_id:"3",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"14",
      shipment_id:"4",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"15",
      shipment_id:"5",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"16",
      shipment_id:"6",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"17",
      shipment_id:"7",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"18",
      shipment_id:"8",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"19",
      shipment_id:"9",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      container_id:"20",
      shipment_id:"10",
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

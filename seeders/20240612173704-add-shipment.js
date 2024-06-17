'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('shipments', [{
      uuid: uuidv4(),
      number: "GTIBLWRFR001035",
      user_id: "1",      
      status: "Departure",
      shipment_detail_id: "1",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001036",
      user_id: "2",
      status: "Arrive",
      shipment_detail_id: "2",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001034",
      user_id: "3",
      status: "Arrive",
      shipment_detail_id: "3",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001029",
      user_id: "2",
      status: "Arrive",
      shipment_detail_id: "4",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001037",
      user_id: "3",
      status: "Departure",
      shipment_detail_id: "5",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001033",
      user_id: "1",
      status: "Arrive",
      shipment_detail_id: "6",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001031",
      user_id: "1",
      status: "Arrive",
      shipment_detail_id: "7",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001028",
      user_id: "2",
      status: "Arrive",
      shipment_detail_id: "8",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001025",
      user_id: "1",
      status: "Departure",
      shipment_detail_id: "9",
      active_status:"true",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTIBLWRFR001016",
      user_id: "3",
      status: "Departure",
      shipment_detail_id: "10",
      active_status:"true",
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

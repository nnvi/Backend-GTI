'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('containers', [{
      //ready
      uuid: uuidv4(),
      number: "GTRU8380165",
      user_id: "1",
      age: "4",
      location: "Jakarta",
      iddle_days: "85",
      type: "20 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "PCIU5821159",
      user_id: "1",
      age: "5",
      location: "Jakarta",
      iddle_days: "70",
      type: "20 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU8380191",
      user_id: "1",
      age: "3",
      location: "Jakarta",
      iddle_days: "74",
      type: "20 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "SCTU1807483",
      user_id: "1",
      age: "5",
      location: "Surabaya",
      iddle_days: "13",
      type: "20 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU880113",
      user_id: "1",
      age: "6",
      location: "Surabaya",
      iddle_days: "70",
      type: "40 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTSU8680103",
      user_id: "1",
      age: "3",
      location: "Surabaya",
      iddle_days: "18",
      type: "20 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8880361",
      user_id: "1",
      age: "4",
      location: "Medan",
      iddle_days: "48",
      type: "40 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTMU8880049",
      user_id: "1",
      age: "4",
      location: "Medan",
      iddle_days: "19",
      type: "40 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8880248",
      user_id: "1",
      age: "6",
      location: "Medan",
      iddle_days: "36",
      type: "40 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU8880155",
      user_id: "1",
      age: "2",
      location: "Medan",
      iddle_days: "36",
      type: "40 feet",
      status: "Ready",
      createdAt: new Date(),
      updatedAt: new Date()
    },{//in use
      uuid: uuidv4(),
      number: "GTNU8880356",
      user_id: "1",
      age: "4",
      location: "Medan",
      iddle_days: "0",
      type: "20 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8880084",
      user_id: "1",
      age: "2",
      location: "Medan",
      iddle_days: "0",
      type: "40 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU8380273",
      user_id: "1",
      age: "2",
      location: "Medan",
      iddle_days: "0",
      type: "20 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "PCIU5821950",
      user_id: "1",
      age: "2",
      location: "Jakarta",
      iddle_days: "0",
      type: "20 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8380392",
      user_id: "1",
      age: "3",
      location: "Jakarta",
      iddle_days: "0",
      type: "40 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8380237",
      user_id: "1",
      age: "5",
      location: "Jakarta",
      iddle_days: "0",
      type: "20 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8880145",
      user_id: "1",
      age: "5",
      location: "Medan",
      iddle_days: "0",
      type: "40 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8880206",
      user_id: "1",
      age: "2",
      location: "Medan",
      iddle_days: "0",
      type: "40 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8880124",
      user_id: "1",
      age: "2",
      location: "Medan",
      iddle_days: "0",
      type: "20 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "PCIU5824883",
      user_id: "1",
      age: "1",
      location: "Medan",
      iddle_days: "0",
      type: "20 feet",
      status: "In-Use",
      createdAt: new Date(),
      updatedAt: new Date()
    },{//REPAIR
      uuid: uuidv4(),
      number: "GTRU8880052",
      user_id: "1",
      age: "2",
      location: "Jakarta",
      iddle_days: "21",
      type: "20 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GESU9166609",
      user_id: "1",
      age: "4",
      location: "Surabaya",
      iddle_days: "18",
      type: "20 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU83801444",
      user_id: "1",
      age: "3",
      location: "Jakarta",
      iddle_days: "20",
      type: "40 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU8380313",
      user_id: "1",
      age: "3",
      location: "Jakarta",
      iddle_days: "15",
      type: "20 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "PCIU5820337",
      user_id: "1",
      age: "1",
      location: "Medan",
      iddle_days: "17",
      type: "40 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "gtru8380015",
      user_id: "1",
      age: "5",
      location: "Medan",
      iddle_days: "20",
      type: "40 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU8380150",
      user_id: "1",
      age: "1",
      location: "Medan",
      iddle_days: "23",
      type: "20 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTRU8380057",
      user_id: "1",
      age: "2",
      location: "Medan",
      iddle_days: "10",
      type: "20 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "GTNU8380057",
      user_id: "1",
      age: "1",
      location: "Jakarta",
      iddle_days: "0",
      type: "40 feet",
      status: "Repair",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      number: "SCTU1807992",
      user_id: "1",
      age: "2",
      location: "Surabaya",
      iddle_days: "76",
      type: "20 feet",
      status: "Repair",
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

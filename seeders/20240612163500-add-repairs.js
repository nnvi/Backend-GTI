'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('repairs', [{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"21",
      remarks:" COIL BOCOR",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"22",
      remarks:"REPAIR COIL",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"23",
      remarks:"KEYPAD TIDAK BERFUNGSI",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"24",
      remarks:"KOMPRESOR KASAR DAN OVERHEAT",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"25",
      remarks:"INDIKASI KEBOCORAN PADA EVAP KOIL",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"26",
      remarks:"KOMPRESI DAN EKSPANSI",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"27",
      remarks:"GASKET PINTU LEPAS",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"28",
      remarks:"MICROLING DIKANIBAL KE UNIT LAIN",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"29",
      remarks:"UNIT DISPLAY&FUSE DI CANIBAL KE UNIT LAIN",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      uuid: uuidv4(),
      user_id:"1",
      container_id:"30",
      remarks:"KOMPRESOR DIKANIBAL KE UNIT LAIN",
      finish:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },])
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

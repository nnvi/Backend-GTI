'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('shipment_details', [{
      POL:"BLW",
      POD:"TRK",
      ETD:"2024-06-07",
      ETA:"2024-06-21",
      stuffing_date:"2024-06-05",
      shipper:"CV. EYA BERKAH BERJAYA",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"BLW",
      POD:"BTM",
      ETD:"2024-06-08",
      ETA:"2024-06-12",
      stuffing_date:"2024-06-06",
      shipper:"PT. CHAROEN POKPHAND",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"JKT",
      POD:"BLW",
      ETD:"2024-06-05",
      ETA:"2024-06-08",
      stuffing_date:"2024-06-04",
      shipper:"PT. LAUTAN PERSADA",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"BLW",
      POD:"BTM",
      ETD:"2024-05-05",
      ETA:"2024-05-08",
      stuffing_date:"2024-05-04",
      shipper:"PT. CHAROEN POKPHAND",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"JKT",
      POD:"PTK",
      ETD:"2024-06-10",
      ETA:"2024-06-12",
      stuffing_date:"2024-06-09",
      shipper:"CV. DWIJAYA GEMILANG KALBAR",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"JKT",
      POD:"BLW",
      ETD:"2024-06-01",
      ETA:"2024-06-04",
      stuffing_date:"2024-05-28",
      shipper:"PT. BUMI MENARA INTERNUSA",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"BLW",
      POD:"JKT",
      ETD:"2024-05-17",
      ETA:"2024-05-20",
      stuffing_date:"2024-05-14",
      shipper:"PT. JUMA BERLIAN EXIM",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"BLW",
      POD:"PTK",
      ETD:"2024-05-10",
      ETA:"2024-05-21",
      stuffing_date:"2024-05-06",
      shipper:"JAMES TARIGAN",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"BLW",
      POD:"JKT",
      ETD:"2024-04-30",
      ETA:"2024-04-27",
      stuffing_date:"2024-05-27",
      shipper:"CIPTA GINTING",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      POL:"BLW",
      POD:"JKT",
      ETD:"2024-04-24",
      ETA:"2024-04-27",
      stuffing_date:"2024-04-18",
      shipper:"PT. EXPRAVET NASUBA",
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

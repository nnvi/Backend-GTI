const { Sequelize, container } = require('../models');

async function incrementIddleDays() {
  try {
    await container.update(
      { iddle_days: Sequelize.literal('iddle_days + 1') }
    );
    console.log('iddle_days updated successfully');
  } catch (error) {
    console.error('Error updating iddle_days:', error);
  }
}

module.exports = incrementIddleDays
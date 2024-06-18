const cron = require('node-cron');
const { Sequelize, container } = require('../models');

// Function to increment iddle_days
async function incrementIddleDays() {
  try {
    await container.update(
      { iddle_days: Sequelize.literal('iddle_days + 1') },
      { where: {} }
    );
    console.log('iddle_days updated successfully');
  } catch (error) {
    console.error('Error updating iddle_days:', error);
  }
}

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily update job');
  incrementIddleDays();
});

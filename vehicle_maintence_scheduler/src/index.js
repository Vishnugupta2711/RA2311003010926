const express = require('express');
const router = express.Router();

const vehicleRoutes = require('./routes/vehicle.routes');
const bookingRoutes = require('./routes/booking.routes');

/**
 * Module Router for Vehicle Maintenance Scheduler
 */

// We won't prefix them here to keep the route mapping explicitly controlled by the root server.js,
// or we can export an object of routes. Since the prompt asks for specific REST paths, 
// we will export them to be mounted cleanly at the root.

module.exports = {
  vehicleRoutes,
  bookingRoutes
};

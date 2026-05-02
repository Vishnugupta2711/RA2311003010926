const Vehicle = require('../models/Vehicle');
const { Log } = require('../../../logging_middleware/logger');

const createVehicle = async (payload) => {
  const existing = await Vehicle.findByNumber(payload.vehicleNumber);
  if (existing) {
    Log('backend', 'warn', 'service', `Duplicate vehicle rejected: ${payload.vehicleNumber}`);
    const err = new Error('Vehicle exists');
    err.code = 11000;
    throw err;
  }

  const newCar = await Vehicle.insert({
    ...payload,
    vehicleNumber: payload.vehicleNumber.toUpperCase()
  });
  
  Log('backend', 'info', 'service', `Vehicle registered: ${newCar.id}`);
  return newCar;
};

const getVehicles = async () => {
  const vehicles = await Vehicle.readAll();
  return vehicles.reverse();
};

module.exports = {
  createVehicle,
  getVehicles
};

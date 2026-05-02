const vehicleService = require('../services/vehicle.service');

const addVehicle = async (req, res, next) => {
  try {
    const { ownerName, vehicleNumber, model, serviceType, lastServiceDate } = req.body;

    // Quick validation
    if (!ownerName || !vehicleNumber || !model || !serviceType) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const vehicle = await vehicleService.createVehicle({
      ownerName, vehicleNumber, model, serviceType, lastServiceDate
    });
    
    return res.status(201).json({ message: 'Vehicle added', id: vehicle.id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Vehicle number already exists' });
    }
    next(err);
  }
};

const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getVehicles();
    return res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addVehicle,
  getAllVehicles
};

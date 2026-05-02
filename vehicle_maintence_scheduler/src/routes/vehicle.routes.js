const router = require('express').Router();
const vehicleController = require('../controllers/vehicle.controller');

router.post('/', vehicleController.addVehicle);
router.get('/', vehicleController.getAllVehicles);

module.exports = router;

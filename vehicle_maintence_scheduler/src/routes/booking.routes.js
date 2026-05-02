const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.put('/:id', bookingController.updateBookingStatus);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

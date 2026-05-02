const BookingService = require('../services/booking.service');

const validSlots = ['Morning', 'Afternoon', 'Evening'];
const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

class BookingController {
  async createBooking(req, res, next) {
    try {
      const { vehicleId, bookingDate, slot } = req.body;

      if (!vehicleId || !bookingDate || !slot) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      if (!validSlots.includes(slot)) {
         return res.status(400).json({ error: 'Invalid slot' });
      }

      const requestedDate = new Date(bookingDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      
      if (requestedDate < today) {
        return res.status(400).json({ error: 'Date must be in the future' });
      }

      const booking = await BookingService.create({ vehicleId, bookingDate, slot });
      return res.status(201).json({ message: 'Booking created', id: booking.id });

    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ error: 'Slot already taken' });
      if (err.message === 'Vehicle not found') return res.status(404).json({ error: 'Vehicle not found' });
      next(err);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const bookings = await BookingService.getAll();
      return res.status(200).json(bookings);
    } catch (err) {
      next(err);
    }
  }

  async updateBookingStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      await BookingService.updateStatus(req.params.id, status);
      return res.status(200).json({ message: 'Booking updated' });
    } catch (err) {
      if (err.message === 'Booking not found') return res.status(404).json({ error: 'Not found' });
      next(err);
    }
  }

  async deleteBooking(req, res, next) {
    try {
      await BookingService.delete(req.params.id);
      return res.status(200).json({ message: 'Booking deleted' });
    } catch (err) {
      if (err.message === 'Booking not found') return res.status(404).json({ error: 'Not found' });
      next(err);
    }
  }
}

module.exports = new BookingController();

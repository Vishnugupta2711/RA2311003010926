const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { Log } = require('../../../logging_middleware/logger');

class BookingService {
  async create(payload) {
    const conflict = await Booking.findByCollision(payload.vehicleId, payload.bookingDate, payload.slot);
    if (conflict) {
      const err = new Error('Slot occupied');
      err.code = 11000;
      throw err;
    }

    const vehicleExists = await Vehicle.findById(payload.vehicleId);
    if (!vehicleExists) throw new Error('Vehicle not found');

    const booking = await Booking.insert({ ...payload, status: 'Pending' });
    Log('backend', 'info', 'service', `New booking created: ${booking.id}`);
    
    return booking;
  }

  async getAll() {
    const bookings = await Booking.readAll();
    const vehicles = await Vehicle.readAll();

    // Attach vehicle metadata to bookings
    const populated = bookings.map(b => {
      const v = vehicles.find(vec => vec.id === b.vehicleId);
      return {
        ...b,
        vehicleId: v ? { id: v.id, ownerName: v.ownerName, vehicleNumber: v.vehicleNumber } : b.vehicleId
      };
    });

    return populated.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));
  }

  async updateStatus(id, status) {
    const updated = await Booking.updateById(id, { status });
    if (!updated) throw new Error('Booking not found');
    
    return updated;
  }

  async delete(id) {
    const deleted = await Booking.deleteById(id);
    if (!deleted) throw new Error('Booking not found');
    
    return deleted;
  }
}

module.exports = new BookingService();

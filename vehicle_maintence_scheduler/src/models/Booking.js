const JSONStore = require('../../../shared/utils/jsonStore');

class BookingModel extends JSONStore {
  constructor() {
    super('bookings');
  }

  // Prevents double booking simulation
  async findByCollision(vehicleId, bookingDate, slot) {
    const data = await this.readAll();
    return data.find(b => 
      b.vehicleId === vehicleId && 
      b.bookingDate === bookingDate && 
      b.slot === slot
    );
  }
}

module.exports = new BookingModel();

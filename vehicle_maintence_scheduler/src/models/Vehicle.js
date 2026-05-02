const JSONStore = require('../../../shared/utils/jsonStore');

class VehicleModel extends JSONStore {
  constructor() {
    super('vehicles');
  }

  // Find vehicle by exact number
  async findByNumber(vehicleNumber) {
    const data = await this.readAll();
    return data.find(v => v.vehicleNumber.toUpperCase() === vehicleNumber.toUpperCase());
  }
}

module.exports = new VehicleModel();

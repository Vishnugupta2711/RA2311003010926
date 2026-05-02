const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const paths = {
  vehicles: path.join(DATA_DIR, 'vehicles.json'),
  bookings: path.join(DATA_DIR, 'bookings.json'),
  notifications: path.join(DATA_DIR, 'notifications.json')
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Prevent double seeding
try {
  if (fs.existsSync(paths.vehicles) && JSON.parse(fs.readFileSync(paths.vehicles, 'utf8')).length > 0) {
    console.log('Database already seeded. Aborting.');
    process.exit(0);
  }
} catch (e) {
  // File might not exist or be invalid, safe to proceed
}

console.log('Starting seed...');

const getISO = (daysOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const genUUID = () => crypto.randomUUID();

const owners = ['Vishnu Gupta', 'Rahul Sharma', 'Priya Verma', 'Arjun Mehta', 'Sneha Iyer', 'Karan Patel', 'Neha Singh'];
const vTypes = [
  { model: 'Honda City', type: 'Car' },
  { model: 'Royal Enfield Classic 350', type: 'Bike' },
  { model: 'Mahindra Thar', type: 'SUV' },
  { model: 'Tata Nexon EV', type: 'EV' },
  { model: 'Ather 450X', type: 'Scooter' }
];
const states = ['KA-01', 'MH-12', 'DL-01', 'TN-09', 'UP-32'];
const services = ['General Service', 'Oil Change', 'Battery Replacement', 'Brake Pad Replacement'];
const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const slots = ['Morning', 'Afternoon', 'Evening'];
const notifyChannels = ['EMAIL', 'SMS', 'PUSH'];

// Build collections
const vehicles = Array.from({ length: 15 }, () => {
  const v = randomItem(vTypes);
  return {
    id: genUUID(),
    ownerName: randomItem(owners),
    vehicleNumber: `${randomItem(states)}-${String.fromCharCode(65 + Math.random() * 26)}${String.fromCharCode(65 + Math.random() * 26)}-${Math.floor(1000 + Math.random() * 9000)}`,
    model: v.model,
    serviceType: randomItem(services),
    lastServiceDate: getISO(-Math.floor(Math.random() * 300)),
    createdAt: getISO(-100),
    updatedAt: getISO(-10)
  };
});

const bookings = Array.from({ length: 20 }, () => ({
  id: genUUID(),
  vehicleId: randomItem(vehicles).id,
  bookingDate: getISO(Math.floor(Math.random() * 60) - 10).split('T')[0],
  slot: randomItem(slots),
  status: randomItem(statuses),
  createdAt: getISO(-30),
  updatedAt: getISO(-2)
}));

const notifications = Array.from({ length: 25 }, () => {
  const channel = randomItem(notifyChannels);
  let recipient = `user${Math.floor(Math.random() * 99)}@example.com`;
  if (channel === 'SMS') recipient = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
  if (channel === 'PUSH') recipient = `device_${crypto.randomBytes(4).toString('hex')}`;

  return {
    id: genUUID(),
    channel,
    recipient,
    message: 'Generic system notification',
    status: Math.random() > 0.1 ? 'SENT' : 'FAILED',
    retryCount: Math.floor(Math.random() * 3),
    metadata: {},
    createdAt: getISO(-15),
    updatedAt: getISO(-1)
  };
});

// Write to files
const save = (filepath, data) => fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
save(paths.vehicles, vehicles);
save(paths.bookings, bookings);
save(paths.notifications, notifications);

console.log('Seed complete. Generated 15 vehicles, 20 bookings, and 25 notifications.');

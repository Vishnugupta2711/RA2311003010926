# Backend Evaluation Track

This is a simple Node/Express backend I built for the evaluation track. 

It handles vehicle maintenance scheduling and async notifications. Since the requirement was to avoid external databases like MongoDB, I wrote a custom JSON file storage engine (`JSONStore`) to keep everything local and fast.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Env setup**
   Just copy the example file. No complex keys needed.
   ```bash
   cp .env.example .env
   ```

3. **Populate demo data**
   Run the seeder to populate `data/` with around 60 dummy records so you have something to test right away.
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:3000`.

## Features
- **Vehicle Scheduler**: Simple CRUD for vehicles and maintenance bookings. Handles slot collisions (prevents double-booking).
- **Notifications Engine**: Exposes endpoints to send emails, SMS, and push. Instead of a real message queue (like RabbitMQ), it simulates async background jobs directly in Node's event loop with a basic retry logic.
- **Logging**: Writes everything to `logs/app.log` and rotates files when they hit 5MB.

## API Reference

### Vehicles & Booking
- `POST /api/vehicles` - Add a vehicle
- `GET /api/vehicles` - List vehicles
- `POST /api/schedule` - Book a service slot
- `GET /api/schedule` - View bookings
- `PUT /api/schedule/:id` - Update status (Pending, Confirmed, etc)
- `DELETE /api/schedule/:id` - Cancel booking

### Notifications
- `POST /api/notify/email`
- `POST /api/notify/sms`
- `GET /api/notify/history`

## Testing Example
Try posting an email notification. It will immediately return a `202 Accepted` while the simulated worker attempts to "send" it in the background.
```bash
curl -X POST http://localhost:3000/api/notify/email \
-H "Content-Type: application/json" \
-d '{"recipient": "me@example.com", "message": "Test"}'
```
Check `GET /api/notify/history` a few seconds later to see if the worker marked it as `SENT` or `FAILED`.

## Notes
I chose to use native `fs.promises` instead of a heavy DB because it fit the local-only constraints perfectly. The trade-off is that concurrent writes can be risky under extreme load, but it works flawlessly for typical evaluation traffic.

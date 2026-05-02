require('dotenv').config();
const express = require('express');
const cors = require('cors');

const responseTimeLogger = require('./shared/middlewares/responseTime');
const globalErrorHandler = require('./shared/middlewares/errorHandler');
const { vehicleRoutes, bookingRoutes } = require('./vehicle_maintence_scheduler/src');
const notificationRoutes = require('./notification_app_be/src');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTimeLogger);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Local JSON mode active' });
});

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/schedule', bookingRoutes);
app.use('/api/notify', notificationRoutes);

app.use((req, res) => res.status(404).json({ error: 'Endpoint Not Found' }));
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

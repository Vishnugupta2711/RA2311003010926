const { Log } = require('./logger');

/**
 * Demonstrates the 5 required usage scenarios for the local logging middleware.
 */
const runExamples = () => {
  console.log('--- Starting Local Logger Examples ---\n');

  // 1. Route Accessed
  console.log('1. Simulating a Route Access:');
  const routeResult = Log('backend', 'info', 'route', 'GET /api/v1/vehicles endpoint accessed by client 192.168.1.100');
  console.log('Result:', routeResult, '\n');

  // 2. Controller Success
  console.log('2. Simulating a Controller Success:');
  const controllerResult = Log('backend', 'debug', 'controller', 'Successfully processed payload and returned 201 Created for vehicle creation.');
  console.log('Result:', controllerResult, '\n');

  // 3. Validation Warning (Input Validation failed in the route/controller)
  console.log('3. Simulating a Validation Warning:');
  const validationResult = Log('backend', 'warn', 'handler', 'Payload rejected: Missing required field "ownerName". Returning 400 Bad Request.');
  console.log('Result:', validationResult, '\n');

  // 4. Database Simulated Error
  console.log('4. Simulating a Database Error:');
  const dbResult = Log('backend', 'error', 'db', 'JSONStore Error: Permission denied when attempting to write to bookings.json.');
  console.log('Result:', dbResult, '\n');

  // 5. Fatal Crash
  console.log('5. Simulating a Fatal System Crash:');
  const fatalResult = Log('backend', 'fatal', 'service', 'OutOfMemoryError: The node process exceeded heap limits while generating history export.');
  console.log('Result:', fatalResult, '\n');

  // Bonus: Middleware Input Validation Failure
  console.log('Bonus: Simulating Logger Input Validation Failure:');
  const invalidResult = Log('backend', 'info', 'invalid_package_name', 'This will fail logger validation.');
  console.log('Result:', invalidResult, '\n');
};

// Execute if run directly
if (require.main === module) {
  runExamples();
}

module.exports = { runExamples };

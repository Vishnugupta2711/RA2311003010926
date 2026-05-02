const { validateLogInputs } = require('./validation');
const { writeToFile } = require('./fileLogger');

const Log = (stack, level, packageName, message) => {
  try {
    const error = validateLogInputs(stack, level, packageName, message);
    if (error) {
      console.warn(`[LOGGER WARNING] ${error}`);
      return;
    }

    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${packageName}] - ${message}`;

    if (level === 'error' || level === 'fatal') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }

    writeToFile(formatted);
  } catch (err) {
    // Fail silently in production
    console.error(`Logger crashed internally: ${err.message}`);
  }
};

module.exports = { Log };

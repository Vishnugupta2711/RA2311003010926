const { Log } = require('./logger');
const { validateLogInputs } = require('./validation');
const { writeToFile } = require('./fileLogger');

module.exports = {
  Log,
  validateLogInputs,
  writeToFile
};

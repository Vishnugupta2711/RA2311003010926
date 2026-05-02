const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const rotateLogIfNeeded = () => {
  if (!fs.existsSync(LOG_FILE)) return;
  
  const stats = fs.statSync(LOG_FILE);
  if (stats.size >= MAX_SIZE) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    fs.renameSync(LOG_FILE, path.join(LOG_DIR, `app-${ts}.log`));
  }
};

const writeToFile = (message) => {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    
    rotateLogIfNeeded();
    fs.appendFileSync(LOG_FILE, `${message}\n`, 'utf8');
  } catch (err) {
    console.error(`File write error: ${err.message}`);
  }
};

module.exports = { writeToFile };

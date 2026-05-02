const NotificationLog = require('../models/NotificationLog');
const { Log } = require('../../../logging_middleware/logger');

class NotificationService {
  async queue(channel, recipient, message, metadata = {}) {
    const record = await NotificationLog.insert({
      channel,
      recipient,
      message,
      status: 'PENDING',
      retryCount: 0,
      metadata
    });

    // Don't await this—let it process in the background
    this._processAsync(record.id).catch(err => 
      Log('backend', 'error', 'service', `Worker crash on ${record.id}: ${err.message}`)
    );

    return record;
  }

  async getHistory(limit = 50) {
    const history = await NotificationLog.readAll();
    return history.reverse().slice(0, limit);
  }

  async _processAsync(id, maxRetries = 3) {
    let attempt = 0;

    while (attempt <= maxRetries) {
      attempt++;
      
      try {
        await new Promise(r => setTimeout(r, 500)); // Network delay
        
        // 30% synthetic failure to test retries
        if (Math.random() < 0.3) throw new Error('Third-party API Timeout');

        await NotificationLog.updateById(id, { status: 'SENT', retryCount: attempt - 1 });
        return; 
      } catch (error) {
        if (attempt > maxRetries) {
          await NotificationLog.updateById(id, { status: 'FAILED', retryCount: attempt - 1 });
          Log('backend', 'warn', 'service', `Notification ${id} moved to DLQ after ${maxRetries} retries`);
          return;
        }
        
        // Exponential backoff
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
  }
}

module.exports = new NotificationService();

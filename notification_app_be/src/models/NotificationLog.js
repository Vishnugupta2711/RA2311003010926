const JSONStore = require('../../../shared/utils/jsonStore');

class NotificationLogModel extends JSONStore {
  constructor() {
    super('notifications');
  }
}

module.exports = new NotificationLogModel();

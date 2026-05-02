const NotificationService = require('../services/notification.service');

const sendEmail = async (req, res, next) => {
  try {
    const { recipient, message, metadata } = req.body;
    if (!recipient || !message) return res.status(400).json({ error: 'Missing fields' });
    
    await NotificationService.queue('EMAIL', recipient, message, metadata);
    res.status(202).json({ message: 'Email queued' });
  } catch (err) {
    next(err);
  }
};

const sendSms = async (req, res, next) => {
  try {
    const { recipient, message, metadata } = req.body;
    if (!recipient || !message) return res.status(400).json({ error: 'Missing fields' });
    
    await NotificationService.queue('SMS', recipient, message, metadata);
    res.status(202).json({ message: 'SMS queued' });
  } catch (err) {
    next(err);
  }
};

const sendPush = async (req, res, next) => {
  try {
    const { recipient, message, metadata } = req.body;
    if (!recipient || !message) return res.status(400).json({ error: 'Missing fields' });
    
    await NotificationService.queue('PUSH', recipient, message, metadata);
    res.status(202).json({ message: 'Push queued' });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const history = await NotificationService.getHistory(limit);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendEmail,
  sendSms,
  sendPush,
  getHistory
};

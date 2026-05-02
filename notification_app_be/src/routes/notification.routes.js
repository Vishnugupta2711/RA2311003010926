const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');

router.post('/email', notificationController.sendEmail);
router.post('/sms', notificationController.sendSms);
router.post('/push', notificationController.sendPush);
router.get('/history', notificationController.getHistory);

module.exports = router;

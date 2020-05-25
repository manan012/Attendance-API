const express = require('express');

const router = express.Router();

const sign = require('../controllers/users');
const attendance = require('../controllers/attendance');
const userAuth = require('../middleware/userAuth');

router.post('/register',sign.register);
router.post('/login',sign.login);
router.post('/attendance',userAuth, attendance.markAttendance);

router.get('/attendance/:userId', attendance.getAttendanceById);

module.exports = router;
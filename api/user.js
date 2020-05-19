const express = require('express');

const router = express.Router();

const sign = require('../controllers/users');

router.post('/register',sign.register);
router.post('/login',sign.login);

module.exports = router;
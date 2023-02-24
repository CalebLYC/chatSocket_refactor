const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.createUser);
router.post('/connect', userController.connect);
router.post('/login', userController.login);

module.exports = router;
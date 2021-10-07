// Importation de Express
const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

// Route de signup et login
router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);


module.exports = router;

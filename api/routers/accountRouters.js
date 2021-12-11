const express = require('express');
const { createNewAccount, login } = require('../controllers/accountControllers');

const router = express.Router();

router.post('/create', createNewAccount);

router.post('/login', login);

module.exports = router;
const express = require('express');
const { createNewAccount, login, deposit } = require('../controllers/accountControllers');

const router = express.Router();

router.post('/create', createNewAccount);

router.post('/login', login);

router.post('/deposit', deposit);

module.exports = router;
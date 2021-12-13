const express = require('express');
const {
  createNewAccount,
  login,
  deposit,
  transfer,
} = require('../controllers/accountControllers');

const router = express.Router();

router.post('/create', createNewAccount);

router.post('/login', login);

router.post('/deposit', deposit);

router.put('/transfer', transfer);

module.exports = router;
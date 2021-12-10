const express = require('express');
const { createNewAccount } = require('../controllers/accountControllers');

const router = express.Router();

router.post('/create', createNewAccount);

module.exports = router;
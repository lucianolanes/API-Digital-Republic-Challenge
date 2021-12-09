const express = require('express');
const { createNewUser } = require('../controllers/userControllers');

const router = express.Router();

router.post('/', createNewUser);

module.exports = router;
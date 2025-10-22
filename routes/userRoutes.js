const express = require('express');
const router = express.Router();
const {getAllUsers} = require('../controllers/usercontroller');

router.get('/',getAllUsers);

module.exports = router;
const express = require('express');
const route = express.Router()
const {order} = require('../controllers/ordercontroller');





route.post('/order',order);
route.get('/order',order);


module.exports = route;
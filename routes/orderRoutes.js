const express = require('express');
const route = express.Router()
const {createOrder,getOrders,deleteOrder,updateOrder} = require('../controllers/ordercontroller');





route.post('/',createOrder);
route.delete('/:id',deleteOrder);
route.get('/',getOrders);
route.put('/:id',updateOrder);


module.exports = route;
const express = require('express');
const router = express.Router();
const {
     getOverview,
  revenueOverTime,
  topItems,
  orderStatusCounts,
  paymentMethods,
  ordersByDay
} =  require('../controllers/analyticsController');

router.get('/overview',getOverview);
router.get('/revenue',revenueOverTime);
router.get('/top-items',topItems);
router.get('/status-counts',orderStatusCounts);
router.get('/payment-methods', paymentMethods);
router.get('/order-by-day',ordersByDay);

module.exports = router;
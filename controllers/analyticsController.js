const Order = require('../models/order');

// 📊 GET /api/analytics/overview
exports.getOverview = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // total revenue from completed orders
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      avgOrderValue
    });
  } catch (err) {
    console.error('Overview error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📈 GET /api/analytics/revenue?range=30
exports.revenueOverTime = async (req, res) => {
  try {
    const rangeDays = parseInt(req.query.range) || 30;
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - rangeDays + 1);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start }, status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const formatted = data.map((d) => {
      const { year, month, day } = d._id;
      return {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        revenue: d.revenue,
        orders: d.count,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Revenue over time error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🥇 GET /api/analytics/top-items?limit=5
exports.topItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await Order.aggregate([
      { $group: { _id: '$name', totalSales: { $sum: '$price' }, orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: limit },
    ]);

    const formatted = data.map((d) => ({
      name: d._id,
      totalSales: d.totalSales,
      orderCount: d.orderCount,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Top items error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🧾 GET /api/analytics/payment-methods
exports.paymentMethods = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const formatted = data.map((d) => ({
      method: d._id,
      count: d.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Payment method error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📅 GET /api/analytics/orders-by-day?range=7
exports.ordersByDay = async (req, res) => {
  try {
    const rangeDays = parseInt(req.query.range) || 7;
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - rangeDays + 1);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const formatted = data.map((d) => {
      const { year, month, day } = d._id;
      return {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        orders: d.orders,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Orders by day error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// 🧮 GET /api/analytics/status-counts
exports.orderStatusCounts = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const formatted = data.map((d) => ({
      status: d._id,
      count: d.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Order status counts error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


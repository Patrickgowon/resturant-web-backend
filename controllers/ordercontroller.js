const Order = require("../models/order");


const order = async(req,res) =>{
    try {
    let orders = [];

    if (Array.isArray(req.body)) {
      orders = req.body;
    } else {
      orders = [req.body];
    }

    for (const item of orders) {
      if (!item.name || !item.price) {
        return res.status(400).json({
          success: false,
          message: "Name and price are required",
        });
      }
    }

    // ✅ Save orders with customerInfo and paymentMethod
    const savedOrders = await Order.insertMany(orders);

    return res.json({
      success: true,
      message: "Orders saved successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
}

const orders = async(req,res) =>{
     try {
        const orders = await Order.find().sort({ createdAt: -1 });

        const formattedOrders = orders.map(order => ({
            id: order._id,
            item: {
                name: order.name,
                description: order.description,
                price: order.price,
                image: order.image
            },
            status: order.status,
            customer: order.customerInfo || {},
            paymentMethod: order.paymentMethod || "",
            createdAt: order.createdAt
        }));

        res.json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
    }
}
module.exports = {order,orders}
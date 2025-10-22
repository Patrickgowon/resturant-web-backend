const Order = require("../models/order");


const createOrder = async(req,res) =>{
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

const getOrders = async(req,res) =>{
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

// delete order
const deleteOrder = async(req,res) => {
    try {
        const orderid = req.params.id
        const deleteorder = await Order.findByIdAndDelete(orderid)
        res.status(200).json({message:'order deleted successfully',deleteorder});
      } catch (error) {
        console.log('server error',error);
      }
}

//order update
const updateOrder =async (req,res) => {
    try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
}

module.exports = {createOrder,getOrders,deleteOrder,updateOrder}
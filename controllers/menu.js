const Menu = require('../models/menu'); 

// Create new menu item (from admin)
const menuOrder = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const newMenu = new Menu({ name, price, description, image }); // ✅ Use Menu model
    await newMenu.save();

    res.json({ success: true, message: 'Meal added successfully', menu: newMenu });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({ success: false, message: 'Failed to add meal' });
  }
};

// Fetch all menu items (for users)
const menuCreate = async (req, res) => {
  try {
    const menus = await Menu.find(); // ✅ Use Menu model, not menu
    res.json({ success: true, menu: menus });
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch meals' });
  }
};

// delete item

const deleteMenu = async(req,res) =>{
    try {
        const {id} = req.params;
        const deleteMenu = await Menu.findByIdAndDelete(id);

        if(!deleteMenu){
            return res.status(400).json({success: false,message: 'menu item not found'});

        }

        res.json({success: true,message:'menu item deleted successfully',deleteMenu});

    } catch (error) {
        console.error('error deletin menu',error);
        res.status(500).json({success:false,message:'failed to delete menu item'})
    }
}

module.exports = { menuOrder, menuCreate, deleteMenu };

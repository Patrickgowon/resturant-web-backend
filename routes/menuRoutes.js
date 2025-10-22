const express = require('express');
const router = express.Router();
const { menuOrder, menuCreate,deleteMenu } = require('../controllers/menu');


router.post('/', menuOrder); 
router.get('/', menuCreate);  
router.delete('/:id', deleteMenu)

module.exports = router;

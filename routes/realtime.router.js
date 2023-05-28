const express = require ('express');
const { Router } = express;
const router = new Router();
const fs = require('fs');
const ProductManager = require('../api/ProductManager/ProductManager');

router.get('/', (req,res) => {

    res.render('realtimeproducts', {})
})




module.exports = router;
const fs = require('fs')
const express = require('express')
const { Router } = express
const ProductManager = require('../ProductManager/ProductManager')
const routerCart = new Router()
const CartManager = require('./cartManager')
const cartManager = new CartManager()


//esto crea el carrito o elimina todo lo que tiene dentro

routerCart.post('/', async (req, res) => {
    try {
        let isCartAdded = await cartManager.addCart();
        if (!isCartAdded) {
            console.log(`Cart cant added`)
            res.status(500).send(`Cart cant added`)
            return
        }
        res.send(isCartAdded)
    } catch (err) {
        console.log(`Error ${err}`)
        res.status(500).send(err);
    }
});

//le agrego productos con el id de los que estan cargados en productos.json

routerCart.post('/:cid/products/:pid', async (req, res) => {
    let prodId = req.params.pid
    let cartId = req.params.cid

    try {
        let cart = await cartManager.addingProductsCart(prodId,cartId)
        console.log(cart,22)
        if(cart == false){
            console.log(`Cart cant added`)
            res.status(500).send('error en añadir producto')
            return
        }
        res.send(cart)

    } catch (err) {
        res.status(500).send(err)
    }
})

//esto me carga el carrito con lo recibido arriba y me da el total de productos del mismo

routerCart.get('/:cid', async (req, res) => {
    let cartId = req.params.cid
    try {
        let prodInCart = await cartManager.getCartProductsById(cartId)
        if(!prodInCart){
            console.log(`cant get cart`)
            res.status(500).send('error en el servidor')
            return
        }
        res.status(200).send({ 'Carrito': prodInCart })
    } catch (err) {
        res.status(500).send('carrito vacio' + err)
    }

})

module.exports = routerCart  
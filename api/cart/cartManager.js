const fs = require('fs').promises;
const express = require('express');
const ProductManager = require('../ProductManager/ProductManager');
const uuid4 = require('uuid4');
let prodManager = new ProductManager('../ProductManager/productos.json');

class CartManager {
    constructor() {
        this.cart = [];
    }

    async addCart() {
        try {
            let carts = await this.getCartProducts()
            let newCart = {
                Cid: uuid4(),
                products: []
            }
            carts.push(newCart)
            this.carts = carts
            await fs.writeFile('./api/cart/cart.json', JSON.stringify(carts, null, 2), 'utf-8');
            return newCart
        }
        catch (err) {
            console.log(`Fail adding cart`);
            return false;
        }
    }

    async addingProductsCart(prodId, cartId) {
        try {
            let prodComplete = await prodManager.getProductsById(prodId);
            if (!prodComplete) {
                console.log('El producto no existe en stock');
                return false;
            }
            let cartProd = await this.getCartProducts();
            let cart = cartProd.find( cart => cart.Cid === cartId)
            if(!cart){
                console.log('No existe el carrito')
                return false
            }
            let existingCart = cart.products.find(product => product.id === prodId)
            console.log(existingCart,222)

            if(existingCart){
                existingCart.quantity += 1
            }  else {
                cart.products.push({
                    id : prodId,
                    quantity : 1
                })
            }
            
            this.cart = cartProd
            await fs.writeFile('./api/cart/cart.json', JSON.stringify(cartProd, null, 2), 'utf-8');
            return true;
        } catch (err) {
            console.log(err,222);
            return false;
        }
    }

    async getCartProducts() {
        try {
            let prod = await fs.readFile('./api/cart/cart.json', 'utf-8');
            let carts = []
            if (prod.length > 0) {
                carts = JSON.parse(prod)
            }
            this.cart = carts
            return carts;
        } catch (err) {
            await fs.writeFile('./api/cart/cart.json', JSON.stringify([], null, 2), 'utf-8');
            let carts = []
            this.carts = carts
            return carts
        }
    }

    async getCartProductsById(cid) {
        try {
            let prod = await fs.readFile('./api/cart/cart.json', 'utf-8');
            prod = JSON.parse(prod);
            let finding = prod.find(e => e.Cid === cid)
            console.log(finding)

            return finding;
        } catch (err) {
            console.log(err, 'Error en getCartProductsById');
            return false;
        }
    }

    async deleteCartProducts(id) {
        try {
            let a = this.getCartProductsById(id);
            this.cart = await fs.readFile('./api/cart/cart.json', 'utf-8');
            this.cart = JSON.parse(this.cart);
            this.cart = Object.values(this.cart);

            // Filtrar los productos y eliminar el que coincide con el ID dado
            this.cart = this.cart.filter((e) => e.id !== id);

            await fs.writeFile('./api/cart/cart.json', JSON.stringify(this.cart, null, 2), 'utf-8');
            return this.cart;
        } catch (err) {
            console.log(err);
        }
    }
}







module.exports = CartManager;

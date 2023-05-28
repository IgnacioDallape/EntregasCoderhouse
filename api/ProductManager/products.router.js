const express = require('express')
const { Router } = express
const ProductManager = require('./ProductManager')
const routerProducts = new Router()
const newProduct = new ProductManager('.productos.json')
const bodyParser = require('body-parser');

routerProducts.use(bodyParser.json());

routerProducts.get('/', async (req, res) => {
    try{
        const limit = req.query.limit
        let resp = await newProduct.getProducts()
        if(limit){
            resp = resp.slice(0, limit)
        }
        res.send(resp)
    } catch (err) {
        console.log(`Error: ${err}`)
        res.status(500).send('error')
    }
    })

routerProducts.get('/:pid', async (req, res) => {
    try {
        let resp = await newProduct.getProductsById(req.params.pid)
        if (!resp) {
            res.status(404).send(`Product not found`)
            return
        }
        res.send(resp)
    } catch (err) {
        res.status(500).send(err)

    }
})

//agrego productos a mi base de datos, para lugo usarlas en el carrito

routerProducts.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    try {
        let productAdded = await newProduct.addProducts(title, description, price, thumbnail, code, stock, status, category)
        if (!productAdded) {
            res.status(500).send(`Product cant be added`)
            return
        }
        res.send('Producto agregado correctamente');
    } catch (err) {
        console.log(`Error: ${err}`)
        res.status(500).send(err)
    }


})

//modifico el producto que quiera

routerProducts.put('/:pid', async (req, res) => {
    try{

        let prodId = req.params.pid
        let prodBody = req.body
        let prom = await newProduct.updateProducts(prodBody, prodId)        
        if(prom){
            console.log(prom)
            res.send(prom)
        } else {
            res.status(500).send('error')
        }

    } catch (err){
        console.log(err)
        res.status(500).send(err)

    }

}
)
//elimino algun producto

routerProducts.delete('/:pid', async (req, res) => {
    try{

        let prodId = req.params.pid
        let resp = await newProduct.deleteProducts(prodId)
        if (!resp) {
            res.status(500).send('Product cant be deleted')
            return
        }
        res.send('producto eliminado')
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }

})

module.exports = routerProducts


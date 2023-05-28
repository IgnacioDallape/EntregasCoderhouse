const fs = require('fs')
const express = require('express')
const { Router } = express
const uuid4 = require('uuid4');

class ProductManager {
    constructor() {
        this.products = []
    }

    async addProducts(title, description, price, thumbnail = [], code, stock, status = true, category) {
        if (title != undefined && description != undefined && price != undefined && code != undefined && stock != undefined && category != undefined) {
            try {
                const newProduct = {
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock,
                    status: status,
                    category: category,
                    id: uuid4()
                }

                let prod = await this.getProducts()
                let codingView = prod.map(x => x.code)
                if (prod.length > 0) {
                    if ((codingView.find((e) => e.code !== code))) {
                        let a = this.products.find((x) => x.code === code) ? true : false
                        if (!a) {
                            this.products.push(newProduct)
                            await fs.promises.writeFile('./api/ProductManager/productos.json', JSON.stringify(this.products, null, 2), 'utf-8')
                            console.log('producto agregado exitosamente')
                            return this.products
                        } else {
                            console.log('producto repetido')
                            return false
                        }

                    } else {
                        console.log('producto repetido')
                        return false
                    }
                } else {
                    console.log('array vacio')
                    this.products.push(newProduct)
                    await fs.promises.writeFile('./api/ProductManager/productos.json', JSON.stringify(this.products, null, 2), 'utf-8')
                    return this.products

                }
            } catch (err) {
                console.log(err)
                return false


            }
        } else {
            console.log('complete todos los campos')
            return false
        }

    }

    async getProducts() {
        try {
                let read = await fs.promises.readFile('./api/ProductManager/productos.json', 'utf-8')
                if (read != undefined && read != null && read.length > 0) {
                    let readParsed = JSON.parse(read)
                    this.products = readParsed
                    return this.products
                } else {
                    return this.products = []
                }
        } catch (err) {
            console.log(err, 'error aca')
            return this.products = []
        }
    }

    async getProductsById(id) {
        try {
            let prod = await this.getProducts()
            let finding = prod.find(product => product.id == id)
            if (finding) {
                console.log('producto  encotrado con id: ' + id)
                return finding
            } else {
                console.log('producto no encotrado')
                return false
            }

        } catch (err) {
            console.log(err,222)
        }
    }

    async updateProducts(productUpdated, id){
        try{
            await this.getProducts()
            let findingProduct = await this.products.find( product => product.id == id)
            if(!findingProduct){
                console.log(`Does not exist a product with the same id ${id}`)
                return false
            }
            let findingCode = this.products.find( product => product.code === productUpdated.code)
            
            if(findingCode){
                console.log(`does not exist a product with the same code ${productUpdated.code}`)
                return false
            }
            
            let findingIndex = this.products.findIndex( product => product.id === id)
            if(findingIndex == -1){
                console.log('producto no encontrado')
                return false
            }

            this.products[findingIndex] = {...this.products[findingIndex], ...productUpdated, id: id}
            console.log(this.products[findingIndex])
            
            await fs.promises.writeFile('./api/ProductManager/productos.json', JSON.stringify(this.products, null, 2), 'utf-8');        
            return this.products

        } catch (err) {
            console.log('error')
            return false
        }
    }


    async deleteProducts(id) {
        try {
            let prod = await this.getProducts()
            let prodValues = Object.values(prod)
            let index = prodValues.findIndex(product => product.id == id)
            if (index !== -1) {
                prodValues.splice(index, 1)
                this.products = prodValues
                await fs.promises.writeFile('./api/ProductManager/productos.json', JSON.stringify(this.products, null, 2), 'utf-8')
                return this.products
            } else {
                console.log('producto no encontrado')
                return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

const myProduct = new ProductManager()
async function addingFunction(title, description, price, thumbnail, code, stock, status, category) {
    await myProduct.addProducts(
        title = title,
        description = description,
        price = price,
        thumbnail = thumbnail,
        code = code,
        stock = stock,
        status = status,
        category = category
    )
}



module.exports = ProductManager

const express = require('express')
const { Router } = express
const app = express()
const routerProducts = require('./api/ProductManager/products.router')
const routerCart = require('./api/cart/cart.router')
const handlebars = require('express-handlebars')
const homeRouter = require('./routes/home.router')
const realTimeRouter = require('./routes/realtime.router')

app.use('/products', routerProducts)
app.use('/cart', routerCart)
app.use('/home', homeRouter)
app.use('/realtime', realTimeRouter)



//public

app.use(express.static(__dirname + '/public'))

//handlebars

app.engine('handlebars', handlebars.engine())
app.set('view engine','handlebars')
app.set('views', __dirname + '/views')

//socket
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
let messages = []

io.on('connection', (socket) => {
  console.log('nuevo usuario en linea')
  socket.emit('wellcome','Bienvenido!')
//   socket.on('message', (data) => {
//     messages.push(data)
//     console.log(messages)
//     io.sockets.emit('messages-all', messages)
// })
})


app.get('/', (req,res) => {
  res.send('Bienvenidos a la pre-entrega1 !')
})


server.listen(8080, () => {
  
  console.log('server corriendo')
})




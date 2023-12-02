const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const authenticate = require('./auth/authenticate')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors(
  {
    origin: ['https://auth-api-eosin.vercel.app', 'http://localhost:3000'],
    methods: ['POST', 'GET', 'DELETE'],
    credentials: true
  }
))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  next()
})

app.use(express.json())

app.get('/', (req, res) => {
  res.json('Hello')
})

async function main () {
  await mongoose.connect(process.env.DB_CONNECTION_STRING)

  console.log('Conectado a la base de datos')
}

main().catch(console.error)

app.use('/api/signup', require('./routes/signup'))
app.use('/api/login', require('./routes/login'))
app.use('/api/user', authenticate, require('./routes/user'))
app.use('/api/todos', authenticate, require('./routes/todos'))
app.use('/api/refreshToken', require('./routes/refreshToken'))
app.use('/api/signout', require('./routes/signout'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
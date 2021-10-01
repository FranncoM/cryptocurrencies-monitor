require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')

const Coin = require('./models/Coin')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const coinRouter = require('./routes/coins')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')

require('./services/updaterCoins')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server running OK' })
})

app.use('/api/v1/coins', coinRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/login', loginRouter)
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 2500

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }

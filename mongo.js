const mongoose = require('mongoose')

const { DB_URI, DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'
  ? DB_URI_TEST
  : DB_URI

if (!connectionString) {
  console.error('connectionString no tiene una db')
}

// conexión a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})

module.exports = mongoose

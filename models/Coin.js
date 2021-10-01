const { Schema, model } = require('mongoose')

const coinSchema = new Schema({
  id: {
    type: String
  },
  symbol: String,
  name: String,
  current_price: Object,
  image: Object,
  last_updated: Date

})

coinSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Coin = model('Coin', coinSchema)

module.exports = Coin

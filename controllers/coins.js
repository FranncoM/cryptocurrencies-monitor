const User = require('../models/User')
const Coin = require('../models/Coin')

const getAllCoins = async (req, res, next) => {
  const { userId } = req
  let { page, currencySort } = req.body

  let { currency } = User.findOne({ _id: userId })
  currency = currency || 'usd'
  const limit = 100
  page = page ? page - 1 : 0
  const skip = page * limit
  const sort = {}
  currencySort = currencySort ? -1 : 1

  sort[`current_price.${currency}`] = currencySort
  const query2 = { _id: 0, symbol: 1, price: 1, name: 1, image: 1, last_updated: 1, id: 1 }
  query2[`current_price.${currency}`] = 1

  await Coin.find({}, query2).sort(sort).skip(skip).limit(limit)
    .then(coins => res.json(coins))
    .catch(err => next(err))
}

const getCoin = async (req, res, next) => {
  const { idCoin } = req.params
  try {
    const coin = await Coin.findOne({ id: idCoin })
    if (coin) {
      res.json(coin)
    } else {
      res.status(404).json({ error: 'coin id is not found' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllCoins, getCoin }

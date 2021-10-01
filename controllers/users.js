const bcrypt = require('bcrypt')
const User = require('../models/User')
const Coin = require('../models/Coin')

const getUser = async (req, res, next) => {
  let { userId, currency, currencySort } = req

  currencySort = currencySort && currencySort !== 'desc' ? 1 : -1
  const sort = {}
  sort[`current_price.${currency}`] = currencySort

  const querytopCoins = { symbol: 1, price: 1, name: 1, image: 1, last_updated: 1, id: 1 }

  querytopCoins['current_price.ars'] = 1
  querytopCoins['current_price.usd'] = 1
  querytopCoins['current_price.eur'] = 1

  User.findOne({ _id: userId }).populate('monedas', querytopCoins, null, { sort: sort })
  // User.findOne({ _id: userId }).populate('topCoins', querytopCoins, null, { sort: sort })
    .then((user) => res.status(200).json(user))
    .catch(err => console.log(err))
}

const getTopCoins = async (req, res, next) => {
  const { userId, currency, body } = req
  let { currencySort } = body

  currencySort = currencySort && currencySort !== 'desc' ? 1 : -1

  const sort = {}
  sort[`current_price.${currency}`] = currencySort

  const querytopCoins = { symbol: 1, price: 1, name: 1, image: 1, last_updated: 1, id: 1 }

  querytopCoins['current_price.ars'] = 1
  querytopCoins['current_price.usd'] = 1
  querytopCoins['current_price.eur'] = 1

  User.findOne({ _id: userId }, { topCoins: 1, _id: 0 }).populate('monedas', querytopCoins, null, { sort: sort })
    .then(user => res.json(user))
    .catch(err => next(err))
}

const registerUser = async (req, res, next) => {
  const { body } = req
  let { userName, name, lastName, password, currency, topCoins } = body

  try {
    const saltRounds = 10
    password = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      userName,
      name,
      lastName,
      password,
      currency,
      topCoins
    })

    const savedUser = await newUser.save()
    return res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
}

const addCoins = async (req, res, next) => {
  const limit = 25
  const { body, userId } = req
  const { newCoins } = body
  const options = { new: true }
  const querytopCoins = { symbol: 1, name: 1, id: 1, _id: 0 }

  try {
    const { topCoins } = await User.findOne({ _id: userId }, { topCoins: 1 })

    if (topCoins && topCoins.length < limit && (topCoins.length + newCoins.length) <= limit) {
      const user = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { topCoins: newCoins } }, options).populate('monedas', querytopCoins)
      return res.json(user)
    } else {
      return res.status(403).json({ error: 'El usuario ya tiene 25 o más monedas agregadas' })
    }
  } catch (err) {
    next(err)
  }
}

const removeCoins = async (req, res, next) => {
  const { body, userId } = req
  const { removeCoins } = body
  const options = { new: true }
  const querytopCoins = { symbol: 1, name: 1, id: 1, _id: 0 }

  try {
    const { topCoins } = await User.findOne({ _id: userId }, { topCoins: 1 })

    if (topCoins) {
      const user = await User.findOneAndUpdate({ _id: userId }, { $pullAll: { topCoins: removeCoins } }, options).populate('monedas', querytopCoins)
      return res.json(user)
    } else {
      return res.status(404).json({ error: 'El usuario no tiene topCoins' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { getUser, getTopCoins, registerUser, addCoins, removeCoins }

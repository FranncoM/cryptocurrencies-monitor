const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')
const Coin = require('../models/Coin')

const api = supertest(app)

// Users helpers

const initialUser = {
  userName: 'francom',
  name: 'Franco',
  lastName: 'Miño',
  currency: 'ars',
  topCoins: [
    'binancecoin', 'ethereum', 'bitcoin', 'tether', 'cardano',
    'xrp', 'solana', 'plkadot', 'terra', 'avalanche',
    'uniswap', 'chainlink', 'litecoin', 'cosmos', 'algorand',
    'filecoin', 'stellar', 'vechain', 'tron', 'tezos',
    'axie-infinity', 'monero', 'pancakeswap']

}

const getUser = async () => {
  const usersDB = await User.find({})
  return usersDB
}

// Coins helpers

module.exports = {
  api,
  initialUser,
  getUser
}

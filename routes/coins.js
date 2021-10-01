const coinRouter = require('express').Router()
const coinController = require('../controllers/coins')
const userExtractor = require('../middleware/userExtractor')

coinRouter.get('/all', userExtractor, coinController.getAllCoins)
coinRouter.get('/:idCoin', userExtractor, coinController.getCoin)

module.exports = coinRouter

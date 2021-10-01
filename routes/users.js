const userRouter = require('express').Router()
const userController = require('../controllers/users')
const userExtractor = require('../middleware/userExtractor')

userRouter.get('/', userExtractor, userController.getUser)
userRouter.get('/topCoins', userExtractor, userController.getTopCoins)
userRouter.post('/', userController.registerUser)
userRouter.put('/addCoins', userExtractor, userController.addCoins)
userRouter.put('/removeCoins', userExtractor, userController.removeCoins)

module.exports = userRouter

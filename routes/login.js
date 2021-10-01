const loginRouter = require('express').Router()
const loginController = require('../controllers/login')

loginRouter.post('/', loginController.login)

module.exports = loginRouter

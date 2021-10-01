const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const login = async (req, res) => {
  const { body } = req
  const { username, password } = body
  const user = await User.findOne({ userName: username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Usuario o contraseña invalidos'
    })
  }

  const userForToken = {
    id: user._id,
    username: user.userName,
    currency: user.currency
  }

  const token = jwt.sign(
    userForToken,
    process.env.TOKEN_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  return res.send({
    username: user.userName,
    token
  })
}

module.exports = { login }

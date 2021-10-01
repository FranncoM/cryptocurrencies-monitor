const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ error: 'id used is malformed' }),

  ValidationError: (res, { message }) =>
    res.status(409).send({ error: message }),

  JsonWebTokenError: (res) =>
    res.status(401).json({ error: 'token missing or invalid' }),

  TokenExpirerError: res =>
    res.status(401).json({ error: 'token expired' }),

  MongoServerError: (res, error) => {
    if (error.message.indexOf('E11000 duplicate key error collection') === 1 && error.message.indexOf('userName') === 1) {
      return res.status(400).json({ error: 'User already exists' })
    }

    return res.status(400).json({ error: 'Error al procesar la solicitud' })
  },

  defaultError: (res, error) => {
    console.error(`${error.name}: ${error.message}`)
    if (error.message.indexOf('data and salt arguments required') === 1) {
      return res.status(500).end()
    }
    return res.status(500).end()
  }
}

module.exports = (error, request, response, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}

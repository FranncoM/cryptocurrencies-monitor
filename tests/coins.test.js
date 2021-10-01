const { server } = require('../index')
const bcrypt = require('bcrypt')
const mongoose = require('../mongo')
const User = require('../models/User')
const Coin = require('../models/Coin')
const mockCoin = require('./mockCoins')
const { api, initialUser } = require('./helpers')

const baseUrl = '/api/v1'
let token = null

describe('Test endpoints monedas', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Coin.deleteMany({})
    await Coin.insertMany(mockCoin)

    initialUser.password = await bcrypt.hash('pass123', 10)
    const user = new User(initialUser)
    await user.save()

    const res = await api
      .post(`${baseUrl}/login`)
      .send({ username: 'francom', password: 'pass123' })

    token = res.body.token
  })

  test(`GET ${baseUrl}/coins/:idCoin Debe devolver un objeto con los datos de la moneda`, async () => {
    const res = await api
      .get(`${baseUrl}/coins/bitcoin`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual(expect.any(Object))
  })

  test(`GET ${baseUrl}/coins/:idCoin Debe devolver un json con el error de coin not found`, async () => {
    const res = await api
      .get(`${baseUrl}/coins/fgasger`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'coin id is not found' })
  })

  test(`GET ${baseUrl}/coins/ Erros sin token debe devolver un 401 `, async () => {
    await api
      .get(`${baseUrl}/coins/bitcoin`)
      .set('Content-type', 'application/json')
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test(`GET ${baseUrl}/coins/all Debe devolver un array con las primeras 100 monedas ordenadas desc`, async () => {
    const res = await api
      .get(`${baseUrl}/coins/all`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual(expect.any(Array))
  })

  test(`GET ${baseUrl}/coins/all Debe devolver un array con las primeras 100 monedas ordenadas asc`, async () => {
    const res = await api
      .get(`${baseUrl}/coins/all`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ currencySort: 'asc' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual(expect.any(Array))
  })

  test(`GET ${baseUrl}/coins/all Debe devolver un array saltando las 100 monedas primeras y ordenadas desc`, async () => {
    const res = await api
      .get(`${baseUrl}/coins/all`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ page: 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual(expect.any(Array))
  })

  test(`GET ${baseUrl}/coins/all Error al pasar mal un parametro de un tipo incorrecto`, async () => {
    const res = await api
      .get(`${baseUrl}/coins/all`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ page: 'asd' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

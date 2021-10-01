const { server } = require('../index')
const bcrypt = require('bcrypt')
const mongoose = require('../mongo')
const User = require('../models/User')
const Coin = require('../models/Coin')
const mockCoin = require('./mockCoins')
const { api, initialUser } = require('./helpers')

const baseUrl = '/api/v1'

describe('Test Alta de usuario', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    await Coin.deleteMany({})
    await Coin.insertMany(mockCoin)

    initialUser.password = await bcrypt.hash('asd123', 10)
    const user = new User(initialUser)

    await user.save()
  })

  test(`POST ${baseUrl}/user Alta nuevo usuario`, async () => {
    const newUser = {
      userName: 'juanfm',
      name: 'Juan',
      lastName: 'Fernandez',
      currency: 'eur',
      topCoins: ['binancecoin', 'ion', 'bitcoin']
    }

    newUser.password = await bcrypt.hash('pass123', 10)

    await api
      .post(`${baseUrl}/user`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test(`POST ${baseUrl}user Debe retornar error si el userName existe`, async () => {
    const newUser = {
      userName: 'francom',
      name: 'Franco',
      lastName: 'Miño',
      currency: 'eur',
      topCoins: ['binancecoin', 'ion', 'bitcoin']
    }

    newUser.password = await bcrypt.hash('asd123', 10)

    await api
      .post(`${baseUrl}/user`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test(`POST ${baseUrl}/user Debe retornar error si falta un parametro requerido`, async () => {
    const newUser = {
      userName: 'germanmdp',
      name: 'German',
      lastName: 'Hernan',
      currency: 'usd',
      topCoins: ['binancecoin', 'ion', 'bitcoin']
    }

    await api
      .post(`${baseUrl}/user`)
      .send(newUser)
      .expect(500)
  })

  test(`POST ${baseUrl}/user Debe retornar error si la propiedad/es no respetan tipos`, async () => {
    const newUser = {
      userName: 'carlos',
      name: 12345,
      lastName: 'Lopez',
      currency: { moneda: 'eur' },
      topCoins: [1, 2, 4]
    }

    newUser.password = await bcrypt.hash('asd123', 10)

    await api
      .post(`${baseUrl}/user`)
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Tests usuario logueado', () => {
  let token = null
  beforeEach(async () => {
    await User.deleteMany({})

    initialUser.password = await bcrypt.hash('pass123', 10)
    const user = new User(initialUser)

    await user.save()
    const res = await api
      .post(`${baseUrl}/login`)
      .send({ username: 'francom', password: 'pass123' })

    token = res.body.token
  })

  test(`PUT ${baseUrl}/user/addCoins Agregar divisas`, async () => {
    await api
      .put(`${baseUrl}/user/addCoins`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ newCoins: ['shiba-inu', 'kusama'] })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test(`PUT ${baseUrl}/user/addCoins Error al agregar divisas debe devolver error de autorización`, async () => {
    await api
      .put(`${baseUrl}/user/addCoins`)
      .set('Content-type', 'application/json')
      .send({ newCoins: ['dogecoin'] })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test(`PUT ${baseUrl}/user/addCoins Error al agregar divisas con token invalido debe devolver error`, async () => {
    await api
      .put(`${baseUrl}/user/addCoins`)
      .set('Content-type', 'application/json')
      .auth('lkjsfaoiuqpwrlfaksjfalsfaskjh', { type: 'bearer' })
      .send({ newCoins: ['dogecoin'] })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test(`PUT ${baseUrl}/user/addCoins Error al sobrepasar el limite del top de monedas para un usuario `, async () => {
    await api
      .put(`${baseUrl}/user/addCoins`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ newCoins: ['shiba-inu', 'kusama', 'ccars'] })
      .expect(403)
      .expect('Content-Type', /application\/json/)
  })

  test(`GET ${baseUrl}/user/topCoins Debe devolver un json con el topN de monedas del usuario (orden por defecto descendente)`, async () => {
    const res = await api
      .get(`${baseUrl}/user/topCoins`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ topCoins: expect.any(Array) })
  })

  test(`GET ${baseUrl}/user/topCoins Debe devolver un json con el topN de monedas del usuario (orden por orden enviado)`, async () => {
    const res = await api
      .get(`${baseUrl}/user/topCoins`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ currencySort: 'asc' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toEqual({ topCoins: expect.any(Array) })
  })
  test(`PUT ${baseUrl}/user/removeCoins Debe quitar el usuario las monedas pasadas por parametro`, async () => {
    const res = await api
      .put(`${baseUrl}/user/removeCoins`)
      .set('Content-type', 'application/json')
      .auth(token, { type: 'bearer' })
      .send({ removeCoins: ['binancecoin', 'ethereum'] })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

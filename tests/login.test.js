const { server } = require('../index')
const bcrypt = require('bcrypt')
const mongoose = require('../mongo')
const User = require('../models/User')
const Coin = require('../models/Coin')
const mockCoin = require('./mockCoins')
const { api, initialUser } = require('./helpers')
const baseUrl = '/api/v1'
let token = null

describe('Tests logueo de usuario', () => {
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

  test(`POST ${baseUrl}/login Usuario correcto debe devolver un object con el userName y token`, async () => {
    await api
      .post(`${baseUrl}/login`)
      .send({ username: 'francom', password: 'pass123' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test(`POST ${baseUrl}/login Error por al introducir password incorrectos debe devolver un json con el error`, async () => {
    await api
      .post(`${baseUrl}/login`)
      .send({ username: 'francom', password: 'nananana' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test(`POST ${baseUrl}/login Error por al introducir usuario debe devolver un json con el error`, async () => {
    await api
      .post(`${baseUrl}/login`)
      .send({ username: 'allmigth', password: 'imhere' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test(`POST ${baseUrl}/login Error por al introducir un tipo distinto al campo`, async () => {
    await api
      .post(`${baseUrl}/login`)
      .send({ username: 'allmigth', password: 123456 })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

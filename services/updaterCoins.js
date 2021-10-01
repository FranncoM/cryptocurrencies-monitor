const Coin = require('../models/Coin')
const coinGecko = require('../services/coinGecko')
const { NODE_ENV, LIMIT_UPDATER } = process.env
const updateCurrencies = async () => {
  console.info('Iniciando actualizacion collecion de monedas')
  try {
    let allCoins = []
    let flag = true
    for (let i = 1; flag; i++) {
      const coins = await coinGecko.getAllCoins(250, i)
      if (coins && coins.data && i <= LIMIT_UPDATER) { // esta limitado en 5 vueltas para probar mas rapidamente ya que aproximadamente hay unas 27 páginas
        console.log(`Cargando página ${i}`)
        allCoins = [...allCoins, ...coins.data]
        allCoins = allCoins.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
      } else {
        console.log('no existen más páginas')
        flag = false
      }
    }

    const arrCoins = allCoins.map((coin) => {
      const { id, symbol, name, image, last_updated, market_data: { current_price } } = coin
      return { id, symbol, name, image, current_price, last_updated }
    })

    await Coin.deleteMany()
    await Coin.create(arrCoins)
    console.log('Se actualizaron las cotizaciones')
  } catch (error) {
    console.log('No se pudo actualizar la cotizaciones', error)
  }
}
if (NODE_ENV !== 'test') {
  updateCurrencies()
    .then(() => {
      setInterval(() => updateCurrencies(), 1000 * 60 * 60)
      console.log('Cargado collection')
    })
    .catch(err => console.log(err))
}

module.exports = { updateCurrencies }

// const memoria = { lap: 0 } test para carga mayores por paginado
// setInterval(async () => {
//   const moneda = await Coin.findOne({}).skip(memoria.lap)
//   console.log('memoria', memoria.lap, moneda.id)
//   memoria.lap++
// },
// 1000 * 5)

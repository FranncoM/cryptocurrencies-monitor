const CoinGecko = require('coingecko-api')
const coinGeckoClient = new CoinGecko()

const filter = (vs_currency, ids, price) => {
  const params = {}

  if (vs_currency) params.vs_currency = vs_currency

  if (ids && ids.length > 0) params.ids = ids

  if (price) {
    let orderConstantPrice

    if (price === 'desc') orderConstantPrice = CoinGecko.ORDER.PRICE_DESC
    else orderConstantPrice = CoinGecko.ORDER.PRICE_ASC

    params.order = orderConstantPrice
  }

  return params
}

const getCoins = async (vs_currency, ids, price) => {
  const params = filter(vs_currency, ids, price)

  return await coinGeckoClient.coins.markets(params)
}

const getAllCoins = async (per_page, page) => {
  // return await coinGeckoClient.coins.list()

  const order = CoinGecko.ORDER.PRICE_DESC

  return await coinGeckoClient.coins.all({ per_page, page, order })
}

const getCoin = async (coinId) => {
  return await coinGeckoClient.coins.fetch(coinId, {
    localization: false,
    developer_data: false,
    community_data: false,
    tickers: false
  })
}

module.exports = { getCoins, getCoin, getAllCoins, filter }

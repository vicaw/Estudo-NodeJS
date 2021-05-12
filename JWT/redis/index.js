const redis = require('redis')
const manipulaLista = require('./manipula-lista')

const allowlistrefreshtoken = redis.createClient({ prefix: 'allow-list-refresh-token:'})
const blocklistrefreshtoken = redis.createClient({ prefix: 'block-list-access-token:'})

module.exports = {
    allowListRefreshToken: manipulaLista(allowlistrefreshtoken),
    blockListAccessToken: manipulaLista(blocklistrefreshtoken)
}
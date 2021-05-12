const { promisify } = require('util')

const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')


function geraTokenHash(token) {
    return createHash('sha256').update(token).digest('hex')
}

module.exports = lista =>  { 
    const setAsync = promisify(lista.set).bind(lista)
    const getAsync = promisify(lista.get).bind(lista)
    const existsAsync = promisify(lista.exists).bind(lista)
    const delAsync = promisify(lista.del).bind(lista)

    return {
        async adiciona(chave, valor, dataExpiracao) {
            await setAsync(chave, valor)
            lista.expireat(chave, dataExpiracao)
        },

        async buscaValor(chave){
            const valor = await getAsync(chave)
            return valor
        },
    
        async contemChave(chave){
            const resultado = await existsAsync(chave)
            return resultado === 1
        },

        async deleta(chave){
            await delAsync(chave)
        }
    }
}
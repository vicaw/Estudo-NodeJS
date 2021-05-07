const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const TabelaProduto = require('./produtos/TabelaProduto')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res, next) => {
    try{
        const resultados = await TabelaFornecedor.listar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.status(200).send(serializador.serializar(resultados))
    }
    catch(e){
        next(e)
    }
})


module.exports = roteador

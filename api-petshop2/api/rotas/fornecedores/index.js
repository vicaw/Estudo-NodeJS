const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor


roteador.get('/', async (req, res, callback) => {
    try{
        const resultados = await TabelaFornecedor.listar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.status(200).send(serializador.serializar(resultados))
    }
    catch(e){
        callback(e)
    }
})

roteador.get('/:id', async (req, res, callback) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['email', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.status(200).send(serializador.serializar(fornecedor))
    }
    catch(e) {
        callback(e)
    }
})

roteador.post('/', async (req, res, callback) => {
    try{
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.status(201).send(serializador.serializar(fornecedor))
    }
    catch(e){
        callback(e)
    }

})

roteador.put('/:id', async (req, res, callback) => {
    try {
        const id = req.params.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204).end()
    }
    catch(e){
        callback(e)
    }
})


roteador.delete('/:id', async (req, res, callback) => {
    try{
        const id = req.params.id
        const fornecedor = new Fornecedor({id : id})
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204).end()
    }
    catch(e){
       callback(e)
    }
})

module.exports = roteador
const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor


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

roteador.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['email', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.status(200).send(serializador.serializar(fornecedor))
    }
    catch(e) {
        next(e)
    }
})

roteador.post('/', async (req, res, next) => {
    try{
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.status(201).send(serializador.serializar(fornecedor))
    }
    catch(e){
        next(e)
    }

})

roteador.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204).end()
    }
    catch(e){
        next(e)
    }
})


roteador.delete('/:id', async (req, res, next) => {
    try{
        const id = req.params.id
        const fornecedor = new Fornecedor({id : id})
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204).end()
    }
    catch(e){
        next(e)
    }
})

const roteadorProdutos = require('./produtos')

const verificarFornecedor = async (req, res, next) =>{
    try{
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({id : id})
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        next()
    }
    catch(e){
        next(e)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador
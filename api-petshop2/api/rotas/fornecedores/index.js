const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const TabelaProduto = require('./produtos/TabelaProduto')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res, next) => {
    try{
        const resultados = await TabelaFornecedor.listar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa'])
        res.status(200).send(serializador.serializar(resultados))
    }
    catch(e){
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

roteador.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa', 'email', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.status(200).send(serializador.serializar(fornecedor))
    }
    catch(e) {
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

roteador.options('/:id/verificar-estoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.post('/:id/verificar-estoque', async (req, res, next) => {
    try {
      const fornecedor = new Fornecedor({ id: req.params.id })
      await fornecedor.carregar()
      const produtos = await TabelaProduto.listar(fornecedor.id, { estoque: 0 })
      res.send( {mensagem: `${produtos.length} produtos precisam ser repostos`} )
    } 
    catch (e) {
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
const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto


roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.status(204).end()
})

roteador.get('/', async (req, res) =>{
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new Serializador(res.getHeader('Content-Type'))
    res.send(serializador.serializar(produtos))
})

roteador.post('/', async (req, res, next) =>{
    try{
        let dadosRecebidos = req.body;
        const idFornecedor =  req.fornecedor.id
        dadosRecebidos = Object.assign({}, dadosRecebidos, {fornecedor: idFornecedor})
        
        const produto = new Produto(dadosRecebidos)
        await produto.criar()

        res.set('Etag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)

        const serializador = new Serializador(res.getHeader('Content-Type'))
        res.status(201).send(serializador.serializar(produto))
    }
    catch(e){
        next(e)
    }
})

roteador.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/:id', async (req, res, next) =>{
    try {
        const produto = new Produto({id: req.params.id, fornecedor: req.fornecedor.id})
        await produto.carregar()

        res.set('Etag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)

        const serializador = new Serializador(res.getHeader('Content-Type'), ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.send(serializador.serializar(produto))
    }
    catch(e){
        next(e)
    }
})

roteador.put('/:id', async (req, res, next) => {
    try {
        const dados = Object.assign({}, req.body, {id: req.params.id, fornecedor: req.fornecedor.id})
        const produto = new Produto(dados)
        
        await produto.atualizar()
        await produto.carregar()

        res.set('Etag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)

        res.status(204).end()
    }
    catch(e){
       next(e)
    }
})

roteador.delete('/:id', async (req, res, next) => {
    try{
        const id = req.params.id
        const idFornecedor = req.fornecedor.id
        const produto = new Produto({id: id, fornecedor: idFornecedor})
        await produto.carregar()
        await produto.remover()
        res.status(204).end()
    }
    catch(e){
        next(e)
    }
})

roteador.head('/:id', async (req, res, next) => {
    try {
        const produto = new Produto({id: req.params.id, fornecedor: req.fornecedor.id})
        await produto.carregar()

        res.set('Etag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)

        res.status(200).end()
    }
    catch(e){
        next(e)
    }
})

roteador.options('/:id/diminuir-estoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.post('/:id/diminuir-estoque', async (req, res, next) => {
    try {
        const produto = new Produto({ id: req.params.id, fornecedor: req.fornecedor.id})
    
        await produto.carregar()
        produto.estoque -= req.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()

        res.set('Etag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        
        res.status(204).end()
    } 
    catch(e) {
        next(e)
    }
})



const roteadorReclamacoesProduto = require('./reclamacoes')
const serializador = require('../../../Serializador')
roteador.use('/:idProduto/reclamacoes', roteadorReclamacoesProduto)

module.exports = roteador
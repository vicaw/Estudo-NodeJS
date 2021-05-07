const roteador = require('express').Router({mergeParams: true})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (req, res) =>{
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new Serializador(res.getHeader('Content-Type'))
    res.send(serializador.serializar(produtos))
})

roteador.get('/:id', async (req, res, next) =>{
    try {
        const produto = new Produto({id: req.params.id, fornecedor: req.fornecedor.id})
        await produto.carregar()

        const serializador = new Serializador(res.getHeader('Content-Type'), ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao'])
        res.send(serializador.serializar(produto))
    }
    catch(e){
        next(e)
    }
})

roteador.post('/', async (req, res, next) =>{
    try{
        let dadosRecebidos = req.body;
        const idFornecedor =  req.fornecedor.id
        dadosRecebidos = Object.assign({}, dadosRecebidos, {fornecedor: idFornecedor})
        
        const produto = new Produto(dadosRecebidos)
        await produto.criar()
        
        const serializador = new Serializador(res.getHeader('Content-Type'))
        res.status(201).send(serializador.serializar(produto))
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

roteador.post('/:id/diminuir-estoque', async (req, res, next) => {
    try {
        const produto = new Produto({ id: req.params.id, fornecedor: req.fornecedor.id})
    
        await produto.carregar()
        produto.estoque -= req.body.quantidade
        await produto.diminuirEstoque()
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
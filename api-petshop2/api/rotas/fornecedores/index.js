const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')


roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200).send(JSON.stringify(resultados))
})

roteador.get('/:id', async (req, res, callback) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        res.status(200).send(JSON.stringify(fornecedor))
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
        res.status(201).send(JSON.stringify(fornecedor))
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
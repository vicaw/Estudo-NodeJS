const roteador = require('express').Router({mergeParams: true})

roteador.get('/', async (req, res) =>{
    res.send(JSON.stringify(['isso era para ser uma lista vazia']))
})

module.exports = roteador
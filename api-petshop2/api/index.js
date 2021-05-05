const express = require('express')
const app = express()
const config = require('config')

app.use(express.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

app.listen(config.get('api.port'), () => console.log('A Api está funcionando'))
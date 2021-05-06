const express = require('express')
const app = express()
const config = require('config')

const roteador = require('./rotas/fornecedores')

const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

const formatosAceitos = require('./serializador').formatosAceitos
const SerializadorErro = require('./serializador').SerializadorErro


app.use(express.json())

app.use((req, res, prox) => {
    let formatoRequisitado = req.header('Accept')

    if(formatoRequisitado === '*/*'){
        formatoRequisitado = 'application/json'
    }

    if(formatosAceitos.indexOf(formatoRequisitado) === -1){
        res.status(406).end()
        return
    }

    res.setHeader('Content-Type', formatoRequisitado)

    prox()
})

app.use('/api/fornecedores', roteador)

app.use((erro, req, res, next) => {
    let status = 500

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos){
        status = 400
    }

    else if(erro instanceof NaoEncontrado){
        status = 404
    }

    else if (erro instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorErro(res.getHeader('Content-Type'))
    res.status(status).send(serializador.serializar( {mensagem: erro.message, id: erro.idErro} ))
})

app.listen(config.get('api.port'), () => console.log('A Api está funcionando'))
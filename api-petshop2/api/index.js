const express = require('express')
const app = express()
const config = require('config')

app.use(express.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

app.use((erro, req, res, callback) => {
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

    res.status(status).send(JSON.stringify(
        {
            mensagem: erro.message,
            id: erro.idErro
        }
    ))

})

app.listen(config.get('api.port'), () => console.log('A Api está funcionando'))
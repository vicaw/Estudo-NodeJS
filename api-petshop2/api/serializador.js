const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

class Serializador{
    json(dados){
        return JSON.stringify(dados)
    }

    serializar(dados){
        if(this.contentType === 'application/json'){
            return JSON.stringify(dados)
        }
        
        throw new ValorNaoSuportado(this.contentType)

    }
}
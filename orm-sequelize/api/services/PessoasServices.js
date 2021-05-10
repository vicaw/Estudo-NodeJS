const Services = require('./Services')
const database = require('../models')

class PessoasServices extends Services {
    constructor(){
        super('Pessoas')
        this.matriculas = new Services('Matriculas')
    }

    async listAtivos(where = {}){
        return database[this.nomeDoModelo].findAll({ where: {...where} })
    }

    async listAll(where = {}){
        return database[this.nomeDoModelo]
            .scope('all')
            .findAll({ where: {...where} })
    }

    async cancel(estudanteId){
        return database.sequelize.transaction(async t => {
                await super.update( {ativo: false}, {id: estudanteId} , {transaction : t} )
                await this.matriculas.update( {status: 'cancelado'}, { estudante_id: estudanteId } , {transaction : t} )
            })
    }

}

module.exports = PessoasServices

const database = require('../models')

class Services {
    constructor(nomeDoModelo){
        this.nomeDoModelo = nomeDoModelo
    }

    async list(){
        return database[this.nomeDoModelo].findAll()
    }

    async getById(id){

    }

    async create(dados){

    }

    async update(dados, where, transacao = {}){
        return database[this.nomeDoModelo].update(dados, { where:{...where} }, transacao)
    }

    async delete(id){

    } 


}

module.exports = Services

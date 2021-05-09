const database = require('../models')

class PessoaController {
    static async listar(req, res){
        try {
            const listaPessoas = await database.Pessoas.findAll()
            return res.status(200).json(listaPessoas)
        }
        catch(error){
            return res.stats(500).json(error.message)
        }
    }
}

module.exports = PessoaController

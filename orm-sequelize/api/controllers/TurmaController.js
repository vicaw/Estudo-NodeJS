const database = require('../models')
const Op = require('sequelize').Op

class TurmaController {
    static async list(req, res){
        const data_inicial = req.query.data_inicial
        const data_final = req.query.data_final
        const where = {}
        data_inicial || data_final ? where.data_inicio = {} : null
        data_inicial ? where.data_inicio[Op.gte] = data_inicial : null
        data_final ? where.data_inicio[Op.lte] = data_final : null

        try {
            const listaTurmas = await database.Turmas.findAll({ where })
            return res.status(200).json(listaTurmas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async getById(req, res){
        const id = req.params.id
        try {
            const Turma = await database.Turmas.findOne({ where:{id : id} })
            return res.status(200).json(Turma)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async create(req, res){
        const body = req.body
        try {
            const novaTurma = await database.Turmas.create(body)
            return res.status(200).json(novaTurma)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async update(req, res){
        const body = req.body
        const id = req.params.id
        try {
            await database.Turmas.update(body, { where:{id: id} })
            const Turma = await database.Turmas.findOne({ where:{id : id} })
            return res.status(200).json(Turma)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async delete(req, res){
        const id = req.params.id
        try {
            await database.Turmas.destroy({ where:{id: id} })
            res.status(200).json({message:`ID ${id} apagado.`})
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }


}

module.exports = TurmaController

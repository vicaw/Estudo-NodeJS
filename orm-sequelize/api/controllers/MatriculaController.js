const database = require('../models')

class MatriculaController {
    static async list(req, res){
        const { turmaId, estudanteId } = req.params
        const where = {}
        turmaId ? where.turma_id = turmaId : where.estudante_id = estudanteId
        try {
            const listaMatriculas = await database.Matriculas.findAll({ where })
            return res.status(200).json(listaMatriculas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async getById(req, res){
        const estudanteId = req.estudante.id
        const matriculaId = req.params.matriculaId
        try {
            const Matricula = await database.Matriculas.findOne({ where:{id: matriculaId, estudante_id:estudanteId} })
            return res.status(200).json(Matricula)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async create(req, res){
        const estudanteId = req.estudante.id
        const body = {...req.body, estudante_id: estudanteId}
        try {
            const novaMatricula = await database.Matriculas.create(body)
            return res.status(200).json(novaMatricula)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async update(req, res){
        const body = req.body
        const estudanteId = req.estudante.id
        const matriculaId = req.params.matriculaId
        try {
            await database.Matriculas.update(body, { where:{id: matriculaId, estudante_id:estudanteId} })
            const Matricula = await database.Matriculas.findOne({ where:{id: matriculaId, estudante_id:estudanteId} })
            return res.status(200).json(Matricula)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async delete(req, res){
        const estudanteId = req.estudante.id
        const matriculaId = req.params.matriculaId
        try {
            await database.Matriculas.destroy({ where:{id: matriculaId, estudante_id:estudanteId} })
            res.status(200).json({message:`ID ${matriculaId} apagado.`})
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }


}

module.exports = MatriculaController

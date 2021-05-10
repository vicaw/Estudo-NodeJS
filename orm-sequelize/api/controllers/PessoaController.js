//const database = require('../models')
//const Sequelize = require('sequelize')

const { PessoasServices } = require('../services')
const pessoasServices = new PessoasServices('Pessoas')

class PessoaController {
    static async list(req, res){
        try {
            const listaPessoas = await pessoasServices.listAll()
            return res.status(200).json(listaPessoas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async listAtivos(req, res){
        try {
            const listaPessoas = await pessoasServices.listAtivos()
            return res.status(200).json(listaPessoas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async getById(req, res){
        const id = req.params.id
        try {
            const pessoa = await database.Pessoas.findOne({ where:{id : id} })
            return res.status(200).json(pessoa)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async create(req, res){
        const body = req.body
        try {
            const novaPessoa = await database.Pessoas.create(body)
            return res.status(200).json(novaPessoa)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async update(req, res){
        const body = req.body
        const id = req.params.id
        try {
            await database.Pessoas.update(body, { where:{id: id} })
            const pessoa = await database.Pessoas.findOne({ where:{id : id} })
            return res.status(200).json(pessoa)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async delete(req, res){
        const id = req.params.id
        try {
            await database.Pessoas.destroy({ where:{id: id} })
            res.status(200).json({message:`ID ${id} apagado.`})
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async restore(req, res){
        const id = req.params.id
        try{
            await database.Pessoas.restore({ where:{id: id} })
            res.status(200).json({message:`ID ${id} restaurado.`})
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async cancelaPessoa(req, res){
        const estudanteId = req.params.id
        try{
            await pessoasServices.cancelar(estudanteId)
            return res.status(200).json({message:`Matriculas referente ao estudante ${estudanteId} cancelados.`})    
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }


    ///
    static async verificar (req, res, next){
        try{
            const id = req.params.estudanteId
            const pessoa = await database.Pessoas.findOne({ where:{id : id} })
            req.estudante = pessoa
            next()
        }
        catch(e){
            next(e)
        }
    }





    ///
    static async listMatriculas(req, res){
        const estudanteId = req.params.estudanteId
        try {
            const pessoa = await database.Pessoas.findOne({ where:{id : estudanteId} })
            const listaMatriculas = await pessoa.getAulasMatriculadas()
            return res.status(200).json(listaMatriculas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async listMatriculasPorTurma(req, res){
        const turmaId = req.params.turmaId
        try {
            const listaMatriculas = await database.Matriculas
                .findAndCountAll({
                    where: {
                        turma_id: turmaId,
                        status: 'confirmado'
                    },
                    limit: 20,
                    order: [['estudante_id', 'DESC']]
                })
            
            return res.status(200).json(listaMatriculas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async listTurmasLotadas(req, res){
        const lotacaoTurma = 2
        try {
            const turmasLotadas = await database.Matriculas
                .findAndCountAll({
                    where: {
                        status: 'confirmado'
                    },
                    attributes:['turma_id'],
                    group:['turma_id'],
                    having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
                })
            
            return res.status(200).json(turmasLotadas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }


    //Matriculas
    /*
    static async listMatriculas(req, res){
        const estudanteId = req.params.estudanteId
        try {
            const listaMatriculas = await database.Matriculas.findAll({ where:{estudante_id:estudanteId} })
            return res.status(200).json(listaMatriculas)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async getMatriculaById(req, res){
        const estudanteId = req.params.estudanteId
        const matriculaId = req.params.matriculaId
        try {
            const Matricula = await database.Matriculas.findOne({ where:{id: matriculaId, estudante_id:estudanteId} })
            return res.status(200).json(Matricula)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async createMatricula(req, res){
        const estudanteId = req.params.estudanteId
        const body = {...req.body, estudante_id: estudanteId}
        try {
            const novaMatricula = await database.Matriculas.create(body)
            return res.status(200).json(novaMatricula)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async updateMatricula(req, res){
        const body = req.body
        const estudanteId = req.params.estudanteId
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

    static async deleteMatricula(req, res){
        const estudanteId = req.params.estudanteId
        const matriculaId = req.params.matriculaId
        try {
            await database.Matriculas.destroy({ where:{id: matriculaId, estudante_id:estudanteId} })
            res.status(200).json({message:`ID ${matriculaId} apagado.`})
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }
    */

}

module.exports = PessoaController

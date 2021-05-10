const database = require('../models')
const Services = require('../services/Services')
const niveisServices = new Services('Nives')

class NivelController {
    static async list(req, res){
        try {
            const listaNiveis = await niveisServices.list()
            return res.status(200).json(listaNiveis)
        }
        catch(error){   
            return res.status(500).json(error.message)
        }
    }

    static async getById(req, res){
        const id = req.params.id
        try {
            const Nivel = await database.Niveis.findOne({ where:{id : id} })
            return res.status(200).json(Nivel)
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async create(req, res){
        const body = req.body
        try {
            const novoNivel = await database.Niveis.create(body)
            return res.status(200).json(novoNivel)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async update(req, res){
        const body = req.body
        const id = req.params.id
        try {
            await database.Niveis.update(body, { where:{id: id} })
            const Nivel = await database.Niveis.findOne({ where:{id : id} })
            return res.status(200).json(Nivel)
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }

    static async delete(req, res){
        const id = req.params.id
        try {
            await database.Niveis.destroy({ where:{id: id} })
            res.status(200).json({message:`ID ${id} apagado.`})
        }
        catch(error){
            return res.status(500).json(error.message)
        }

    }


}

module.exports = NivelController

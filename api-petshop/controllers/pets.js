const Pet = require('../models/pets')

module.exports = app => {
    app.post('/pet', (req, res) => {
        const pet = req.body
        Pet.adiciona(pet, retorno =>{
            retorno
                .then(resultados => res.status(200).json(resultados))
                .catch(erros => res.status(400).json(erros))
        })
            
    })
}
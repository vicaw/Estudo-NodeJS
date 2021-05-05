const repositorio = require('../repositorios/pets')

class Pet {
    adiciona(pet, retrn) {
        repositorio.adiciona(pet, (ret, novoPet) => {
            retrn(
                ret.then(resultados => {
                        const id = resultados.insertId
                        return { ...novoPet, id }
                    })  
            )
        })
    }
}

module.exports = new Pet
const query = require('../infraestrutura/database/queries')
const uploadArquivo = require('../infraestrutura/arquivos/uploadArquivos')

class Pet {
    adiciona(pet, retrn) {
        const sql = 'INSERT INTO Pets SET ?'
       
        uploadArquivo(pet.imagem, pet.nome, (erro, novoCaminho) => {        
            if(erro){            
                retrn(new Promise((resolve, reject) => reject(erro)))    
            } 
            else {
                const novoPet = {nome: pet.nome, imagem: novoCaminho}
                retrn(query(sql, novoPet), novoPet)
            }
        })
       
        
    }
}

module.exports = new Pet()
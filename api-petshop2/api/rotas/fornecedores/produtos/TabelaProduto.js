const Modelo = require('./ModeloTabelaProduto')
const NaoEncontrado = require('../../../erros/NaoEncontrado')
const instancia = require('../../../database')

module.exports = {
    listar(idFornecedor, parametros = {}){
        parametros.fornecedor = idFornecedor
        return Modelo.findAll(
            { 
                raw: true,
                where: parametros
            }
        )
    },

    inserir(produto){
        return Modelo.create(produto)
    },

    async pegarPorId(id, idFornecedor){
        const encontrado = await Modelo.findOne({ where:{id: id, fornecedor: idFornecedor}, raw: true })

        if (!encontrado) {
            throw new NaoEncontrado('Produto')
        }

        return encontrado
    },

    atualizar (id, idFornecedor, dadosParaAtualizar){
        return Modelo.update(dadosParaAtualizar, { where:{id: id, fornecedor: idFornecedor} })
    },

    remover(id, idFornecedor){
        return Modelo.destroy({ where:{id: id, fornecedor: idFornecedor} })
    },

    subtrair (id, idFornecedor, campo, quantidade) {
        //Utilizando método .transaction do Sequelize por conta do controle de concorrencia.
        return instancia.transaction(async transacao => {
            const produto = await Modelo.findOne({ where:{id: id, fornecedor: idFornecedor} })

            produto[campo] = quantidade

            await produto.save()

            return produto
        })
    },
    
}

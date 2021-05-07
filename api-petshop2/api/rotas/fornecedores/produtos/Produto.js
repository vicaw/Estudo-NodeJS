const TabelaProduto = require('./TabelaProduto')
const CampoInvalido = require('../../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')

class Produto {
    constructor({id, titulo, preco, estoque = 0, fornecedor, dataCriacao, dataAtualizacao, versao}){
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    async criar(){
        this.validar()
        const resultado = await TabelaProduto.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar(){
        const encontrado = await TabelaProduto.pegarPorId(this.id, this.fornecedor)
        
        this.id = encontrado.id
        this.dataCriacao = encontrado.dataCriacao
        this.dataAtualizacao = encontrado.dataAtualizacao
        this.versao = encontrado.versao
        this.titulo = encontrado.titulo
        this.preco = encontrado.preco
        this.estoque = encontrado.estoque
        this.fornecedor = encontrado.fornecedor
    }

    async atualizar(){
        //Chamar o método pegaPorId para fazer a verificação da existencia do id
        await TabelaProduto.pegarPorId(this.id, this.fornecedor)

        const dadosParaAtualizar = {}

        /*
        const campos = [
            {nome: 'titulo' ,   tipo: 'string'},
            {nome: 'preco'  ,   tipo: 'number'},
            {nome: 'estoque',   tipo: 'number', canBeZero: true}
        ]
 
        //Validar os campos recebidos
        campos.forEach( (campo) => {
            const valor = this[campo.nome]
            if (typeof(valor) === campo.tipo){
                console.log(campo.tipo)
                if((campo.tipo === 'string' && valor.length !== 0) || (campo.tipo === 'number' && (valor > 0 || campo.canBeZero )) ){
                    dadosParaAtualizar[campo.nome] = valor
                }
            }
        })

        console.log(dadosParaAtualizar)

        */

        if (typeof this.titulo === 'string' && this.titulo.length > 0){
            dadosParaAtualizar.titulo = this.titulo
        }
        
        if (typeof this.preco === 'number' && this.preco > 0){
            dadosParaAtualizar.preco = this.preco
        }
        
        /*
        if (typeof this.estoque === 'number') {
            dadosParaAtualizar.estoque = this.estoque
        }
        */
       
        if (Object.keys(dadosParaAtualizar).length === 0){
            throw new DadosNaoFornecidos()
        }


        await TabelaProduto.atualizar(this.id, this.fornecedor, dadosParaAtualizar)
    }

    remover() {
       return TabelaProduto.remover(this.id, this.fornecedor)
    }

    validar() {
        const campos = [
            {nome: 'titulo' ,   tipo: 'string',    canBeNull: false },
            {nome: 'preco'  ,   tipo: 'number',    canBeNull: false },
            {nome: 'estoque',   tipo: 'number',    canBeNull: true  }
        ]

        campos.forEach( (campo) => {
            const valor = this[campo.nome]
            if (typeof(valor) !== campo.tipo || ((valor.length === 0 || valor === 0) && campo.notNull) ){
                throw new CampoInvalido(campo.nome)
            }
        })
    }

    diminuirEstoque () {
        return TabelaProduto.subtrair(
            this.id,
            this.fornecedor,
            'estoque',
            this.estoque
        )
    }


}

module.exports = Produto
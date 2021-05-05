const { default: axios } = require('axios')
const moment = require('moment')
const repositorio = require('../repositorios/atendimentos')

class Atendimento{
    constructor(){
        this.dataIsValid = ({data, dataCriacao}) => moment(data).isSameOrAfter(dataCriacao)
        this.clientIsValid = ({tamanho}) => tamanho == 11

        this.valida = parametros => 
            this.validacoes.filter(campo => {
                const { nome } = campo
                const parametro = parametros[nome]

                return !campo.valido(parametro)           
                
            })
            
        

        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataIsValid,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clientIsValid,
                mensagem: 'CPF Inválido'
            }
        ]



    }

    adiciona(atendimento){
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
       
        const parametros = {
            data: {data, dataCriacao},
            cliente: {tamanho: atendimento.cliente.length}
        }


        const erros = this.valida(parametros)
        
    
        if (erros.length) {
            return new Promise((resolve, reject) => reject(erros))
        }      
        else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            
            return repositorio.adiciona(atendimentoDatado)
                .then(resultados =>{
                    const id = resultados.insertId
                    return{ ...atendimento, id}
                })
        }
    }

    lista() {
        return repositorio.lista()
    }

    buscaPorId(id) {
        return repositorio.buscaPorId(id)
            .then(async resultados => {
                const atendimento = resultados[0]
                const cpf = atendimento.cliente
                const { info } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = info
                return atendimento
            })
    }

    altera(id, valores) {
        const parametros = {}

        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
            const data = valores.data
            const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
            parametros.data = {data, dataCriacao}
        }

        if(valores.cliente){
            parametros.cliente = {tamanho: valores.cliente.length}
        }

        const erros = this.valida(parametros)
        
        if (erros.length) {
            return new Promise((resolve, reject) => reject(erros))
        }      
        else {          
            return repositorio.altera(id, valores)
                .then( () => {
                    return {...valores, id}
                })
        }
    }

    deleta(id) {
        return repositorio.deleta(id)
            .then( () => {
                return {id}
            })   
    }
}

module.exports = new Atendimento
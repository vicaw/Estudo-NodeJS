const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')
const { allowListRefreshToken, blockListAccessToken } =  require('../../redis')
const { InvalidArgumentError } = require('../erros')


module.exports = {
    access: {
        cria(id){
            const payload = { id }
            const token = jwt.sign(payload, process.env.CHAVE_JWT, {expiresIn: process.env.ACCESS_TOKEN_EXPIRE})
            return token
        },      
        verifica(token){
            const { id } = jwt.verify(token, process.env.CHAVE_JWT)
            return id
        }
        
    },

    refresh: {
        async cria(id){
            const dataExpiracao = moment().add(Number(process.env.REFRESH_TOKEN_EXPIRE), 'd').unix()
            const tokenOpaco = crypto.randomBytes(24).toString('hex')
            await allowListRefreshToken.adiciona(tokenOpaco, id, dataExpiracao)
            return tokenOpaco
        },

        async verifica(token){
            if(!token){
                throw new InvalidArgumentError('Refresh Token não enviado.')
            }
        
            const id = await allowListRefreshToken.buscaValor(token)
            if(!id){
                throw new InvalidArgumentError('Refresh Token inválido.')
            }
        
            return id
        },

        async invalida(token){
            await allowListRefreshToken.deleta(token)    
        }

    }

}

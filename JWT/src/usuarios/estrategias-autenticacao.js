const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const tokens = require('./tokens')


const Usuario = require('./usuarios-modelo')
const { InvalidArgumentError } = require('../erros')

const bcrypt = require('bcrypt')    
//const blacklist = require('../../redis/manipula-blacklist')

function verificaUsuario(usuario){
    if(!usuario){
        throw new InvalidArgumentError('Não existe usuário com esse e-mail')
    }
}

/*
async function verificaTokenNaBlackList(token){
    const existeNaBlackList = await blacklist.contemToken(token)
    if(existeNaBlackList){
        throw new jwt.JsonWebTokenError('Token inválido.')
    }
}
*/

async function verificaSenha(senha, senhaHash){
    const senhaValida = await bcrypt.compare(senha, senhaHash)
    if(!senhaValida){
        throw new InvalidArgumentError('E-mail ou senha inválidos')
    }
}


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try{
            const usuario = await Usuario.buscaPorEmail(email)
            verificaUsuario(usuario)
            await verificaSenha(senha, usuario.senhaHash)

            done(null, usuario)
        } catch(erro) {
            done(erro)
        }

    })
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try{
                //await verificaTokenNaBlackList(token)
                const id = tokens.access.verifica(token)
                const usuario = await Usuario.buscaPorId(id)
                done(null, usuario, {token: token})
            } catch(erro) {
                done(erro)
            }
        }
    )
)
const customExpress = require('./config/customExpress')
const conexao = require('./infraestrutura/database/conexao')
const Tabelas = require('./infraestrutura/database/tabelas')

conexao.connect(erro => { 
    if(erro) {
        console.log(erro)
    }
    else{
        console.log("Conectado.")
        
        Tabelas.init(conexao)
        const app = customExpress()

        app.listen(3000,() => console.log('O servidor está rodando na porta 3000'))
    }
})


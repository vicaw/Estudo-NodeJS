const express = require('express')
const app = express()

const jogos = [ {"nome":"a", "plataforma":"b"}]

app.use(express.json())

app.get('/api/jogos', (req, res) => {  
    res.send(JSON.stringify(jogos))
})


app.post('/api/jogos', (req, res) => {
    try{
        const dadosRecebidos = req.body;
        if(!dadosRecebidos.nome || !dadosRecebidos.plataforma){
            throw new Error('Campos Inválidos')
        }
        jogos.push(dadosRecebidos)
        res.send(JSON.stringify(dadosRecebidos))
    }
    catch(e){
        res.send(JSON.stringify({
            mensagem: e.message
        }))
    }

})

app.listen(3000, () => console.log('A Api está funcionando'))
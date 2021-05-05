const express = require('express')
const app = express()
app.use(express.json())

const sites = []

app.get('/api/sites', (req, res) => {
    res.status(200).send(sites)
})

app.post('/api/sites', (req, res) => {
    try {
        const site = req.body
        
        if (!site.url || !site.dataDeAcesso) {
           throw Error('Os campos URL e dataDeAcesso não podem estar vazios!')
        }
        
        sites.push(site)
        res.status(201).send(JSON.stringify(site))
    }
    catch(e){
        res.status(400).send(JSON.stringify({
            mensagem: e.message
        }))
    }
})

app.listen(3000, () => console.log('A Api está funcionando'))
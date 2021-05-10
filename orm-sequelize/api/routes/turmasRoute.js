const router = require('express').Router()
const TurmaController = require('../controllers/TurmaController')

router.get('/turmas', TurmaController.list)
router.post('/turmas', TurmaController.create)
router.get('/turmas/:id', TurmaController.getById)
router.put('/turmas/:id', TurmaController.update)
router.delete('/turmas/:id', TurmaController.delete)

const routerMatriculas = require('./matriculasRoute')
router.use('/turmas/:turmaId/', routerMatriculas)


module.exports = router

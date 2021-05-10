//const { Router } = require('express')
const router = require('express').Router()
const PessoaController = require('../controllers/PessoaController')

router.get('/pessoas', PessoaController.list)
router.post('/pessoas', PessoaController.create)
router.get('/pessoas/ativas', PessoaController.listAtivos)
router.get('/pessoas/:id', PessoaController.getById)
router.put('/pessoas/:id', PessoaController.update)
router.delete('/pessoas/:id', PessoaController.delete)
router.post('/pessoas/:id/restaurar', PessoaController.restore)
router.post('/pessoas/:id/cancelar', PessoaController.cancelaPessoa)

//router.get('/pessoas/matriculas/lotadas', PessoaController.listTurmasLotadas)
//router.get('/pessoas/matriculas/:turmaId/confirmadas', PessoaController.listMatriculasPorTurma)
//router.get('/pessoas/:estudanteId/matriculas', PessoaController.listMatriculas) 



const routerMatriculas = require('./matriculasRoute')
router.use('/pessoas/:estudanteId/', routerMatriculas)

/*
router.get('/pessoas/:estudanteId/matriculas', PessoaController.listMatriculas)
router.post('/pessoas/:estudanteId/matriculas', PessoaController.createMatricula)
router.get('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.getMatriculaById)
router.put('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.updateMatricula)
router.delete('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.deleteMatricula)
*/

module.exports = router

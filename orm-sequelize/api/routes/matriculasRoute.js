const router = require('express').Router({mergeParams: true})
const MatriculaController = require('../controllers/MatriculaController')

router.get('/matriculas', MatriculaController.list)
router.post('/matriculas', MatriculaController.create)
router.get('/matriculas/:matriculaId', MatriculaController.getById)
router.put('/matriculas/:matriculaId', MatriculaController.update)
router.delete('/matriculas/:matriculaId', MatriculaController.delete)


module.exports = router

const router = require('express').Router()
const NivelController = require('../controllers/NivelController')

router.get('/niveis', NivelController.list)
router.post('/niveis', NivelController.create)
router.get('/niveis/:id', NivelController.getById)
router.put('/niveis/:id', NivelController.update)
router.delete('/niveis/:id', NivelController.delete)


module.exports = router

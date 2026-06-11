const express = require('express')
const router = express.Router()
const { createSeminaire, getSeminaires, getSeminaireById, updateSeminaire, deleteSeminaire, addParticipant } = require('../controllers/seminaire_controller')
const { verifyToken } = require('../controllers/authentication_controller')

router.get('/', verifyToken, getSeminaires)
router.post('/', verifyToken, createSeminaire)
router.get('/:id', verifyToken, getSeminaireById)
router.put('/:id', verifyToken, updateSeminaire)
router.delete('/:id', verifyToken, deleteSeminaire)
router.post('/:id/participants', verifyToken, addParticipant)

module.exports = router

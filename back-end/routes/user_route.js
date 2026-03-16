const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controller')
const authenticationController = require('../controllers/authentication_controller')

router.post('/', authenticationController.verifyToken, authenticationController.isAdmin, userController.createUser)
router.get('/me', authenticationController.verifyToken, authenticationController.getCurrentUser)
router.get('/', authenticationController.verifyToken,userController.getUsers)
router.put('/', authenticationController.verifyToken, userController.updateUser)
router.delete('/', authenticationController.verifyToken, userController.deleteUser)

// Routes avec ID (pour l'admin)
router.put('/:id', authenticationController.verifyToken, authenticationController.isAdmin, userController.updateUserById)
router.delete('/:id', authenticationController.verifyToken, authenticationController.isAdmin, userController.deleteUserById)

module.exports = router
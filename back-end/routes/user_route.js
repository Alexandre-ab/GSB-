const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controller')
const authenticationController = require('../controllers/authentication_controller')

router.post('/', authenticationController.verifyToken, authenticationController.isAdmin, userController.createUser)
router.get('/me', authenticationController.verifyToken, authenticationController.getCurrentUser)
router.get('/', authenticationController.verifyToken,userController.getUsers)
router.put('/', authenticationController.verifyToken, userController.updateUser)
router.delete('/', authenticationController.verifyToken, userController.deleteUser)

// Routes pour l'utilisateur courant
router.put('/me', authenticationController.verifyToken, userController.updateCurrentUser)
router.put('/me/password', authenticationController.verifyToken, userController.changePassword)

// Routes avec ID (pour l'admin)
router.put('/:id', authenticationController.verifyToken, authenticationController.isAdmin, userController.updateUserById)
router.delete('/:id', authenticationController.verifyToken, authenticationController.isAdmin, userController.deleteUserById)

module.exports = router

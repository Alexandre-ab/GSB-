const express = require('express')
const router = express.Router()
const { createBill, getBills, getBillById, updateBill, deleteBill } = require('../controllers/bill_controller')
const { verifyToken } = require('../controllers/authentication_controller')
const upload = require('../middleware/upload')

router.post('/', verifyToken, upload.single('proof'), createBill)
router.get('/', verifyToken, getBills)
router.get('/:id', verifyToken, getBillById)
router.put('/:id', verifyToken, updateBill)
router.delete('/:id', verifyToken, deleteBill)

module.exports = router 
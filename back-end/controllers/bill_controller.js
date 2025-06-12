const Bill = require('../models/bill_model')
const { uploadToS3 } = require('../utils/s3')

const createBill = async (req, res) => {
    try {
        const { date, amount, description, status, type } = JSON.parse(req.body.metadata)
        console.log(date, amount, description, status, type)
        const { id } = req.user
        
        // Handle file upload
        let proofUrl
        if (req.file) {
            proofUrl = await uploadToS3(req.file)
        } else {
            throw new Error('Proof image is required', { cause: 400 })
        }
        const bill = new Bill({ 
            date: date, 
            amount: amount, 
            proof: proofUrl, 
            description: description, 
            status: status, 
            type: type, 
            user: id 
        })
        await bill.save()
        res.status(201).json(bill)
    } catch (error) { 
        if (error['cause'] === 400) {
            res.status(400).json({ message: error.message })
        } else {
            console.error('Error creating bill:', error)
            res.status(500).json({ message: "Server error" })
        }
    }
}

const getBills = async (req, res) => {
    try {
        const { id, role } = req.user
        let bills
        if (role === 'admin') {
            bills = await Bill.find({})
        } else {
            bills = await Bill.find({ user: id })
        }
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const getBillById = async (req, res) => {
    try {
        const { id } = req.params
        const bill = await Bill.findById(id)
        if (!bill) {
            throw new Error('Bill not found', { cause: 404 })
        } else {
            res.status(200).json(bill)
        }
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

const updateBill = async (req, res) => {
    try {
        const { id } = req.params
        const { date, amount, proof, description, status, type } = req.body
        const bill = await Bill.findByIdAndUpdate(
            id,
            { date, amount, proof, description, status, type },
            { new: true }
        )
        if (!bill) {
            throw new Error('Bill not found', { cause: 404 })
        } else {
            res.status(200).json(bill)
        }
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

const deleteBill = async (req, res) => {
    try {
        const { id } = req.params
        const bill = await Bill.findByIdAndDelete(id)
        if (!bill) {
            throw new Error('Bill not found', { cause: 404 })
        }
        res.status(200).json({ message: 'Bill deleted' })
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

module.exports = { createBill, getBills, getBillById, updateBill, deleteBill }

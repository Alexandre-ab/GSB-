const Seminar = require('../models/seminar_model')
const Bill = require('../models/bill_model')

const createSeminaire = async (req, res) => {
    try {
        const { title, startDate, endDate, location, description } = req.body
        const seminar = new Seminar({
            title, startDate, endDate, location, description,
            createdBy: req.user.id,
            participants: [req.user.id]
        })
        await seminar.save()
        res.status(201).json(seminar)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const getSeminaires = async (req, res) => {
    try {
        const seminars = await Seminar.find({})
            .populate('createdBy', 'name email')
            .populate('participants', 'name email')
            .sort({ startDate: -1 })
        res.status(200).json(seminars)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const getSeminaireById = async (req, res) => {
    try {
        const seminar = await Seminar.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('participants', 'name email')
        if (!seminar) return res.status(404).json({ message: 'Séminaire non trouvé' })
        const bills = await Bill.find({ seminar: req.params.id })
            .populate('user', 'name email')
        res.status(200).json({ seminar, bills })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const updateSeminaire = async (req, res) => {
    try {
        const seminar = await Seminar.findById(req.params.id)
        if (!seminar) return res.status(404).json({ message: 'Séminaire non trouvé' })
        if (seminar.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé' })
        }
        const updated = await Seminar.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const deleteSeminaire = async (req, res) => {
    try {
        const seminar = await Seminar.findById(req.params.id)
        if (!seminar) return res.status(404).json({ message: 'Séminaire non trouvé' })
        if (seminar.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé' })
        }
        await Seminar.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Séminaire supprimé' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const addParticipant = async (req, res) => {
    try {
        const { userId } = req.body
        const seminar = await Seminar.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { participants: userId } },
            { new: true }
        ).populate('participants', 'name email')
        if (!seminar) return res.status(404).json({ message: 'Séminaire non trouvé' })
        res.status(200).json(seminar)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { createSeminaire, getSeminaires, getSeminaireById, updateSeminaire, deleteSeminaire, addParticipant }

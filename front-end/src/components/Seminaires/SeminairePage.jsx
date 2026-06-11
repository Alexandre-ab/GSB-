import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { seminaireService } from '../../api/services/seminaireService'
import './SeminairePage.css'

const SeminairePage = () => {
    const [seminaires, setSeminaires] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ title: '', startDate: '', endDate: '', location: '', description: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        loadSeminaires()
    }, [])

    const loadSeminaires = async () => {
        try {
            const data = await seminaireService.getAll()
            setSeminaires(data)
        } catch (err) {
            setError('Erreur lors du chargement des séminaires')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await seminaireService.create(formData)
            setShowForm(false)
            setFormData({ title: '', startDate: '', endDate: '', location: '', description: '' })
            loadSeminaires()
        } catch (err) {
            console.error('Erreur création séminaire:', err)
            setError(`Erreur : ${err.message || 'Impossible de créer le séminaire'}`)
        }
    }

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')

    return (
        <div className="seminaire-container">
            <div className="page-header">
                <h1>Séminaires</h1>
                <button className="btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm
                        ? <><i className="fa-solid fa-xmark"></i> Annuler</>
                        : <><i className="fa-solid fa-plus"></i> Nouveau séminaire</>
                    }
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {showForm && (
                <div className="seminaire-form-card">
                    <h2>Créer un séminaire</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Titre *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Ex : Séminaire commercial 2026"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date de début *</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Date de fin *</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Lieu</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Ex : Paris, Hôtel Marriott"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Décrivez l'objectif du séminaire..."
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn-submit">
                                <i className="fa-solid fa-check"></i> Créer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Chargement...</p>
                </div>
            ) : seminaires.length === 0 ? (
                <div className="empty-state">
                    <i className="fa-solid fa-calendar-days"></i>
                    <p>Aucun séminaire pour le moment.</p>
                </div>
            ) : (
                <div className="seminaire-grid">
                    {seminaires.map(s => (
                        <div className="seminaire-card" key={s._id} onClick={() => navigate(`/seminaires/${s._id}`)}>
                            <div className="seminaire-card-header">
                                <h3>{s.title}</h3>
                                <span className="seminaire-location">
                                    <i className="fa-solid fa-location-dot"></i>
                                    {s.location || 'Lieu non précisé'}
                                </span>
                            </div>
                            <div className="seminaire-card-dates">
                                <i className="fa-solid fa-calendar"></i>
                                <span>{formatDate(s.startDate)} → {formatDate(s.endDate)}</span>
                            </div>
                            {s.description && <p className="seminaire-card-desc">{s.description}</p>}
                            <div className="seminaire-card-footer">
                                <span><i className="fa-solid fa-users"></i> {s.participants?.length || 0} participant(s)</span>
                                <span className="seminaire-creator">Par {s.createdBy?.name || 'Inconnu'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SeminairePage

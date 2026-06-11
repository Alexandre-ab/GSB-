import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { seminaireService } from '../../api/services/seminaireService'
import { userService } from '../../api/services/userService'
import './SeminairePage.css'

const SeminaireDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [seminar, setSeminar] = useState(null)
    const [bills, setBills] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [allUsers, setAllUsers] = useState([])
    const [showAddParticipant, setShowAddParticipant] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState('')

    useEffect(() => {
        loadDetail()
    }, [id])

    const loadDetail = async () => {
        try {
            const data = await seminaireService.getById(id)
            setSeminar(data.seminar)
            setBills(data.bills)
        } catch (err) {
            setError('Séminaire introuvable')
        } finally {
            setIsLoading(false)
        }
    }

    const loadUsers = async () => {
        try {
            const users = await userService.getAllUsers()
            setAllUsers(users)
        } catch {}
        setShowAddParticipant(true)
    }

    const handleAddParticipant = async () => {
        if (!selectedUserId) return
        try {
            await seminaireService.addParticipant(id, selectedUserId)
            setShowAddParticipant(false)
            setSelectedUserId('')
            loadDetail()
        } catch {
            setError("Erreur lors de l'ajout du participant")
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'status-badge success'
            case 'Rejected': return 'status-badge danger'
            default: return 'status-badge pending'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Approved': return 'Approuvé'
            case 'Rejected': return 'Refusé'
            default: return 'En attente'
        }
    }

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')

    if (isLoading) return (
        <div className="seminaire-container">
            <div className="loading-container"><div className="loader"></div><p>Chargement...</p></div>
        </div>
    )

    if (error) return (
        <div className="seminaire-container">
            <div className="error-banner">{error}</div>
        </div>
    )

    return (
        <div className="seminaire-container">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="btn-back" onClick={() => navigate('/seminaires')}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1>{seminar.title}</h1>
                </div>
                <Link to={`/remboursement?seminar=${id}`} className="btn-add">
                    <i className="fa-solid fa-plus"></i> Ajouter une note de frais
                </Link>
            </div>

            <div className="detail-grid">
                <div className="detail-info-card">
                    <h2>Informations</h2>
                    <div className="info-row">
                        <i className="fa-solid fa-calendar"></i>
                        <span>{formatDate(seminar.startDate)} → {formatDate(seminar.endDate)}</span>
                    </div>
                    {seminar.location && (
                        <div className="info-row">
                            <i className="fa-solid fa-location-dot"></i>
                            <span>{seminar.location}</span>
                        </div>
                    )}
                    {seminar.description && (
                        <div className="info-row">
                            <i className="fa-solid fa-align-left"></i>
                            <span>{seminar.description}</span>
                        </div>
                    )}
                    <div className="info-row">
                        <i className="fa-solid fa-user"></i>
                        <span>Créé par {seminar.createdBy?.name}</span>
                    </div>
                </div>

                <div className="detail-participants-card">
                    <div className="card-header-row">
                        <h2>Participants ({seminar.participants?.length || 0})</h2>
                        <button className="btn-small" onClick={loadUsers}>
                            <i className="fa-solid fa-user-plus"></i> Ajouter
                        </button>
                    </div>

                    {showAddParticipant && (
                        <div className="add-participant-form">
                            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                                <option value="">Sélectionner un utilisateur</option>
                                {allUsers
                                    .filter(u => !seminar.participants.some(p => p._id === u._id))
                                    .map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                    ))
                                }
                            </select>
                            <button className="btn-submit" onClick={handleAddParticipant}>Ajouter</button>
                            <button className="btn-cancel" onClick={() => setShowAddParticipant(false)}>Annuler</button>
                        </div>
                    )}

                    <ul className="participants-list">
                        {seminar.participants?.map(p => (
                            <li key={p._id}>
                                <i className="fa-solid fa-circle-user"></i>
                                {p.name}
                                <span className="email-light">{p.email}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="detail-bills-section">
                <h2>Notes de frais ({bills.length})</h2>
                {bills.length === 0 ? (
                    <p className="empty-text">Aucune note de frais rattachée à ce séminaire.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Montant</th>
                                    <th>Participant</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(bill => (
                                    <tr key={bill._id}>
                                        <td>{formatDate(bill.date)}</td>
                                        <td>{bill.type}</td>
                                        <td>{bill.description}</td>
                                        <td><span className="amount">{bill.amount?.toFixed(2)} €</span></td>
                                        <td>{bill.user?.name || 'Inconnu'}</td>
                                        <td>
                                            <span className={getStatusClass(bill.status)}>
                                                {getStatusLabel(bill.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SeminaireDetail

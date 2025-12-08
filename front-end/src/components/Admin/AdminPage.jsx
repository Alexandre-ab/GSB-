import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { billsAPI } from '../../api/services/billService';
import api from '../../api/config';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('demandes');
    const [demandes, setDemandes] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDemandes: 0,
        enAttente: 0,
        approuvees: 0,
        refusees: 0,
        montantTotal: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Charger les données
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            
            // Charger les demandes
            const billsData = await billsAPI.getAll();
            setDemandes(billsData);
            
            // Calculer les stats
            const statsData = {
                totalUsers: 0, // À implémenter si nécessaire
                totalDemandes: billsData.length,
                enAttente: billsData.filter(b => b.status === 'Pending').length,
                approuvees: billsData.filter(b => b.status === 'Approved').length,
                refusees: billsData.filter(b => b.status === 'Rejected').length,
                montantTotal: billsData.reduce((sum, b) => sum + (b.amount || 0), 0)
            };
            setStats(statsData);
            
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            alert('Erreur lors du chargement des données');
        } finally {
            setIsLoading(false);
        }
    };

    // Approuver une demande
    const handleApprove = async (billId) => {
        try {
            await api.put(`/api/bills/${billId}`, { status: 'Approved' });
            alert('Demande approuvée avec succès !');
            loadData();
        } catch (error) {
            console.error('Erreur lors de l\'approbation:', error);
            alert('Erreur lors de l\'approbation de la demande');
        }
    };

    // Refuser une demande
    const handleReject = async (billId) => {
        const reason = prompt('Raison du refus (optionnel):');
        try {
            await api.put(`/api/bills/${billId}`, { status: 'Rejected' });
            alert('Demande refusée');
            loadData();
        } catch (error) {
            console.error('Erreur lors du refus:', error);
            alert('Erreur lors du refus de la demande');
        }
    };

    // Fonction pour obtenir la classe du badge de statut
    const getStatusClass = (status) => {
        switch(status) {
            case 'Approved': return 'badge-approved';
            case 'Rejected': return 'badge-rejected';
            case 'Pending': return 'badge-pending';
            default: return 'badge-pending';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'Approved': return 'Approuvé';
            case 'Rejected': return 'Refusé';
            case 'Pending': return 'En attente';
            default: return 'En attente';
        }
    };

    if (isLoading) {
        return (
            <div className="admin-container">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Chargement du panel admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1>Panel Administrateur</h1>
                    <p className="admin-subtitle">Gestion des demandes et utilisateurs</p>
                </div>
            </div>

            {/* Statistiques */}
            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">En attente</span>
                        <span className="stat-value">{stats.enAttente}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon approved">
                        <i className="fa-solid fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Approuvées</span>
                        <span className="stat-value">{stats.approuvees}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon rejected">
                        <i className="fa-solid fa-times-circle"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Refusées</span>
                        <span className="stat-value">{stats.refusees}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon total">
                        <i className="fa-solid fa-euro-sign"></i>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Montant total</span>
                        <span className="stat-value">{stats.montantTotal.toFixed(2)} €</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'demandes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('demandes')}
                >
                    <i className="fa-solid fa-file-invoice"></i>
                    Demandes
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <i className="fa-solid fa-users"></i>
                    Utilisateurs
                </button>
            </div>

            {/* Contenu */}
            <div className="admin-content">
                {activeTab === 'demandes' && (
                    <div className="demandes-section">
                        <div className="section-header">
                            <h2>Toutes les demandes ({demandes.length})</h2>
                            <button className="btn-refresh" onClick={loadData}>
                                <i className="fa-solid fa-refresh"></i>
                                Actualiser
                            </button>
                        </div>
                        
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Montant</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandes.map((demande) => (
                                        <tr key={demande._id}>
                                            <td className="id-cell">{demande._id?.slice(-8)}</td>
                                            <td className="date-cell">
                                                {new Date(demande.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="type-cell">{demande.type}</td>
                                            <td className="desc-cell">{demande.description || '-'}</td>
                                            <td className="amount-cell">{demande.amount?.toFixed(2)} €</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(demande.status)}`}>
                                                    {getStatusLabel(demande.status)}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                {demande.status === 'Pending' && (
                                                    <>
                                                        <button 
                                                            className="action-btn approve-btn"
                                                            onClick={() => handleApprove(demande._id)}
                                                            title="Approuver"
                                                        >
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                        <button 
                                                            className="action-btn reject-btn"
                                                            onClick={() => handleReject(demande._id)}
                                                            title="Refuser"
                                                        >
                                                            <i className="fa-solid fa-times"></i>
                                                        </button>
                                                    </>
                                                )}
                                                {demande.proof && (
                                                    <a 
                                                        href={demande.proof} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="action-btn view-btn"
                                                        title="Voir le justificatif"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-section">
                        <div className="section-header">
                            <h2>Gestion des utilisateurs</h2>
                        </div>
                        <div className="coming-soon">
                            <i className="fa-solid fa-wrench"></i>
                            <p>Fonctionnalité en cours de développement</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;


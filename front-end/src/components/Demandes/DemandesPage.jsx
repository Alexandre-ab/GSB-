import React, { useState, useEffect } from 'react';
import './DemandesPage.css';
import BillModal from '../Modal/BillModal';
import { billsAPI } from '../../api/services/billService';

const DemandesPage = () => {
    // État pour les données
    const [demandes, setDemandes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewBillModalOpen, setIsViewBillModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [filters, setFilters] = useState({ statut: '', searchText: '' });
    // Charger les données depuis l'API
    useEffect(() => {
        const loadDemandes = async () => {
            try {
                // Vérifier que l'utilisateur est connecté
                const token = localStorage.getItem('authToken') || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                if (!token) {
                    console.warn('Aucun token d\'authentification trouvé');
                    setDemandes([]);
                    setIsLoading(false);
                    return;
                }

                // Charger les demandes depuis l'API
                const apiDemandes = await billsAPI.getAll();

                // Convertir les données API au format attendu par le composant
                // On garde aussi les données originales pour le modal
                const demandesFormattees = apiDemandes.map(bill => ({
                    id: bill._id,
                    type: bill.type || 'Note de frais',
                    motif: bill.description || 'Aucune description',
                    statut: bill.status === 'Approved' ? 'Approuvé' :
                        bill.status === 'Rejected' ? 'Refusé' : 'En attente',
                    montant: bill.amount ? bill.amount.toString() : '0.00',
                    // Garder les données complètes pour le modal
                    originalData: bill
                }));

                setDemandes(demandesFormattees);
            } catch (error) {
                console.error('Erreur lors du chargement des demandes:', error);
                // En cas d'erreur, afficher un message plutôt que des données factices
                setDemandes([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Simuler un petit délai pour l'UX
        const timer = setTimeout(() => {
            loadDemandes();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Fonction pour générer des icônes de type
    const getTypeIcon = (type) => {
        switch (type) {
            case 'Note de frais':
                return 'fa-solid fa-receipt';
            case 'Déplacement':
                return 'fa-solid fa-car';
            case 'Matériel':
                return 'fa-solid fa-laptop';
            case 'Transport':
                return 'fa-solid fa-taxi';
            case 'Hébergement':
                return 'fa-solid fa-hotel';
            case 'Communication':
                return 'fa-solid fa-mobile-screen';
            case 'Formation':
                return 'fa-solid fa-graduation-cap';
            default:
                return 'fa-solid fa-file-invoice';
        }
    };

    // Fonction pour le statut des badges
    const getStatusClass = (statut) => {
        switch (statut) {
            case 'Approuvé':
                return 'statut-badge success';
            case 'Refusé':
                return 'statut-badge danger';
            case 'En attente':
            default:
                return 'statut-badge warning';
        }
    };

    // Fonction pour formater les montants
    const formatMontant = (montant) => {
        return `${parseFloat(montant).toFixed(2)} €`;
    };

    const handleViewBillModalClose = () => {
        setIsViewBillModalOpen(false);
        setSelectedBill(null);
    };

    // Handlers pour les actions sur les demandes
    const handleViewDemande = (demande) => {
        console.log('🔍 Ouverture du détail de la demande:', demande);

        // Utiliser les données originales complètes de l'API
        if (demande.originalData) {
            console.log('✅ Utilisation des données originales:', demande.originalData);
            setSelectedBill(demande.originalData);
        } else {
            console.log('⚠️ Utilisation du fallback');
            // Fallback si originalData n'existe pas
            const billData = {
                _id: demande.id,
                type: demande.type,
                description: demande.motif,
                status: demande.statut === 'Approuvé' ? 'Approved' :
                    demande.statut === 'Refusé' ? 'Rejected' : 'Pending',
                amount: parseFloat(demande.montant),
                date: new Date().toISOString()
            };
            console.log('📋 Données du modal:', billData);
            setSelectedBill(billData);
        }

        console.log('🚀 Ouverture du modal...');
        setIsViewBillModalOpen(true);
    };

    const demandesFiltrees = demandes.filter(demande => {
        const matchStatut = !filters.statut || demande.statut === filters.statut;
        const searchLower = filters.searchText.toLowerCase();
        const matchText = !filters.searchText ||
            demande.type.toLowerCase().includes(searchLower) ||
            demande.motif.toLowerCase().includes(searchLower);
        return matchStatut && matchText;
    });

    return (
        <div className="demandes-table">
            <div className="demandes-header">
                <h2>Mes Demandes</h2>
                <div className="demandes-filters" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
                    <input
                        type="text"
                        placeholder="Rechercher (type, motif)..."
                        value={filters.searchText}
                        onChange={e => setFilters(f => ({ ...f, searchText: e.target.value }))}
                        className="filter-search"
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '220px' }}
                    />
                    <select
                        value={filters.statut}
                        onChange={e => setFilters(f => ({ ...f, statut: e.target.value }))}
                        className="filter-select"
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="En attente">En attente</option>
                        <option value="Approuvé">Approuvé</option>
                        <option value="Refusé">Refusé</option>
                    </select>
                    {(filters.statut || filters.searchText) && (
                        <button
                            onClick={() => setFilters({ statut: '', searchText: '' })}
                            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Chargement des demandes...</p>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Motif de la dépense</th>
                            <th>Statut</th>
                            <th>Montant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demandesFiltrees.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                                    Aucune demande ne correspond aux filtres sélectionnés.
                                </td>
                            </tr>
                        )}
                        {demandesFiltrees.map(demande => (
                            <tr key={demande.id}>
                                <td>
                                    <div className="type-with-icon">
                                        <span className="type-icon">
                                            <i className={getTypeIcon(demande.type)}></i>
                                        </span>
                                        {demande.type}
                                    </div>
                                </td>
                                <td>{demande.motif}</td>
                                <td>
                                    <span className={getStatusClass(demande.statut)}>
                                        {demande.statut}
                                    </span>
                                </td>
                                <td className="montant">{formatMontant(demande.montant)}</td>
                                <td>
                                    <div className="actions-container">
                                        <button
                                            className="action-btn view-btn"
                                            title="Voir les détails complets"
                                            onClick={() => handleViewDemande(demande)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                            <span className="btn-text">Détails</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <BillModal
                bill={selectedBill}
                isOpen={isViewBillModalOpen}
                onClose={handleViewBillModalClose}
            />
        </div>
    );
};

export default DemandesPage; 
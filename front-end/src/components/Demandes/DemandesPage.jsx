import React, { useState, useEffect } from 'react';
import './DemandesPage.css';
import BillModal from '../Modal/BillModal';
import { billsAPI, testAPI } from '../../services/api';

const DemandesPage = () => {
    // État pour les données
    const [demandes, setDemandes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewBillModalOpen, setIsViewBillModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);        
    // Charger les données depuis l'API
    useEffect(() => {
        const loadDemandes = async () => {
            try {
                // Vérifier que l'utilisateur est connecté
                const token = localStorage.getItem('authToken') || localStorage.getItem('token');
                if (!token) {
                    console.warn('Aucun token d\'authentification trouvé');
                    setDemandes([]);
                    setIsLoading(false);
                    return;
                }

                // Tester la connexion API
                await testAPI();

                // Charger les demandes depuis l'API
                const apiDemandes = await billsAPI.getAll();
                
                // Convertir les données API au format attendu par le composant
                const demandesFormattees = apiDemandes.map(bill => ({
                    id: bill._id,
                    type: bill.type || 'Note de frais',
                    motif: bill.description || 'Aucune description',
                    statut: bill.status === 'Approved' ? 'Approuvé' : 
                           bill.status === 'Rejected' ? 'Refusé' : 'En attente',
                    montant: bill.amount ? bill.amount.toString() : '0.00'
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
        switch(type) {
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
        switch(statut) {
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
        // Convertir les données de demande au format attendu par BillModal
        const billData = {
            _id: demande.id,
            type: demande.type,
            description: demande.motif,
            status: demande.statut === 'Approuvé' ? 'Approved' : 
                   demande.statut === 'Refusé' ? 'Rejected' : 'Pending',
            amount: parseFloat(demande.montant),
            date: new Date().toISOString() // Vous pouvez ajouter une vraie date dans vos données
        };
        setSelectedBill(billData);
        setIsViewBillModalOpen(true);
    };

    return (
        <div className="demandes-table">
            <div className="demandes-header">
                <h2>Mes Demandes</h2>
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
                        {demandes.map(demande => (
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
                                            title="Voir détails"
                                            onClick={() => handleViewDemande(demande)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
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
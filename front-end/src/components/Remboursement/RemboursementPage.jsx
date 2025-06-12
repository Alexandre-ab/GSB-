import React, { useState } from 'react';
import './RemboursementPage.css';

const RemboursementPage = () => {
    // État pour le formulaire de remboursement
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        montant: '',
        justificatif: null,
        description: '',
        categorie: ''
    });
    
    // État pour afficher le formulaire ou non
    const [showForm, setShowForm] = useState(false);
    
    // État pour les remboursements récents
    const [recentRequests, setRecentRequests] = useState([
        { id: 'DEM-1092', date: '18 juin 2023', type: 'Transport', montant: '78.50', statut: 'En attente', description: 'Trajet Paris-Lyon pour visite client' },
        { id: 'DEM-1089', date: '15 juin 2023', type: 'Transport', montant: '57.20', statut: 'Approuvé', description: 'Taxi pour rendez-vous professionnel' },
        { id: 'DEM-1088', date: '12 juin 2023', type: 'Restauration', montant: '94.50', statut: 'Approuvé', description: 'Déjeuner avec clients' },
        { id: 'DEM-1087', date: '10 juin 2023', type: 'Hébergement', montant: '185.00', statut: 'En attente', description: 'Nuit d\'hôtel à Marseille' }
    ]);
    
    // État pour l'indication de soumission réussie
    const [successSubmit, setSuccessSubmit] = useState(false);
    
    // Types de dépenses disponibles
    const expenseTypes = [
        { id: 'transport', label: 'Transport', categories: ['Train', 'Avion', 'Taxi', 'Voiture de location', 'Carburant', 'Péage', 'Autres'] },
        { id: 'accommodation', label: 'Hébergement', categories: ['Hôtel', 'Airbnb', 'Autres'] },
        { id: 'meals', label: 'Restauration', categories: ['Repas d\'affaires', 'Repas personnel', 'Autres'] },
        { id: 'supplies', label: 'Fournitures', categories: ['Bureautique', 'Informatique', 'Autres'] },
        { id: 'communication', label: 'Communication', categories: ['Téléphone', 'Internet', 'Autres'] },
        { id: 'events', label: 'Événements', categories: ['Conférence', 'Séminaire', 'Formation', 'Autres'] },
        { id: 'other', label: 'Autre', categories: ['Autre'] }
    ];

    // Fonction pour gérer les changements de formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Fonction pour gérer les fichiers
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                justificatif: file
            });
        }
    };
    
    // Fonction pour afficher ou masquer le formulaire
    const toggleForm = () => {
        setShowForm(!showForm);
        // Réinitialiser le formulaire
        if (!showForm) {
            setFormData({
                type: '',
                date: '',
                montant: '',
                justificatif: null,
                description: '',
                categorie: ''
            });
            setSuccessSubmit(false);
        }
    };
    
    // Fonction pour soumettre le formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simuler l'envoi des données au serveur
        setTimeout(() => {
            // Générer un ID aléatoire pour la nouvelle demande
            const newId = `DEM-${1093 + Math.floor(Math.random() * 10)}`;
            
            // Ajouter la nouvelle demande à la liste
            const newRequest = {
                id: newId,
                date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                type: expenseTypes.find(type => type.id === formData.type)?.label || formData.type,
                montant: parseFloat(formData.montant).toFixed(2),
                statut: 'En cours de traitement',
                description: formData.description
            };
            
            setRecentRequests([newRequest, ...recentRequests]);
            
            // Afficher le message de succès
            setSuccessSubmit(true);
            
            // Réinitialiser le formulaire
            setFormData({
                type: '',
                date: '',
                montant: '',
                justificatif: null,
                description: '',
                categorie: ''
            });
            
            // Masquer le message de succès après 5 secondes
            setTimeout(() => {
                setSuccessSubmit(false);
            }, 5000);
        }, 1000);
    };
    
    // Fonction pour obtenir la classe de statut
    const getStatusClass = (statut) => {
        switch(statut) {
            case 'Approuvé':
                return 'status-badge success';
            case 'Refusé':
                return 'status-badge danger';
            case 'En cours de traitement':
                return 'status-badge processing';
            case 'En attente':
            default:
                return 'status-badge pending';
        }
    };

    return (
        <div className="remboursement-container">
            <div className="page-header">
                <h1>Remboursement</h1>
                <button className="btn-add" onClick={toggleForm}>
                    {showForm ? (
                        <><i className="fa-solid fa-xmark"></i> Annuler</>
                    ) : (
                        <><i className="fa-solid fa-plus"></i> Nouvelle demande</>
                    )}
                </button>
            </div>
            
            {showForm ? (
                <div className="form-container">
                    <div className="form-card">
                        <div className="form-header">
                            <h2>Nouvelle demande de remboursement</h2>
                            <p>Veuillez remplir tous les champs obligatoires (*)</p>
                        </div>
                        
                        {successSubmit && (
                            <div className="success-message">
                                <i className="fa-solid fa-check-circle"></i>
                                <span>Votre demande de remboursement a été soumise avec succès.</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="type">Type de dépense *</label>
                                <select 
                                    id="type" 
                                    name="type" 
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Sélectionnez un type</option>
                                    {expenseTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {formData.type && (
                                <div className="form-group">
                                    <label htmlFor="categorie">Catégorie *</label>
                                    <select 
                                        id="categorie" 
                                        name="categorie" 
                                        value={formData.categorie}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionnez une catégorie</option>
                                        {expenseTypes
                                            .find(type => type.id === formData.type)
                                            ?.categories.map((cat, index) => (
                                                <option key={index} value={cat}>
                                                    {cat}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Date de la dépense *</label>
                                    <input 
                                        type="date" 
                                        id="date" 
                                        name="date" 
                                        value={formData.date}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="montant">Montant (€) *</label>
                                    <input 
                                        type="number" 
                                        id="montant" 
                                        name="montant" 
                                        value={formData.montant}
                                        onChange={handleChange}
                                        min="0.01" 
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Description détaillée *</label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Décrivez le contexte de cette dépense..."
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="justificatif">Justificatif(s) *</label>
                                <div className="file-input-container">
                                    <input 
                                        type="file" 
                                        id="justificatif" 
                                        name="justificatif" 
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        required
                                    />
                                    <div className="file-input-custom">
                                        <span className="file-name">
                                            {formData.justificatif ? formData.justificatif.name : 'Aucun fichier sélectionné'}
                                        </span>
                                        <button type="button" className="file-select-btn">
                                            <i className="fa-solid fa-upload"></i> Parcourir
                                        </button>
                                    </div>
                                </div>
                                <p className="file-format-info">
                                    <i className="fa-solid fa-circle-info"></i> Formats acceptés : JPG, PNG, PDF - 5MB max.
                                </p>
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={toggleForm}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-submit">
                                    <i className="fa-solid fa-paper-plane"></i> Soumettre
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="form-sidebar">
                        <div className="info-card">
                            <div className="info-card-header">
                                <i className="fa-solid fa-circle-info"></i>
                                <h3>Informations</h3>
                            </div>
                            <div className="info-card-content">
                                <p>Les demandes de remboursement sont traitées dans un délai de 5 jours ouvrés.</p>
                                <p>Assurez-vous de fournir des justificatifs lisibles et conformes aux dépenses déclarées.</p>
                                <p>Pour toute question, contactez le service comptabilité.</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-card-header">
                                <i className="fa-solid fa-lightbulb"></i>
                                <h3>Conseils</h3>
                            </div>
                            <div className="info-card-content">
                                <ul className="tips-list">
                                    <li>Conservez toujours vos reçus originaux</li>
                                    <li>Soumettez vos demandes régulièrement</li>
                                    <li>Pour les repas d'affaires, précisez les participants</li>
                                    <li>Incluez tous les détails pertinents dans la description</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="remboursement-content">
                    <div className="overview-card">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-money-bill-wave"></i>
                                    <span>Total remboursé</span>
                                </div>
                                <div className="stat-value">3 254,75 €</div>
                                <div className="stat-footer">Ce mois-ci</div>
                            </div>
                            
                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-clock"></i>
                                    <span>En attente</span>
                                </div>
                                <div className="stat-value">415,20 €</div>
                                <div className="stat-footer">3 demandes</div>
                            </div>
                            
                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span>Taux d'approbation</span>
                                </div>
                                <div className="stat-value">92%</div>
                                <div className="stat-footer">24 demandes sur 26</div>
                            </div>
                            
                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-file-invoice"></i>
                                    <span>Dernière demande</span>
                                </div>
                                <div className="stat-value">Il y a 2 jours</div>
                                <div className="stat-footer">Le 18 juin 2023</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="recent-requests">
                        <div className="section-header">
                            <h2>Demandes récentes</h2>
                            <a href="/demandes" className="view-all-link">Voir tout <i className="fa-solid fa-arrow-right"></i></a>
                        </div>
                        
                        <div className="requests-table-container">
                            <table className="requests-table">
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
                                    {recentRequests.map((request, index) => (
                                        <tr key={index}>
                                            <td>
                                                <span className="request-id">{request.id}</span>
                                            </td>
                                            <td>{request.date}</td>
                                            <td>{request.type}</td>
                                            <td>
                                                <div className="description-cell">
                                                    {request.description}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="amount">{request.montant} €</span>
                                            </td>
                                            <td>
                                                <span className={getStatusClass(request.statut)}>
                                                    {request.statut}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button className="action-btn view" title="Voir les détails">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                    {request.statut === 'En attente' && (
                                                        <button className="action-btn edit" title="Modifier">
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                    )}
                                                    {request.statut === 'En attente' && (
                                                        <button className="action-btn delete" title="Supprimer">
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RemboursementPage; 
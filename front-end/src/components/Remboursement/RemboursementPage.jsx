import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './RemboursementPage.css';
import { billService } from '../../api/services/billService';
import { authService } from '../../api/services/authService';
import BillModal from '../Modal/BillModal';

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

    const [searchParams] = useSearchParams();
    const seminarId = searchParams.get('seminar');

    // État pour afficher le formulaire ou non
    const [showForm, setShowForm] = useState(false);

    // État pour les remboursements récents
    const [recentRequests, setRecentRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);

    // État pour l'indication de soumission réussie
    const [successSubmit, setSuccessSubmit] = useState(false);

    // États pour la modal de détail, le mode édition et les statistiques
    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBillId, setEditingBillId] = useState(null);
    const [stats, setStats] = useState({ totalApprouve: 0, enAttente: 0, nbEnAttente: 0, tauxApprobation: 0, derniereDate: null });

    const loadBills = async () => {
        try {
            const token = authService.getToken();
            if (!token) { setIsLoadingRequests(false); return; }

            const bills = await billService.getAllBills();

            // Calcul des statistiques sur l'ensemble des demandes
            const approved = bills.filter(b => b.status === 'Approved');
            const pending = bills.filter(b => b.status === 'Pending');
            const totalApprouve = approved.reduce((sum, b) => sum + (b.amount || 0), 0);
            const enAttente = pending.reduce((sum, b) => sum + (b.amount || 0), 0);
            const tauxApprobation = bills.length > 0 ? Math.round((approved.length / bills.length) * 100) : 0;
            const sortedByDate = [...bills].sort((a, b) => new Date(b.date) - new Date(a.date));
            const derniereDate = sortedByDate.length > 0 ? new Date(sortedByDate[0].date) : null;
            setStats({ totalApprouve, enAttente, nbEnAttente: pending.length, tauxApprobation, derniereDate });

            // Formatage pour l'affichage, en conservant le bill original pour la modal
            const formatted = sortedByDate.map(bill => ({
                id: bill._id,
                date: new Date(bill.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                type: bill.type || 'Autre',
                montant: bill.amount ? bill.amount.toFixed(2) : '0.00',
                statut: bill.status === 'Approved' ? 'Approuvé' :
                    bill.status === 'Rejected' ? 'Refusé' : 'En attente',
                description: bill.description || 'Aucune description',
                originalData: bill
            }));

            setRecentRequests(formatted.slice(0, 4));
        } catch (error) {
            console.error('Erreur lors du chargement des demandes:', error);
        } finally {
            setIsLoadingRequests(false);
        }
    };

    // Charger les demandes depuis l'API au montage du composant
    useEffect(() => {
        loadBills();
    }, []);

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
        if (!showForm) {
            setFormData({ type: '', date: '', montant: '', justificatif: null, description: '', categorie: '' });
            setSuccessSubmit(false);
        }
        setEditingBillId(null);
    };

    // Fonction pour soumettre le formulaire (création ou modification)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = authService.getToken();
            if (!token) { alert('Vous devez être connecté pour créer une demande'); return; }

            if (editingBillId) {
                // Mode édition : pas de re-upload de fichier
                await billService.updateBill(editingBillId, {
                    type: expenseTypes.find(t => t.id === formData.type)?.label || formData.type,
                    date: formData.date,
                    amount: parseFloat(formData.montant),
                    description: formData.description,
                });
                setEditingBillId(null);
                setShowForm(false);
            } else {
                // Mode création : upload avec justificatif obligatoire
                const apiFormData = new FormData();
                apiFormData.append('proof', formData.justificatif);
                apiFormData.append('metadata', JSON.stringify({
                    date: formData.date,
                    amount: parseFloat(formData.montant),
                    type: expenseTypes.find(type => type.id === formData.type)?.label || formData.type,
                    description: `${formData.description} - Catégorie: ${formData.categorie}`,
                    status: 'Pending',
                    seminar: seminarId || null
                }));
                const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${BASE_URL}/api/bills`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: apiFormData,
                });
                if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            }

            setSuccessSubmit(true);
            setFormData({ type: '', date: '', montant: '', justificatif: null, description: '', categorie: '' });
            setTimeout(() => setSuccessSubmit(false), 5000);
            setIsLoadingRequests(true);
            loadBills();
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            alert('Erreur : ' + error.message);
        }
    };

    const handleView = (request) => {
        setSelectedBill(request.originalData);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirmer la suppression de cette demande ?')) return;
        try {
            await billService.deleteBill(id);
            setIsLoadingRequests(true);
            loadBills();
        } catch (err) {
            alert('Erreur lors de la suppression : ' + err.message);
        }
    };

    const handleEdit = (request) => {
        const bill = request.originalData;
        const typeEntry = expenseTypes.find(t => t.label === bill.type);
        setFormData({
            type: typeEntry ? typeEntry.id : 'other',
            date: bill.date ? bill.date.split('T')[0] : '',
            montant: bill.amount ? bill.amount.toString() : '',
            justificatif: null,
            description: bill.description || '',
            categorie: ''
        });
        setEditingBillId(request.id);
        setShowForm(true);
    };

    // Fonction pour obtenir la classe de statut
    const getStatusClass = (statut) => {
        switch (statut) {
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
                            <h2>{editingBillId ? 'Modifier la demande' : 'Nouvelle demande de remboursement'}</h2>
                            <p>Veuillez remplir tous les champs obligatoires (*)</p>
                        </div>

                        {seminarId && (
                            <div className="success-message" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
                                <i className="fa-solid fa-calendar-days"></i>
                                <span>Note de frais rattachée à un séminaire</span>
                            </div>
                        )}

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
                                        required={!editingBillId}
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
                                <div className="stat-value">{stats.totalApprouve.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                                <div className="stat-footer">Depuis le début</div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-clock"></i>
                                    <span>En attente</span>
                                </div>
                                <div className="stat-value">{stats.enAttente.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                                <div className="stat-footer">{stats.nbEnAttente} demande{stats.nbEnAttente !== 1 ? 's' : ''}</div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span>Taux d'approbation</span>
                                </div>
                                <div className="stat-value">{stats.tauxApprobation}%</div>
                                <div className="stat-footer">Taux d'approbation</div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-title">
                                    <i className="fa-solid fa-file-invoice"></i>
                                    <span>Dernière demande</span>
                                </div>
                                <div className="stat-value">
                                    {stats.derniereDate ? stats.derniereDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                                </div>
                                <div className="stat-footer">Dernière soumission</div>
                            </div>
                        </div>
                    </div>

                    <div className="recent-requests">
                        <div className="section-header">
                            <h2>Demandes récentes</h2>
                            <Link to="/demandes" className="view-all-link">Voir tout <i className="fa-solid fa-arrow-right"></i></Link>
                        </div>

                        <div className="requests-table-container">
                            {isLoadingRequests ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p>Chargement des demandes...</p>
                                </div>
                            ) : recentRequests.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p>Aucune demande récente</p>
                                </div>
                            ) : (
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
                                                        <button className="action-btn view" title="Voir les détails" onClick={() => handleView(request)}>
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                        {request.statut === 'En attente' && (
                                                            <button className="action-btn edit" title="Modifier" onClick={() => handleEdit(request)}>
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                        )}
                                                        {request.statut === 'En attente' && (
                                                            <button className="action-btn delete" title="Supprimer" onClick={() => handleDelete(request.id)}>
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && selectedBill && (
                <BillModal
                    bill={selectedBill}
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedBill(null); }}
                />
            )}
        </div>
    );
};

export default RemboursementPage; 
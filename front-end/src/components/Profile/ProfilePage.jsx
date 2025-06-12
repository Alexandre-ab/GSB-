import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    // État pour les informations de profil
    const [profileData, setProfileData] = useState({
        id: 'USR-4872',
        nom: 'Alexandre',
        prenom: 'Boué',
        email: 'alexandre.boue@gsb.fr',
        telephone: '06 12 34 56 78',
        poste: 'Visiteur médical',
        departement: 'Commercial',
        dateEmbauche: '15/03/2019',
        adresse: '25 rue des Lilas',
        ville: 'Paris',
        codePostal: '75008',
        pays: 'France',
        imageProfil: 'https://randomuser.me/api/portraits/men/40.jpg'
    });

    // État pour le mode édition
    const [editMode, setEditMode] = useState(false);
    
    // État pour les données en cours d'édition
    const [editData, setEditData] = useState({...profileData});
    
    // État pour l'onglet actif
    const [activeTab, setActiveTab] = useState('informations');
    
    // Historique des activités (données fictives)
    const [activities, setActivities] = useState([
        { id: 1, type: 'demande', action: 'Demande de remboursement soumise', montant: '125.50 €', date: '12/06/2023', statut: 'Approuvé' },
        { id: 2, type: 'profil', action: 'Modification du profil', details: 'Email mis à jour', date: '05/06/2023', statut: 'Complété' },
        { id: 3, type: 'demande', action: 'Demande de remboursement soumise', montant: '47.80 €', date: '28/05/2023', statut: 'Refusé' },
        { id: 4, type: 'connexion', action: 'Connexion au système', details: 'Depuis un nouvel appareil', date: '20/05/2023', statut: 'Alerte' },
        { id: 5, type: 'demande', action: 'Demande de remboursement soumise', montant: '87.30 €', date: '15/05/2023', statut: 'Approuvé' }
    ]);
    
    // Paramètres de sécurité
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        notificationsEmail: true,
        notificationsSMS: false,
        sessionTimeout: 30 // minutes
    });

    // Fonction pour basculer en mode édition
    const toggleEditMode = () => {
        if (editMode) {
            // Si on quitte le mode édition, on annule les modifications
            setEditData({...profileData});
        }
        setEditMode(!editMode);
    };
    
    // Fonction pour sauvegarder les modifications
    const saveProfile = () => {
        setProfileData({...editData});
        setEditMode(false);
        
        // Ajouter une entrée d'activité
        const newActivity = {
            id: activities.length + 1,
            type: 'profil',
            action: 'Modification du profil',
            details: 'Informations personnelles mises à jour',
            date: new Date().toLocaleDateString('fr-FR'),
            statut: 'Complété'
        };
        
        setActivities([newActivity, ...activities]);
    };
    
    // Fonction pour gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };
    
    // Fonction pour gérer les changements de paramètres de sécurité
    const handleSecurityChange = (e) => {
        const { name, checked, value, type } = e.target;
        setSecuritySettings({
            ...securitySettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Fonction pour obtenir la classe de statut
    const getStatusClass = (statut) => {
        switch(statut) {
            case 'Approuvé':
                return 'status-badge success';
            case 'Refusé':
                return 'status-badge danger';
            case 'Alerte':
                return 'status-badge warning';
            case 'Complété':
                return 'status-badge info';
            case 'En attente':
            default:
                return 'status-badge pending';
        }
    };
    
    // Fonction pour obtenir l'icône en fonction du type d'activité
    const getActivityIcon = (type) => {
        switch(type) {
            case 'demande':
                return 'fa-solid fa-file-invoice';
            case 'profil':
                return 'fa-solid fa-user-pen';
            case 'connexion':
                return 'fa-solid fa-right-to-bracket';
            default:
                return 'fa-solid fa-circle-info';
        }
    };

    return (
        <div className="profile-container">
            <div className="page-header">
                <h1>Mon Profil</h1>
                <div className="profile-actions">
                    {editMode ? (
                        <>
                            <button className="btn-cancel" onClick={toggleEditMode}>
                                <i className="fa-solid fa-xmark"></i> Annuler
                            </button>
                            <button className="btn-save" onClick={saveProfile}>
                                <i className="fa-solid fa-check"></i> Enregistrer
                            </button>
                        </>
                    ) : (
                        <button className="btn-edit" onClick={toggleEditMode}>
                            <i className="fa-solid fa-pen"></i> Modifier
                        </button>
                    )}
                </div>
            </div>
            
            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <img src={profileData.imageProfil} alt="Photo de profil" />
                            {editMode && (
                                <div className="avatar-overlay">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            <h2>{profileData.prenom} {profileData.nom}</h2>
                            <p className="profile-position">{profileData.poste}</p>
                            <p className="profile-department">{profileData.departement}</p>
                            <p className="profile-id">ID: {profileData.id}</p>
                        </div>
                        <div className="profile-contact-info">
                            <div className="contact-item">
                                <i className="fa-solid fa-envelope"></i>
                                <span>{profileData.email}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fa-solid fa-phone"></i>
                                <span>{profileData.telephone}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>{profileData.ville}, {profileData.pays}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="profile-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'informations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('informations')}
                        >
                            <i className="fa-solid fa-user"></i>
                            <span>Informations personnelles</span>
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'activite' ? 'active' : ''}`}
                            onClick={() => setActiveTab('activite')}
                        >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                            <span>Activité récente</span>
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'securite' ? 'active' : ''}`}
                            onClick={() => setActiveTab('securite')}
                        >
                            <i className="fa-solid fa-shield-halved"></i>
                            <span>Sécurité</span>
                        </button>
                    </div>
                </div>
                
                <div className="profile-details">
                    {activeTab === 'informations' && (
                        <div className="profile-section">
                            <h3>Informations personnelles</h3>
                            <div className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Prénom</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="prenom" 
                                                value={editData.prenom}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.prenom}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Nom</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="nom" 
                                                value={editData.nom}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.nom}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        {editMode ? (
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={editData.email}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.email}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        {editMode ? (
                                            <input 
                                                type="tel" 
                                                name="telephone" 
                                                value={editData.telephone}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.telephone}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Poste</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="poste" 
                                                value={editData.poste}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.poste}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Département</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="departement" 
                                                value={editData.departement}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.departement}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Adresse</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="adresse" 
                                                value={editData.adresse}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.adresse}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Ville</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="ville" 
                                                value={editData.ville}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.ville}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Code postal</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="codePostal" 
                                                value={editData.codePostal}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.codePostal}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pays</label>
                                        {editMode ? (
                                            <input 
                                                type="text" 
                                                name="pays" 
                                                value={editData.pays}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData.pays}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Date d'embauche</label>
                                        <p>{profileData.dateEmbauche}</p>
                                    </div>
                                </div>
                                
                                {editMode && (
                                    <div className="form-footer">
                                        <p className="form-note">
                                            <i className="fa-solid fa-circle-info"></i> 
                                            Certaines informations ne peuvent être modifiées que par un administrateur.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'activite' && (
                        <div className="profile-section">
                            <h3>Activité récente</h3>
                            <div className="activity-list">
                                {activities.map(activity => (
                                    <div className="activity-item" key={activity.id}>
                                        <div className="activity-icon">
                                            <i className={getActivityIcon(activity.type)}></i>
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-header">
                                                <h4>{activity.action}</h4>
                                                <span className={getStatusClass(activity.statut)}>
                                                    {activity.statut}
                                                </span>
                                            </div>
                                            <div className="activity-details">
                                                {activity.montant && <span>{activity.montant}</span>}
                                                {activity.details && <span>{activity.details}</span>}
                                                <span className="activity-date">{activity.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="activity-load-more">
                                    <button className="btn-load-more">
                                        <i className="fa-solid fa-rotate"></i> Charger plus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'securite' && (
                        <div className="profile-section">
                            <h3>Sécurité et préférences</h3>
                            <div className="security-settings">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Mot de passe</h4>
                                        <p>Dernière modification: il y a 2 mois</p>
                                    </div>
                                    <button className="btn-change-password">
                                        <i className="fa-solid fa-key"></i> Modifier
                                    </button>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Authentification à deux facteurs</h4>
                                        <p>Renforce la sécurité de votre compte</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox" 
                                            name="twoFactorAuth" 
                                            checked={securitySettings.twoFactorAuth}
                                            onChange={handleSecurityChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Notifications par email</h4>
                                        <p>Recevoir des notifications par email</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox" 
                                            name="notificationsEmail" 
                                            checked={securitySettings.notificationsEmail}
                                            onChange={handleSecurityChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Notifications par SMS</h4>
                                        <p>Recevoir des notifications par SMS</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox" 
                                            name="notificationsSMS" 
                                            checked={securitySettings.notificationsSMS}
                                            onChange={handleSecurityChange}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Expiration de session</h4>
                                        <p>Délai avant déconnexion automatique</p>
                                    </div>
                                    <select 
                                        name="sessionTimeout" 
                                        value={securitySettings.sessionTimeout}
                                        onChange={handleSecurityChange}
                                    >
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 heure</option>
                                        <option value="120">2 heures</option>
                                    </select>
                                </div>
                                
                                <div className="setting-item devices">
                                    <div className="setting-info">
                                        <h4>Appareils connectés</h4>
                                        <p>Gérer les appareils ayant accès à votre compte</p>
                                    </div>
                                    <button className="btn-manage-devices">
                                        <i className="fa-solid fa-laptop"></i> Gérer
                                    </button>
                                </div>
                                
                                <div className="danger-zone">
                                    <h4>Zone de danger</h4>
                                    <button className="btn-danger">
                                        <i className="fa-solid fa-trash"></i> Supprimer mon compte
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 
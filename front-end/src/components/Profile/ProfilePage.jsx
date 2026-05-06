import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { userService } from '../../api/services/userService';
import { billsAPI } from '../../api/services/billService';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [saveError, setSaveError] = useState('');
    const [activeTab, setActiveTab] = useState('informations');
    const [bills, setBills] = useState([]);
    const [billsLoading, setBillsLoading] = useState(false);

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Security settings (local only)
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        notificationsEmail: true,
        notificationsSMS: false,
        sessionTimeout: 30
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await userService.getCurrentUser();
                setProfileData(user);
                setEditData({ name: user.name, email: user.email });
            } catch (error) {
                console.error('Erreur chargement profil:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (activeTab === 'activite') {
            const loadBills = async () => {
                setBillsLoading(true);
                try {
                    const data = await billsAPI.getAll();
                    setBills(data);
                } catch (error) {
                    console.error('Erreur chargement activités:', error);
                } finally {
                    setBillsLoading(false);
                }
            };
            loadBills();
        }
    }, [activeTab]);

    const toggleEditMode = () => {
        if (editMode) {
            setEditData({ name: profileData.name, email: profileData.email });
            setSaveError('');
        }
        setEditMode(!editMode);
    };

    const saveProfile = async () => {
        try {
            setSaveError('');
            const updated = await userService.updateProfile({ name: editData.name, email: editData.email });
            setProfileData(updated);
            setEditMode(false);
        } catch (error) {
            setSaveError('Erreur lors de la sauvegarde. Veuillez réessayer.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSecurityChange = (e) => {
        const { name, checked, value, type } = e.target;
        setSecuritySettings({
            ...securitySettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        try {
            await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess('Mot de passe mis à jour avec succès.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (error) {
            setPasswordError(error?.response?.data?.message || 'Erreur lors du changement de mot de passe.');
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Approved': return 'status-badge success';
            case 'Rejected': return 'status-badge danger';
            case 'Pending': return 'status-badge pending';
            default: return 'status-badge pending';
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
            <div className="profile-container">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Chargement du profil...</p>
                </div>
            </div>
        );
    }

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
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || 'U')}&background=6366f1&color=fff`} alt="Photo de profil" />
                        </div>
                        <div className="profile-info">
                            <h2>{profileData?.name}</h2>
                            <p className="profile-position">{profileData?.role === 'admin' ? 'Administrateur' : 'Visiteur médical'}</p>
                        </div>
                        <div className="profile-contact-info">
                            <div className="contact-item">
                                <i className="fa-solid fa-envelope"></i>
                                <span>{profileData?.email}</span>
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
                            {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
                            <div className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nom complet</label>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editData.name}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{profileData?.name}</p>
                                        )}
                                    </div>
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
                                            <p>{profileData?.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Rôle</label>
                                        <p>{profileData?.role === 'admin' ? 'Administrateur' : 'Visiteur médical'}</p>
                                    </div>
                                </div>
                                {editMode && (
                                    <div className="form-footer">
                                        <p className="form-note">
                                            <i className="fa-solid fa-circle-info"></i>
                                            Seuls le nom et l'email peuvent être modifiés.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'activite' && (
                        <div className="profile-section">
                            <h3>Activité récente</h3>
                            {billsLoading ? (
                                <div className="loading-container">
                                    <div className="loader"></div>
                                    <p>Chargement...</p>
                                </div>
                            ) : (
                                <div className="activity-list">
                                    {bills.length === 0 && <p>Aucune activité récente.</p>}
                                    {bills.map(bill => (
                                        <div className="activity-item" key={bill._id}>
                                            <div className="activity-icon">
                                                <i className="fa-solid fa-file-invoice"></i>
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-header">
                                                    <h4>Demande de remboursement - {bill.type}</h4>
                                                    <span className={getStatusClass(bill.status)}>
                                                        {getStatusLabel(bill.status)}
                                                    </span>
                                                </div>
                                                <div className="activity-details">
                                                    <span>{bill.amount?.toFixed(2)} €</span>
                                                    {bill.description && <span>{bill.description}</span>}
                                                    <span className="activity-date">
                                                        {new Date(bill.date).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'securite' && (
                        <div className="profile-section">
                            <h3>Sécurité et préférences</h3>
                            <div className="security-settings">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <h4>Mot de passe</h4>
                                        <p>Modifiez votre mot de passe de connexion</p>
                                    </div>
                                    {!showPasswordForm ? (
                                        <button className="btn-change-password" onClick={() => setShowPasswordForm(true)}>
                                            <i className="fa-solid fa-key"></i> Modifier
                                        </button>
                                    ) : (
                                        <form onSubmit={handlePasswordSubmit} style={{ width: '100%', marginTop: '12px' }}>
                                            {passwordError && <p style={{ color: 'red', marginBottom: '8px' }}>{passwordError}</p>}
                                            {passwordSuccess && <p style={{ color: 'green', marginBottom: '8px' }}>{passwordSuccess}</p>}
                                            <div className="form-group">
                                                <label>Mot de passe actuel</label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Nouveau mot de passe</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Confirmer le nouveau mot de passe</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    required
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                <button type="submit" className="btn-save">Mettre à jour</button>
                                                <button type="button" className="btn-cancel" onClick={() => { setShowPasswordForm(false); setPasswordError(''); setPasswordSuccess(''); }}>Annuler</button>
                                            </div>
                                        </form>
                                    )}
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

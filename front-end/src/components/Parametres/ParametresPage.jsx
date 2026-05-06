import React, { useState } from 'react';
import './ParametresPage.css';
import { userService } from '../../api/services/userService';

const ParametresPage = () => {
    // État pour les paramètres d'affichage
    const [displaySettings, setDisplaySettings] = useState({
        darkMode: false,
        fontSize: 'medium',
        language: 'fr',
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        shortcuts: true
    });

    // État pour les paramètres de confidentialité
    const [privacySettings, setPrivacySettings] = useState({
        shareData: true,
        storeHistory: true,
        autoLogout: 30
    });

    // État pour l'onglet actif
    const [activeTab, setActiveTab] = useState('display');

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        try {
            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordSuccess('Mot de passe mis à jour avec succès.');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (error) {
            setPasswordError(error?.response?.data?.message || 'Erreur lors du changement de mot de passe.');
        }
    };

    // Fonction pour changer les paramètres d'affichage
    const handleDisplayChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            // Gestion des propriétés imbriquées (ex: notifications.email)
            const [parent, child] = name.split('.');
            setDisplaySettings({
                ...displaySettings,
                [parent]: {
                    ...displaySettings[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            });
        } else {
            // Gestion des propriétés de premier niveau
            setDisplaySettings({
                ...displaySettings,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    // Fonction pour changer les paramètres de confidentialité
    const handlePrivacyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPrivacySettings({
            ...privacySettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Fonction pour réinitialiser tous les paramètres
    const handleResetSettings = () => {
        if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
            setDisplaySettings({
                darkMode: false,
                fontSize: 'medium',
                language: 'fr',
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                },
                shortcuts: true
            });
            
            setPrivacySettings({
                shareData: true,
                storeHistory: true,
                autoLogout: 30
            });
        }
    };

    // Fonction pour exporter les paramètres
    const handleExportSettings = () => {
        const settings = {
            display: displaySettings,
            privacy: privacySettings
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "gsb-settings.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="parametres-container">
            <div className="page-header">
                <h1>Paramètres</h1>
            </div>
            
            <div className="parametres-content">
                <div className="parametres-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'display' ? 'active' : ''}`}
                        onClick={() => setActiveTab('display')}
                    >
                        <i className="fa-solid fa-display"></i>
                        Affichage
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        <i className="fa-solid fa-lock"></i>
                        Confidentialité
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <i className="fa-solid fa-user-gear"></i>
                        Compte
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <i className="fa-solid fa-bell"></i>
                        Notifications
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'help' ? 'active' : ''}`}
                        onClick={() => setActiveTab('help')}
                    >
                        <i className="fa-solid fa-circle-question"></i>
                        Aide
                    </button>
                </div>
                
                <div className="parametres-panel">
                    {activeTab === 'display' && (
                        <div className="settings-section">
                            <h2>Paramètres d'affichage</h2>
                            <p className="section-description">Personnalisez l'apparence de votre application GSB.</p>
                            
                            <div className="settings-group">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="darkMode">Mode sombre</label>
                                        <p>Activer l'interface en mode sombre</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="darkMode"
                                                name="darkMode"
                                                checked={displaySettings.darkMode}
                                                onChange={handleDisplayChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="fontSize">Taille de police</label>
                                        <p>Ajustez la taille du texte dans l'application</p>
                                    </div>
                                    <div className="setting-control">
                                        <select 
                                            id="fontSize"
                                            name="fontSize"
                                            value={displaySettings.fontSize}
                                            onChange={handleDisplayChange}
                                            className="select-control"
                                        >
                                            <option value="small">Petite</option>
                                            <option value="medium">Moyenne</option>
                                            <option value="large">Grande</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="language">Langue</label>
                                        <p>Définissez la langue de l'interface</p>
                                    </div>
                                    <div className="setting-control">
                                        <select 
                                            id="language"
                                            name="language"
                                            value={displaySettings.language}
                                            onChange={handleDisplayChange}
                                            className="select-control"
                                        >
                                            <option value="fr">Français</option>
                                            <option value="en">English</option>
                                            <option value="es">Español</option>
                                            <option value="de">Deutsch</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="shortcuts">Raccourcis clavier</label>
                                        <p>Activer les raccourcis clavier pour une navigation plus rapide</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="shortcuts"
                                                name="shortcuts"
                                                checked={displaySettings.shortcuts}
                                                onChange={handleDisplayChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'privacy' && (
                        <div className="settings-section">
                            <h2>Paramètres de confidentialité</h2>
                            <p className="section-description">Gérez vos préférences de confidentialité et de sécurité.</p>
                            
                            <div className="settings-group">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="shareData">Partage de données</label>
                                        <p>Autoriser le partage de données anonymisées pour améliorer l'application</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="shareData"
                                                name="shareData"
                                                checked={privacySettings.shareData}
                                                onChange={handlePrivacyChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="storeHistory">Historique d'activité</label>
                                        <p>Conserver l'historique de vos actions dans l'application</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="storeHistory"
                                                name="storeHistory"
                                                checked={privacySettings.storeHistory}
                                                onChange={handlePrivacyChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="autoLogout">Déconnexion automatique</label>
                                        <p>Délai d'inactivité avant déconnexion (en minutes)</p>
                                    </div>
                                    <div className="setting-control">
                                        <select 
                                            id="autoLogout"
                                            name="autoLogout"
                                            value={privacySettings.autoLogout}
                                            onChange={handlePrivacyChange}
                                            className="select-control"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 heure</option>
                                            <option value="120">2 heures</option>
                                            <option value="0">Jamais</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label>Effacer les données de navigation</label>
                                        <p>Supprimer toutes les données stockées localement</p>
                                    </div>
                                    <div className="setting-control">
                                        <button className="action-button warning">
                                            Effacer les données
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h2>Paramètres du compte</h2>
                            <p className="section-description">Gérez les informations de votre compte et la sécurité.</p>
                            
                            <div className="settings-group">
                                <div className="account-info">
                                    <div className="account-avatar">
                                        <img src="https://randomuser.me/api/portraits/men/40.jpg" alt="Avatar" />
                                        <button className="avatar-edit-btn">
                                            <i className="fa-solid fa-camera"></i>
                                        </button>
                                    </div>
                                    <div className="account-details">
                                        <h3>Alexandre Boué</h3>
                                        <p>alexandre.boue@gsb.fr</p>
                                        <p className="account-type">Visiteur médical</p>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label>Email</label>
                                        <p>Modifier votre adresse email</p>
                                    </div>
                                    <div className="setting-control">
                                        <button className="action-button">
                                            Modifier
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label>Mot de passe</label>
                                        <p>Modifiez votre mot de passe de connexion</p>
                                    </div>
                                    <div className="setting-control">
                                        {!showPasswordForm ? (
                                            <button className="action-button" onClick={() => setShowPasswordForm(true)}>
                                                Modifier
                                            </button>
                                        ) : (
                                            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '280px' }}>
                                                {passwordError && <p style={{ color: 'red', margin: 0, fontSize: '14px' }}>{passwordError}</p>}
                                                {passwordSuccess && <p style={{ color: 'green', margin: 0, fontSize: '14px' }}>{passwordSuccess}</p>}
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    placeholder="Ancien mot de passe"
                                                    value={passwordForm.currentPassword}
                                                    onChange={handlePasswordFormChange}
                                                    required
                                                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                                />
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    placeholder="Nouveau mot de passe"
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordFormChange}
                                                    required
                                                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                                />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    placeholder="Confirmation"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordFormChange}
                                                    required
                                                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                                />
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button type="submit" className="action-button primary">Mettre à jour</button>
                                                    <button type="button" className="action-button secondary" onClick={() => { setShowPasswordForm(false); setPasswordError(''); setPasswordSuccess(''); }}>Annuler</button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label>Authentification à deux facteurs</label>
                                        <p>Renforce la sécurité de votre compte</p>
                                    </div>
                                    <div className="setting-control">
                                        <button className="action-button">
                                            Configurer
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="setting-item border-top">
                                    <div className="setting-info danger">
                                        <label>Désactiver le compte</label>
                                        <p>Votre compte sera désactivé temporairement</p>
                                    </div>
                                    <div className="setting-control">
                                        <button className="action-button danger">
                                            Désactiver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2>Paramètres de notifications</h2>
                            <p className="section-description">Gérez comment et quand vous recevez des notifications.</p>
                            
                            <div className="settings-group">
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="notifications.email">Notifications par email</label>
                                        <p>Recevoir des notifications par email</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="notifications.email"
                                                name="notifications.email"
                                                checked={displaySettings.notifications.email}
                                                onChange={handleDisplayChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="notifications.push">Notifications push</label>
                                        <p>Recevoir des notifications dans le navigateur</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="notifications.push"
                                                name="notifications.push"
                                                checked={displaySettings.notifications.push}
                                                onChange={handleDisplayChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <label htmlFor="notifications.sms">Notifications par SMS</label>
                                        <p>Recevoir des notifications par SMS</p>
                                    </div>
                                    <div className="setting-control">
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox"
                                                id="notifications.sms"
                                                name="notifications.sms"
                                                checked={displaySettings.notifications.sms}
                                                onChange={handleDisplayChange}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="notification-types">
                                    <h3>Types de notifications</h3>
                                    <div className="notification-type-item">
                                        <div className="checkbox-container">
                                            <input type="checkbox" id="notif_remboursement" checked />
                                            <label htmlFor="notif_remboursement">Changements de statut des remboursements</label>
                                        </div>
                                    </div>
                                    <div className="notification-type-item">
                                        <div className="checkbox-container">
                                            <input type="checkbox" id="notif_messages" checked />
                                            <label htmlFor="notif_messages">Nouveaux messages</label>
                                        </div>
                                    </div>
                                    <div className="notification-type-item">
                                        <div className="checkbox-container">
                                            <input type="checkbox" id="notif_rappels" checked />
                                            <label htmlFor="notif_rappels">Rappels et échéances</label>
                                        </div>
                                    </div>
                                    <div className="notification-type-item">
                                        <div className="checkbox-container">
                                            <input type="checkbox" id="notif_admin" />
                                            <label htmlFor="notif_admin">Annonces administratives</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'help' && (
                        <div className="settings-section">
                            <h2>Aide et support</h2>
                            <p className="section-description">Obtenez de l'aide pour utiliser l'application GSB.</p>
                            
                            <div className="help-container">
                                <div className="help-card">
                                    <div className="help-icon">
                                        <i className="fa-solid fa-book"></i>
                                    </div>
                                    <div className="help-content">
                                        <h3>Documentation</h3>
                                        <p>Consultez la documentation complète de l'application</p>
                                        <a href="#" className="help-link">Ouvrir la documentation</a>
                                    </div>
                                </div>
                                
                                <div className="help-card">
                                    <div className="help-icon">
                                        <i className="fa-solid fa-video"></i>
                                    </div>
                                    <div className="help-content">
                                        <h3>Tutoriels vidéo</h3>
                                        <p>Apprenez à utiliser toutes les fonctionnalités</p>
                                        <a href="#" className="help-link">Voir les tutoriels</a>
                                    </div>
                                </div>
                                
                                <div className="help-card">
                                    <div className="help-icon">
                                        <i className="fa-solid fa-headset"></i>
                                    </div>
                                    <div className="help-content">
                                        <h3>Support technique</h3>
                                        <p>Contactez notre équipe pour obtenir de l'aide</p>
                                        <a href="#" className="help-link">Contacter le support</a>
                                    </div>
                                </div>
                                
                                <div className="help-card">
                                    <div className="help-icon">
                                        <i className="fa-solid fa-circle-question"></i>
                                    </div>
                                    <div className="help-content">
                                        <h3>FAQ</h3>
                                        <p>Consultez les questions fréquemment posées</p>
                                        <a href="#" className="help-link">Voir la FAQ</a>
                                    </div>
                                </div>
                                
                                <div className="help-contact">
                                    <h3>Nous contacter</h3>
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <i className="fa-solid fa-envelope"></i>
                                            <span>support@gsb.fr</span>
                                        </div>
                                        <div className="contact-item">
                                            <i className="fa-solid fa-phone"></i>
                                            <span>01 23 45 67 89</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="app-info">
                                    <h3>À propos de l'application</h3>
                                    <p>Version: 1.2.3</p>
                                    <p>Dernière mise à jour: 15 juin 2023</p>
                                    <div className="app-links">
                                        <a href="#">Conditions d'utilisation</a>
                                        <a href="#">Politique de confidentialité</a>
                                        <a href="#">Mentions légales</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="settings-actions">
                <button className="action-button secondary" onClick={handleResetSettings}>
                    <i className="fa-solid fa-rotate"></i>
                    Réinitialiser les paramètres
                </button>
                <button className="action-button primary" onClick={handleExportSettings}>
                    <i className="fa-solid fa-download"></i>
                    Exporter les paramètres
                </button>
            </div>
        </div>
    );
};

export default ParametresPage; 
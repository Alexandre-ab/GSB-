import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './MainLayout.css';
import { userService } from '../../api/services/userService';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const [user, setUser] = useState(null);

    // Charger les informations de l'utilisateur
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await userService.getCurrentUser();
                console.log('👤 Données utilisateur récupérées:', userData);
                console.log('🔐 Rôle de l\'utilisateur:', userData?.role);
                setUser(userData);
            } catch (error) {
                console.error('Erreur lors du chargement du profil:', error);
            }
        };
        loadUser();
    }, []);

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="app-layout">
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-header">
                        <h1 className="app-title">GSB</h1>
                    </div>
                    <div className="profile">
                        <img src="https://randomuser.me/api/portraits/men/40.jpg" alt="Profile" className="profile-img" />
                        <span className="profile-name">
                            {user ? user.name : 'Chargement...'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="app-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <nav className="nav-menu">
                        <ul>
                            <li className={currentPath === '/dashboard' ? 'active' : ''}>
                                <Link to="/dashboard" className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}>
                                    <i className="fa-solid fa-chart-line"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li className={currentPath === '/remboursement' ? 'active' : ''}>
                                <Link to="/remboursement" className={`nav-link ${currentPath === '/remboursement' ? 'active' : ''}`}>
                                    <i className="fa-solid fa-credit-card"></i>
                                    <span>Remboursement</span>
                                </Link>
                            </li>
                            <li className={currentPath === '/demandes' ? 'active' : ''}>
                                <Link to="/demandes" className={`nav-link ${currentPath === '/demandes' ? 'active' : ''}`}>
                                    <i className="fa-solid fa-file-invoice"></i>
                                    <span>Demandes</span>
                                </Link>
                            </li>
                            <li className={currentPath === '/profil' ? 'active' : ''}>
                                <Link to="/profil" className={`nav-link ${currentPath === '/profil' ? 'active' : ''}`}>
                                    <i className="fa-solid fa-user"></i>
                                    <span>Mon Profil</span>
                                </Link>
                            </li>
                            <li className={currentPath === '/parametres' ? 'active' : ''}>
                                <Link to="/parametres" className={`nav-link ${currentPath === '/parametres' ? 'active' : ''}`}>
                                    <i className="fa-solid fa-gear"></i>
                                    <span>Paramètres</span>
                                </Link>
                            </li>
                            {user && user.role === 'admin' && (
                                <li className={currentPath === '/admin' ? 'active' : ''}>
                                    <Link to="/admin" className={`nav-link ${currentPath === '/admin' ? 'active' : ''}`}>
                                        <i className="fa-solid fa-shield-halved"></i>
                                        <span>Admin</span>
                                    </Link>
                                </li>
                            )}
                            <li className="logout-item">
                                <button onClick={handleLogout} className="nav-link logout-btn">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    <span>Déconnexion</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main content area */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout; 
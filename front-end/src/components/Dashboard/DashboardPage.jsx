import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { statsService } from '../../api/services/statsService';

const DashboardPage = () => {
    // État pour le chargement des données
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Données pour les statistiques
    const [stats, setStats] = useState({
        demandesTotal: 0,
        demandesEnAttente: 0,
        demandesApprouvees: 0,
        demandesRefusees: 0,
        montantTotal: 0,
        montantRembourse: 0
    });
    
    // Données pour les graphiques
    const [chartData, setChartData] = useState({
        monthly: [],
        types: []
    });
    
    // Données pour les dernières demandes
    const [latestRequests, setLatestRequests] = useState([]);
    
    // Données pour les notifications (garder en local pour l'instant)
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Bienvenue dans votre espace GSB", time: "Maintenant", type: "info" },
        { id: 2, message: "N'oubliez pas de soumettre vos notes de frais", time: "Il y a 2 jours", type: "info" }
    ]);
    
    // Charger les données réelles depuis l'API
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Vérifier que l'utilisateur est connecté
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Vous devez être connecté pour voir ces données');
                    setIsLoading(false);
                    return;
                }

                // Charger les statistiques, graphiques et dernières demandes en parallèle
                const [statsData, chartDataResult, latestRequestsData] = await Promise.all([
                    statsService.getStats(),
                    statsService.getChartData(),
                    statsService.getLatestRequests(5)
                ]);
                
                setStats(statsData);
                setChartData(chartDataResult);
                setLatestRequests(latestRequestsData);
                
            } catch (error) {
                console.error('Erreur lors du chargement des données du dashboard:', error);
                setError('Erreur lors du chargement des données. Vérifiez votre connexion.');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadDashboardData();
    }, []);
    
    // Fonction pour générer la classe de statut
    const getStatusClass = (statut) => {
        switch(statut) {
            case 'Approuvé':
                return 'status-badge success';
            case 'Refusé':
                return 'status-badge danger';
            case 'En attente':
            default:
                return 'status-badge warning';
        }
    };
    
    // Fonction pour générer la classe de notification
    const getNotificationClass = (type) => {
        switch(type) {
            case 'success':
                return 'notification-item success';
            case 'warning':
                return 'notification-item warning';
            case 'info':
            default:
                return 'notification-item info';
        }
    };
    
    // Fonction pour formater les montants en euros
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
    };
    
    // Calcul du pourcentage d'approbation
    const approvalRate = stats.demandesTotal > 0 
        ? Math.round((stats.demandesApprouvees / stats.demandesTotal) * 100) 
        : 0;
    
    return (
        <div className="dashboard-container">
            {isLoading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Chargement du tableau de bord...</p>
                </div>
            ) : (
                <>
                    {/* En-tête de la page */}
                    <div className="page-header">
                        <h1>Tableau de bord</h1>
                        <div className="period-selector">
                            <span className="period-label">Période :</span>
                            <select className="period-dropdown">
                                <option value="month">Ce mois-ci</option>
                                <option value="quarter">Ce trimestre</option>
                                <option value="year">Cette année</option>
                                <option value="all">Tout</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Statistiques */}
                    <div className="stats-cards">
                        <div className="stat-card total">
                            <div className="stat-icon">
                                <i className="fa-solid fa-file-invoice"></i>
                            </div>
                            <div className="stat-content">
                                <span className="stat-title">Total des demandes</span>
                                <span className="stat-value">{stats.demandesTotal}</span>
                                <span className="stat-description">Ce mois-ci</span>
                            </div>
                        </div>
                        
                        <div className="stat-card pending">
                            <div className="stat-icon">
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div className="stat-content">
                                <span className="stat-title">En attente</span>
                                <span className="stat-value">{stats.demandesEnAttente}</span>
                                <span className="stat-description">À traiter</span>
                            </div>
                        </div>
                        
                        <div className="stat-card approved">
                            <div className="stat-icon">
                                <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <div className="stat-content">
                                <span className="stat-title">Approuvées</span>
                                <span className="stat-value">{stats.demandesApprouvees}</span>
                                <span className="stat-description">{`${approvalRate}% d'approbation`}</span>
                            </div>
                        </div>
                        
                        <div className="stat-card amount">
                            <div className="stat-icon">
                                <i className="fa-solid fa-euro-sign"></i>
                            </div>
                            <div className="stat-content">
                                <span className="stat-title">Montant total</span>
                                <span className="stat-value">{formatMontant(stats.montantTotal)}</span>
                                <span className="stat-description">{`${formatMontant(stats.montantRembourse)} remboursés`}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Graphiques et tableaux */}
                    <div className="charts-tables-container">
                        {/* Graphique des dépenses mensuelles */}
                        <div className="widget chart-widget">
                            <div className="widget-header">
                                <h2>Dépenses mensuelles</h2>
                                <div className="widget-actions">
                                    <button className="widget-action-btn">
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                                    <button className="widget-action-btn">
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="bar-chart">
                                    {chartData.monthly.map((item, index) => (
                                        <div className="chart-bar-container" key={index}>
                                            <div 
                                                className="chart-bar" 
                                                style={{ 
                                                    height: `${(item.amount / 800) * 100}%`,
                                                    backgroundColor: `var(--primary)`
                                                }}
                                            ></div>
                                            <span className="chart-label">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-color" style={{ backgroundColor: 'var(--primary)' }}></div>
                                        <span className="legend-label">Dépenses mensuelles (en €)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Répartition par type */}
                        <div className="widget donut-widget">
                            <div className="widget-header">
                                <h2>Répartition par type</h2>
                                <div className="widget-actions">
                                    <button className="widget-action-btn">
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                                    <button className="widget-action-btn">
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="donut-container">
                                <div className="donut-chart">
                                    <div className="donut-center">
                                        <span className="donut-number">{stats.demandesTotal}</span>
                                        <span className="donut-label">Total</span>
                                    </div>
                                    {/* Les segments du donut sont stylisés en CSS */}
                                </div>
                                <div className="chart-legend donut-legend">
                                    {chartData.types.map((item, index) => (
                                        <div className="legend-item" key={index}>
                                            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                                            <span className="legend-label">{item.type}</span>
                                            <span className="legend-value">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Dernières demandes */}
                        <div className="widget latest-requests-widget">
                            <div className="widget-header">
                                <h2>Dernières demandes</h2>
                                <a href="/demandes" className="view-all-link">Voir tout</a>
                            </div>
                            <div className="request-list">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Montant</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestRequests.map((request, index) => (
                                            <tr key={index}>
                                                <td>{request._id}</td>
                                                <td>{request.date}</td>
                                                <td>{request.type}</td>
                                                <td>{request.amount} €</td>
                                                <td>
                                                    <span className={getStatusClass(request.status)}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Notifications */}
                        <div className="widget notifications-widget">
                            <div className="widget-header">
                                <h2>Notifications</h2>
                                <button className="mark-read-btn">Tout marquer comme lu</button>
                            </div>
                            <div className="notification-list">
                                {notifications.map((notification, index) => (
                                    <div key={index} className={getNotificationClass(notification.type)}>
                                        <div className="notification-dot"></div>
                                        <div className="notification-content">
                                            <p className="notification-message">{notification.message}</p>
                                            <span className="notification-time">{notification.time}</span>
                                        </div>
                                        <button className="notification-action">
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage; 
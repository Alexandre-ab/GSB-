import api from '../config';

/**
 * Service pour gérer les statistiques du dashboard
 */
export const statsService = {
    /**
     * Récupère les statistiques générales
     * @returns {Promise<Object>} - Statistiques du dashboard
     */
    getStats: async () => {
        try {
            // Pour l'instant, calculer depuis les bills existantes
            // Plus tard, vous pourrez créer un endpoint dédié
            const bills = await api.get('/bills');
            
            const stats = {
                demandesTotal: bills.length,
                demandesEnAttente: bills.filter(bill => bill.status === 'Pending').length,
                demandesApprouvees: bills.filter(bill => bill.status === 'Approved').length,
                demandesRefusees: bills.filter(bill => bill.status === 'Rejected').length,
                montantTotal: bills.reduce((sum, bill) => sum + (bill.amount || 0), 0),
                montantRembourse: bills
                    .filter(bill => bill.status === 'Approved')
                    .reduce((sum, bill) => sum + (bill.amount || 0), 0)
            };
            
            return stats;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    /**
     * Récupère les données pour les graphiques
     * @returns {Promise<Object>} - Données des graphiques
     */
    getChartData: async () => {
        try {
            const bills = await api.get('/bills');
            
            // Calculer les données mensuelles (6 derniers mois)
            const monthlyData = [];
            const today = new Date();
            for (let i = 5; i >= 0; i--) {
                const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthName = month.toLocaleDateString('fr-FR', { month: 'short' });
                const monthYear = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
                
                const monthlyAmount = bills
                    .filter(bill => {
                        const billDate = new Date(bill.date || bill.createdAt);
                        const billMonth = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`;
                        return billMonth === monthYear;
                    })
                    .reduce((sum, bill) => sum + (bill.amount || 0), 0);
                
                monthlyData.push({ month: monthName, amount: monthlyAmount });
            }
            
            // Calculer la répartition par type
            const typeCount = {};
            bills.forEach(bill => {
                const type = bill.type || 'Note de frais';
                typeCount[type] = (typeCount[type] || 0) + 1;
            });
            
            const colors = ['#6366f1', '#f97316', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
            const typesData = Object.entries(typeCount).map(([type, count], index) => ({
                type,
                count,
                color: colors[index % colors.length]
            }));
            
            return {
                monthly: monthlyData,
                types: typesData
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des données de graphique:', error);
            throw error;
        }
    },

    /**
     * Récupère les dernières demandes
     * @param {number} limit - Nombre de demandes à récupérer
     * @returns {Promise<Array>} - Liste des dernières demandes
     */
    getLatestRequests: async (limit = 5) => {
        try {
            const bills = await api.get('/bills');
            
            return bills
                .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                .slice(0, limit)
                .map(bill => ({
                    id: bill._id,
                    date: new Date(bill.date || bill.createdAt).toLocaleDateString('fr-FR'),
                    type: bill.type || 'Note de frais',
                    montant: (bill.amount || 0).toFixed(2),
                    statut: bill.status === 'Approved' ? 'Approuvé' : 
                           bill.status === 'Rejected' ? 'Refusé' : 'En attente'
                }));
        } catch (error) {
            console.error('Erreur lors de la récupération des dernières demandes:', error);
            throw error;
        }
    }
};

export default statsService; 
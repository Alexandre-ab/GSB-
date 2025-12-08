import api from '../config';

/**
 * Service pour gérer les factures et demandes de remboursement
 */
export const billService = {
    /**
     * Récupère toutes les factures
     * @returns {Promise<Array>} - Liste des factures
     */
    getAllBills: async () => {
        try {
            return await api.get('/api/bills');
        } catch (error) {
            console.error('Erreur lors de la récupération des factures:', error);
            throw error;
        }
    },

    /**
     * Récupère une facture par son ID
     * @param {string} id - ID de la facture
     * @returns {Promise<Object>} - Données de la facture
     */
    getBillById: async (id) => {
        try {
            return await api.get(`/api/bills/${id}`);
        } catch (error) {
            console.error(`Erreur lors de la récupération de la facture ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crée une nouvelle facture
     * @param {Object} billData - Données de la facture
     * @returns {Promise<Object>} - Facture créée
     */
    createBill: async (billData) => {
        try {
            return await api.post('/api/bills', billData);
        } catch (error) {
            console.error('Erreur lors de la création de la facture:', error);
            throw error;
        }
    },

    /**
     * Met à jour une facture existante
     * @param {string} id - ID de la facture
     * @param {Object} billData - Nouvelles données de la facture
     * @returns {Promise<Object>} - Facture mise à jour
     */
    updateBill: async (id, billData) => {
        try {
            return await api.put(`/api/bills/${id}`, billData);
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la facture ${id}:`, error);
            throw error;
        }
    },

    /**
     * Supprime une facture
     * @param {string} id - ID de la facture
     * @returns {Promise<void>}
     */
    deleteBill: async (id) => {
        try {
            return await api.delete(`/api/bills/${id}`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la facture ${id}:`, error);
            throw error;
        }
    }
};

// Alias pour compatibilité avec l'ancien code
export const billsAPI = {
    getAll: billService.getAllBills,
    getById: billService.getBillById,
    create: billService.createBill,
    update: billService.updateBill,
    delete: billService.deleteBill
};

export default billService; 
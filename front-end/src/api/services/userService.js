import api from '../config';

/**
 * Service pour gérer les utilisateurs
 */
export const userService = {
    /**
     * Récupère l'utilisateur actuel
     * @returns {Promise<Object>} - Données de l'utilisateur
     */
    getCurrentUser: async () => {
        try {
            return await api.get('/api/users/me');
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Récupère tous les utilisateurs (admin)
     * @returns {Promise<Array>} - Liste des utilisateurs
     */
    getAllUsers: async () => {
        try {
            return await api.get('/api/users');
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw error;
        }
    },

    /**
     * Crée un nouvel utilisateur (admin)
     * @param {Object} userData - Données de l'utilisateur (name, email, password, role)
     * @returns {Promise<Object>} - Utilisateur créé
     */
    createUser: async (userData) => {
        try {
            return await api.post('/api/users', userData);
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Met à jour un utilisateur par ID (admin)
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} userData - Nouvelles données (name, role)
     * @returns {Promise<Object>} - Utilisateur mis à jour
     */
    updateUser: async (userId, userData) => {
        try {
            return await api.put(`/api/users/${userId}`, userData);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Supprime un utilisateur par ID (admin)
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} - Confirmation de suppression
     */
    deleteUser: async (userId) => {
        try {
            return await api.delete(`/api/users/${userId}`);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Met à jour le profil de l'utilisateur
     * @param {Object} userData - Nouvelles données de l'utilisateur
     * @returns {Promise<Object>} - Utilisateur mis à jour
     */
    updateProfile: async (userData) => {
        try {
            return await api.put('/api/users/me', userData);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw error;
        }
    },

    /**
     * Change le mot de passe de l'utilisateur
     * @param {Object} passwordData - Ancien et nouveau mot de passe
     * @returns {Promise<Object>} - Réponse de l'API
     */
    changePassword: async (passwordData) => {
        try {
            return await api.put('/api/users/me/password', passwordData);
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            throw error;
        }
    }
};

export default userService; 
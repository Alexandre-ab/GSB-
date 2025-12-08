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
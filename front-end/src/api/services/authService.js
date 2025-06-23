import api from '../config';
/**
 * Service pour gérer l'authentification
 */
export const authService = {
    /**
     * Connecte un utilisateur
     * @param {Object} credentials - Les identifiants (email, password)
     * @returns {Promise<Object>} - Les données de l'utilisateur et le token
     */
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            return response;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    },

    /**
     * Déconnecte l'utilisateur actuel
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    /**
     * Vérifie si l'utilisateur est connecté
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Récupère l'utilisateur connecté
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService; 
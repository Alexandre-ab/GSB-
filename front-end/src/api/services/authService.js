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
            const response = await api.post('/api/auth/login', credentials);
            if (response.token) {
                // Uniformisation: toujours utiliser 'token' comme clé
                localStorage.setItem('token', response.token);
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Vérifie si l'utilisateur est connecté
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Récupère l'utilisateur connecté
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Vérifie si l'utilisateur actuel est admin
     * @returns {boolean}
     */
    isAdmin: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            // Décoder le JWT pour extraire le rôle
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role === 'admin';
        } catch (error) {
            return false;
        }
    }
};

export default authService; 
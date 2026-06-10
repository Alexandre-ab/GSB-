import api from '../config';
/**
 * Service pour gérer l'authentification
 */

const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export const authService = {
    /**
     * Connecte un utilisateur
     * @param {Object} credentials - Les identifiants (email, password)
     * @param {boolean} remember - Si true, stocke dans localStorage, sinon sessionStorage
     * @returns {Promise<Object>} - Les données de l'utilisateur et le token
     */
    login: async (credentials, remember = false) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            if (response.token) {
                if (remember) {
                    // Stockage persistant (localStorage)
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                } else {
                    // Stockage temporaire (sessionStorage)
                    sessionStorage.setItem('authToken', response.token);
                    sessionStorage.setItem('user', JSON.stringify(response.user));
                }
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
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
    },

    /**
     * Vérifie si l'utilisateur est connecté
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!getToken();
    },

    /**
     * Récupère le token
     * @returns {string|null}
     */
    getToken,

    /**
     * Récupère l'utilisateur connecté
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Vérifie si l'utilisateur actuel est admin
     * @returns {boolean}
     */
    isAdmin: () => {
        const token = getToken();
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

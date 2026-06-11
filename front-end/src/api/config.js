// Configuration API avec Fetch natif
// En développement : http://localhost:5000
// En production : variable d'environnement VITE_API_URL (définie sur Vercel)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fonction utilitaire pour gérer les requêtes
async function apiFetch(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    // Configuration par défaut
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Ajouter le token d'authentification s'il existe (localStorage ou sessionStorage)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Fusion des options
    const fetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, fetchOptions);

        // Gestion des erreurs HTTP
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
        }

        // Parse JSON si la réponse contient du contenu
        if (response.status !== 204) {
            return await response.json();
        }

        return null;
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// Méthodes HTTP exportées
const api = {
    get: (endpoint) => apiFetch(endpoint),

    post: (endpoint, data) => apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    put: (endpoint, data) => apiFetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    delete: (endpoint) => apiFetch(endpoint, {
        method: 'DELETE'
    })
};

export default api; 
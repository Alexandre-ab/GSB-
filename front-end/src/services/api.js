const API_BASE_URL = 'mongodb+srv://admin:admin@gsb.ycvdfkc.mongodb.net/?retryWrites=true&w=majority&appName=GSB';

// Fonction utilitaire pour récupérer le token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Fonction utilitaire pour les headers
const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// Service API pour les demandes/bills
export const billsAPI = {
    // Récupérer toutes les bills
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/bills`, {
            method: 'GET',
            headers: getHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return response.json();
    },

    // Créer une nouvelle bill
    create: async (formData) => {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }

        const response = await fetch(`${API_BASE_URL}/bills`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Ne pas mettre Content-Type pour FormData, le navigateur le fait automatiquement
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return response.json();
    },

    // Mettre à jour une bill
    update: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return response.json();
    },

    // Supprimer une bill
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return response.json();
    }
};

// Service API pour l'authentification
export const authAPI = {
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Sauvegarder le token
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!getAuthToken();
    }
};

// Service API pour les utilisateurs
export const usersAPI = {
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return response.json();
    }
};

// Test de connexion API
export const testAPI = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/test`);
        const data = await response.json();
        console.log('Test API réussi:', data);
        return data;
    } catch (error) {
        console.error('Test API échoué:', error);
        throw error;
    }
}; 
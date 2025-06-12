// Point d'entrée pour tous les services API
import api from './config';
import authService from './services/authService';
import billService from './services/billService';
import userService from './services/userService';

// Exporte l'objet de configuration API et tous les services
export {
    api,
    authService,
    billService,
    userService
};

// Exporte un objet consolidé
const apiServices = {
    api,
    auth: authService,
    bills: billService,
    users: userService
};

export default apiServices; 
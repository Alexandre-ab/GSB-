import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (success === 'true' && token) {
      // Stocker le token dans le localStorage
      localStorage.setItem('token', token);
      
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } else if (error) {
      // En cas d'erreur, rediriger vers la page de login avec un message d'erreur
      console.error('Erreur d\'authentification:', error);
      navigate('/login?error=' + encodeURIComponent(error));
    } else {
      // Cas par défaut, rediriger vers login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="auth-callback">
      <div className="loading">
        <h2>Authentification en cours...</h2>
        <p>Veuillez patienter pendant que nous finalisons votre connexion.</p>
      </div>
    </div>
  );
};

export default AuthCallback; 
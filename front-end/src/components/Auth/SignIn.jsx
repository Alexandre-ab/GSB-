import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/config';
import logo from '../../assets/logo.png';
import './LoginPage.css';

const SignIn = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState('user'); // Rôle par défaut
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation des données
        if (!name || !email || !password) {
            setError('Tous les champs sont requis');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            setIsLoading(false);
            return;
        }

        try {
            // Appel API pour créer l'utilisateur
            const response = await api.post('/api/users', {
                name,
                email,
                password,
                role
            });

            console.log('Inscription réussie:', response);
            alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            // L'erreur contient déjà le message du serveur
            setError(error.message || 'Erreur lors de la création du compte');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <img src={logo} alt="Logo GSB" />
                </div>
                
                <div className="login-message">
                    <h2>Create an account</h2>
                    <p>Le meilleur gestionnaire de note de frais</p>
                </div>
                
                <div className="login-options">
                    <button className="tab active">Sign up</button>
                    <button className="tab" onClick={() => navigate('/login')}>Log in</button>
                </div>
                
                {error && <div className="error-message" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Enter your name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Create a password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="password-requirements">
                        <div className="requirement">
                            <span className="circle"></span>
                            <p>Must be at least 8 characters</p>
                        </div>
                        <div className="requirement">
                            <span className="circle"></span>
                            <p>Must contain one special character</p>
                        </div>
                    </div>
                    
                    <button type="submit" className="sign-in-btn" disabled={isLoading}>
                        {isLoading ? 'Création du compte...' : 'Get started'}
                    </button>
                    
                    <div className="social-login">
                        <button type="button" className="google-btn">
                            <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                            </svg>
                            Sign up with Google
                        </button>
                        
                        <button type="button" className="microsoft-btn">
                            <svg className="microsoft-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <rect width="10" height="10" x="10" y="10" fill="#FF5722"/>
                                <rect width="10" height="10" x="28" y="10" fill="#4CAF50"/>
                                <rect width="10" height="10" x="10" y="28" fill="#03A9F4"/>
                                <rect width="10" height="10" x="28" y="28" fill="#FFC107"/>
                            </svg>
                            Sign up with Microsoft
                        </button>
                    </div>
                    
                    <div className="footer-link">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;

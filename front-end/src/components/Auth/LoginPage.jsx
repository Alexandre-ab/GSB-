import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import './LoginPage.css';
import logo from '../../assets/logo.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // Appel au service d'authentification
            const response = await authService.login({ email, password });
            console.log('Connexion réussie:', response);
            
            // Redirection vers le dashboard après connexion réussie
            navigate('/dashboard');
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setError('Email ou mot de passe incorrect');
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
                    <h2>Welcome back</h2>
                    <p>Connectez-vous pour accéder à GSB</p>
                </div>
                
                <div className="login-options">
                    <button className="tab" onClick={() => navigate('/signup')}>Sign up</button>
                    <button className="tab active">Log in</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
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
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-options">
                        <div className="remember-me">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                disabled={isLoading}
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Mot de passe oublié?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="sign-in-btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                    
                    <div className="social-login">
                        <button type="button" className="google-btn" disabled={isLoading}>
                            <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                            </svg>
                            Se connecter avec Google
                        </button>
                        
                        <button type="button" className="microsoft-btn" disabled={isLoading}>
                            <svg className="microsoft-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <rect width="10" height="10" x="10" y="10" fill="#FF5722"/>
                                <rect width="10" height="10" x="28" y="10" fill="#4CAF50"/>
                                <rect width="10" height="10" x="10" y="28" fill="#03A9F4"/>
                                <rect width="10" height="10" x="28" y="28" fill="#FFC107"/>
                            </svg>
                            Se connecter avec Microsoft
                        </button>
                    </div>
                    
                    <div className="footer-link">
                        <p>Vous n'avez pas de compte? <Link to="/signup">S'inscrire</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
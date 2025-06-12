import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import LoginPage from './components/Auth/LoginPage';
import DemandesPage from './components/Demandes/DemandesPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import ProfilePage from './components/Profile/ProfilePage';
import RemboursementPage from './components/Remboursement/RemboursementPage';
import ParametresPage from './components/Parametres/ParametresPage';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

// Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes d'authentification (sans layout) */}
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Routes principales de l'application (avec MainLayout) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/remboursement" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <RemboursementPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/demandes" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DemandesPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profil" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/parametres" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ParametresPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={
          <div style={{ padding: "50px", textAlign: "center" }}>
            <h1>404 - Page non trouvée</h1>
            <p>La page que vous recherchez n'existe pas.</p>
            <Link to="/dashboard" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "bold" }}>
              Retour au Dashboard
            </Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

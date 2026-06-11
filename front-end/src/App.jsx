import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import LoginPage from './components/Auth/LoginPage';
import AuthCallback from './components/Auth/AuthCallback';
import DemandesPage from './components/Demandes/DemandesPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import ProfilePage from './components/Profile/ProfilePage';
import RemboursementPage from './components/Remboursement/RemboursementPage';
import ParametresPage from './components/Parametres/ParametresPage';
import AdminPage from './components/Admin/AdminPage';
import SeminairePage from './components/Seminaires/SeminairePage';
import SeminaireDetail from './components/Seminaires/SeminaireDetail';
import MainLayout from './components/Layout/MainLayout';
import { authService } from './api/services/authService';
import './App.css';

// Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null || sessionStorage.getItem('authToken') !== null;
};

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Composant pour protéger les routes admin
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (!authService.isAdmin()) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// Composant interne qui a accès au contexte Router (pour useNavigate)
const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ne déclencher que si l'utilisateur est authentifié
      if (!isAuthenticated()) return;

      // Ignorer si on est dans un champ de saisie
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            navigate('/remboursement');
            break;
          case 'f': {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="text"], input[placeholder*="echerc"]');
            if (searchInput) searchInput.focus();
            break;
          }
          case 'p':
            e.preventDefault();
            navigate('/profil');
            break;
          case 'q':
            e.preventDefault();
            authService.logout();
            navigate('/login');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Routes>
      {/* Routes d'authentification (sans layout) */}
      <Route path="/signup" element={<SignIn />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

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
        path="/seminaires"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SeminairePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seminaires/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SeminaireDetail />
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
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <MainLayout>
              <AdminPage />
            </MainLayout>
          </AdminRoute>
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
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

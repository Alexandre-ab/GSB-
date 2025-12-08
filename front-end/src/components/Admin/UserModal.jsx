import React, { useState, useEffect } from 'react';
import './UserModal.css';

const UserModal = ({ isOpen, mode, user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (mode === 'edit' && user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'user'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user'
            });
        }
        setErrors({});
    }, [mode, user, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (mode === 'add') {
            if (!formData.email.trim()) {
                newErrors.email = 'L\'email est requis';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Email invalide';
            }

            if (!formData.password) {
                newErrors.password = 'Le mot de passe est requis';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            setErrors({ submit: error.message || 'Une erreur est survenue' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="user-modal-overlay" onClick={onClose}>
            <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="user-modal-header">
                    <h2>{mode === 'add' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}</h2>
                    <button className="user-modal-close" onClick={onClose}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="user-modal-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            Nom complet <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="Jean Dupont"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="jean.dupont@gsb.fr"
                            disabled={mode === 'edit'}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {mode === 'add' && (
                        <div className="form-group">
                            <label htmlFor="password">
                                Mot de passe <span className="required">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="Minimum 6 caractères"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="role">
                            Rôle <span className="required">*</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={errors.role ? 'error' : ''}
                        >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Administrateur</option>
                        </select>
                        {errors.role && <span className="error-message">{errors.role}</span>}
                    </div>

                    {errors.submit && (
                        <div className="error-message submit-error">
                            <i className="fa-solid fa-exclamation-circle"></i> {errors.submit}
                        </div>
                    )}

                    <div className="user-modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i> En cours...
                                </>
                            ) : (
                                mode === 'add' ? 'Ajouter' : 'Enregistrer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;


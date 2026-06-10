import { useState, useEffect, useRef } from 'react';


export default function AddBillModal({ isOpen, onClose, onSave, initialData = null }) {
  const [data, setData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    amount: '',
    status: 'Pending',
    description: '',
    proof: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Reset form data when the modal opens or closes
  useEffect(() => {
    if (isOpen && initialData) {
      // Pre-fill form with initial data for editing
      setData({
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: initialData.type || '',
        amount: initialData.amount || '',
        status: initialData.status || 'Pending',
        description: initialData.description || '',
        proof: null
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setData({
        date: new Date().toISOString().split('T')[0],
        type: '',
        amount: '',
        status: 'Pending',
        description: '',
        proof: null
      });
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      setData({
        ...data,
        proof: e.target.files[0] || null
      });
    } else {
      setData({
        ...data,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    try {
      // Vérifier si un token d'authentification existe
      const token = localStorage.getItem('authtoken');

      if (!token) {
        alert('Vous devez être connecté pour créer une demande');
        setIsSubmitting(false);
        return;
      }

      // Vérifier que le fichier justificatif est présent
      if (!data.proof) {
        alert('Veuillez ajouter un justificatif (image ou PDF)');
        setIsSubmitting(false);
        return;
      }

      // Créer le FormData avec les bonnes données
      const formData = new FormData();
      formData.append('proof', data.proof);  // Le fichier justificatif
      formData.append('metadata', JSON.stringify({
        date: data.date,
        amount: data.amount,
        type: data.type,
        description: data.description,
        status: data.status
      }));

      const response = await fetch('https://gsb-2.onrender.com/api/bills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const billData = await response.json();

      onSave(billData);
      onClose();
      alert('Demande ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      alert('Erreur lors de la création de la demande: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setData({
        ...data,
        proof: e.dataTransfer.files[0]
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop Corporate */}
        <div
          className="fixed inset-0 bg-slate-900/40 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal positioning */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        {/* Modal content Corporate */}
        <div
          ref={modalRef}
          className="inline-block transform overflow-hidden rounded bg-white text-left align-bottom shadow-sm border border-slate-200 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle z-[101] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-5">
              <div className="sm:flex sm:items-start">
                <div className="mt-0 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-1">
                    {initialData ? 'Modifier la note de frais' : 'Nouvelle note de frais'}
                  </h3>
                  <p className="text-sm text-slate-500 mb-5">Complétez les informations ci-dessous</p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={data.date}
                          onChange={handleChange}
                          required
                          className="block w-full rounded border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Montant (€)
                        </label>
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          value={data.amount}
                          onChange={handleChange}
                          required
                          className="block w-full rounded border border-slate-300 py-2 px-3 text-sm text-slate-700 tabular-nums focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Type de dépense
                      </label>
                      <input
                        type="text"
                        name="type"
                        id="type"
                        placeholder="Ex: Déplacement, Repas, Hébergement..."
                        value={data.type}
                        onChange={handleChange}
                        required
                        className="block w-full rounded border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Détails de la dépense..."
                        value={data.description}
                        onChange={handleChange}
                        className="block w-full rounded border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Justificatif
                      </label>
                      <div
                        className="flex justify-center rounded border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 hover:border-slate-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-2 text-center">
                          <svg
                            className="mx-auto h-10 w-10 text-slate-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-slate-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded font-medium text-slate-900 hover:text-slate-700"
                            >
                              <span>Choisir un fichier</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleChange}
                                ref={fileInputRef}
                                accept="image/*,.pdf"
                              />
                            </label>
                            <p className="pl-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs text-slate-500">PNG, JPG, PDF jusqu'à 10MB</p>

                          {data.proof && (
                            <p className="text-sm text-green-700 font-medium mt-2 bg-green-50 border border-green-200 rounded px-3 py-1.5 inline-block">
                              ✓ {data.proof.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="mt-3 inline-flex w-full justify-center rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
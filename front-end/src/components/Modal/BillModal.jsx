import { useEffect, useRef } from 'react';

export default function BillModal({ bill, isOpen, onClose }) {
  const modalRef = useRef(null);

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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed or no bill data
  if (!isOpen || !bill) {
    console.log('❌ Modal fermé - isOpen:', isOpen, 'bill:', bill);
    return null;
  }
  
  console.log('✅ Modal ouvert avec les données:', bill);

  // Function to determine status badge color - Corporate style
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-900 border-red-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-900 border-amber-200';
    }
  };

  // Traduire les statuts en français
  const getStatusLabel = (status) => {
    switch (status) {
      case 'Approved':
        return 'Approuvé';
      case 'Rejected':
        return 'Refusé';
      case 'Pending':
      default:
        return 'En attente';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop - Corporate style */}
      <div 
        className="fixed inset-0 bg-slate-900/20 transition-opacity" 
        aria-hidden="true"
        onClick={onClose}
      ></div>
      
      {/* Modal content - Corporate style avec scroll */}
      <div 
        ref={modalRef}
        className="relative z-[101] bg-white rounded-md border border-slate-200 shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header - Corporate style */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Détails de la demande
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded border text-xs font-semibold tracking-wide uppercase ${getStatusClasses(bill.status)}`}>
                {getStatusLabel(bill.status)}
              </span>
            </div>
          </div>
          
          {/* Body - Scrollable */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                
                {/* Data Grid - Corporate style */}
                <div className="divide-y divide-slate-100">
                  {/* Row 1 */}
                  <div className="grid grid-cols-3 gap-x-4 py-3">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      ID
                    </div>
                    <div className="col-span-2 text-sm text-slate-900 font-mono">
                      {bill._id ? bill._id.slice(-8) : 'N/A'}
                    </div>
                  </div>
                  
                  {/* Row 2 */}
                  <div className="grid grid-cols-3 gap-x-4 py-3">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Date
                    </div>
                    <div className="col-span-2 text-sm text-slate-900 tabular-nums">
                      {new Date(bill.date).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  {/* Row 3 */}
                  <div className="grid grid-cols-3 gap-x-4 py-3">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Type
                    </div>
                    <div className="col-span-2 text-sm text-slate-900 font-medium">
                      {bill.type}
                    </div>
                  </div>
                  
                  {/* Row 4 - Montant */}
                  <div className="grid grid-cols-3 gap-x-4 py-3 bg-slate-50">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Montant
                    </div>
                    <div className="col-span-2 text-lg text-slate-900 font-semibold tabular-nums">
                      {bill.amount ? bill.amount.toFixed(2) : '0.00'} €
                    </div>
                  </div>
                  
                  {/* Row 5 - Description */}
                  {bill.description && (
                    <div className="grid grid-cols-3 gap-x-4 py-3">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Description
                      </div>
                      <div className="col-span-2 text-sm text-slate-700 leading-relaxed">
                        {bill.description}
                      </div>
                    </div>
                  )}
                  
                  {/* Row 6 - Justificatif */}
                  {bill.proof && (
                    <div className="grid grid-cols-3 gap-x-4 py-4">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Justificatif
                      </div>
                      <div className="col-span-2">
                        <a 
                          href={bill.proof} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block group"
                        >
                          <img 
                            src={bill.proof} 
                            alt="Justificatif" 
                            className="max-h-48 w-auto object-contain rounded border border-slate-200 group-hover:border-slate-400 transition-colors" 
                          />
                          <p className="text-xs text-slate-500 mt-2 group-hover:text-slate-700">
                            Cliquer pour agrandir →
                          </p>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer - Corporate style */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2 flex-shrink-0">
            {bill.proof && (
              <a
                href={bill.proof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
              >
                <i className="fa-solid fa-download mr-2 text-xs"></i>
                Télécharger
              </a>
            )}
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Fermer
            </button>
          </div>
        </div>
    </div>
  );
} 
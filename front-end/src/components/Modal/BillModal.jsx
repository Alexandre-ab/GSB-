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
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed or no bill data
  if (!isOpen || !bill) return null;

  // Function to determine status badge color
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop with blur effect */}
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        {/* Modal positioning */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        {/* Modal content */}
        <div 
          ref={modalRef}
          className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle z-[101] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Bill Details</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(bill.status)}`}>
                    {bill.status}
                  </span>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bill ID</p>
                        <p className="mt-1 text-sm text-gray-900">#{bill._id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="mt-1 text-sm text-gray-900">{new Date(bill.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="mt-1 text-sm text-gray-900">{bill.type}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{bill.amount.toFixed(2)} €</p>
                    </div>
                    
                    {bill.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="mt-1 text-sm text-gray-900">{bill.description}</p>
                      </div>
                    )}
                    
                    {bill.proof && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Receipt</p>
                        <div className="mt-1 flex items-center">
                          <img src={bill.proof} alt="Receipt" className="h-32 w-32 object-cover rounded-md shadow-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
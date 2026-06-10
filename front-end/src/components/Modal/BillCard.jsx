import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BillModal from '../components/Modal/BillModal';
import AddBillModal from '../components/Modal/AddBillModal';

export default function Dashboard({ onLogout }) {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // Récupérer le token depuis localStorage au lieu de le hardcoder
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.warn('Aucun token trouvé - utilisateur non connecté');
          return;
        }

        const response = await fetch('https://gsb-2.onrender.com/api/bills',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched bills:', data);
        setBills(data);
      } catch (e) {
        console.error('Error fetching bills:', e)
      }
    })();
  }, []);

  // Ensure proper modal cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Ensure body scroll is enabled when component unmounts
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAddBill = (newBill) => {
    setBills([newBill, ...bills]);
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setIsDetailModalOpen(true);
  };

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

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredBills = bills.filter(bill => {
    // Filter by status
    if (filterStatus !== 'All' && bill.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bill.merchant.toLowerCase().includes(query) ||
        bill.description?.toLowerCase().includes(query) ||
        bill.amount.toString().includes(query)
      );
    }

    return true;
  });

  const handleRowClick = (bill) => {
    console.log('Opening bill details:', bill);
    setSelectedBill({ ...bill });
    setTimeout(() => {
      setIsDetailModalOpen(true);
    }, 0);
  };

  const openAddBillModal = () => {
    console.log('Opening add bill modal');
    setIsAddModalOpen(true);
  };

  const closeDetailModal = () => {
    console.log('Closing detail modal');
    setIsDetailModalOpen(false);
    setTimeout(() => {
      setSelectedBill(null);
    }, 300);
  };

  const closeAddModal = () => {
    console.log('Closing add modal');
    setIsAddModalOpen(false);
  };

  console.log('Current state:', {
    isDetailModalOpen,
    isAddModalOpen,
    selectedBill: selectedBill ? `Bill #${selectedBill.id}` : 'None'
  });

  return (
    <div className="min-h-screen bg-white">
      <Header onLogout={onLogout} />

      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Your Bills
              </h2>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <button
                type="button"
                onClick={openAddBillModal}
                className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add Bill
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 md:flex md:items-center md:justify-end">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Status:</span>
                <select
                  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bills Table */}
          {filteredBills.length === 0 ? (
            <div className="mt-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No bills found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterStatus !== 'All'
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : 'Get started by creating a new bill.'}
              </p>
              {!searchQuery && filterStatus === 'All' && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={openAddBillModal}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    Add Bill
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            ID
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Type
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Amount
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredBills.map((bill) => (
                          <tr
                            key={bill._id}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <td
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                              onClick={() => handleRowClick(bill)}
                            >
                              #{bill._id}
                            </td>
                            <td
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                              onClick={() => handleRowClick(bill)}
                            >
                              {formatDate(bill.date)}
                            </td>
                            <td
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                              onClick={() => handleRowClick(bill)}
                            >
                              {bill.type}
                            </td>
                            <td
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium"
                              onClick={() => handleRowClick(bill)}
                            >
                              ${bill.amount.toFixed(2)}
                            </td>
                            <td
                              className="whitespace-nowrap px-3 py-4 text-sm"
                              onClick={() => handleRowClick(bill)}
                            >
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(bill.status)}`}>
                                {bill.status}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewBill(bill);
                                }}
                              >
                                View<span className="sr-only">, bill #{bill.id}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBills.length}</span> of{' '}
                      <span className="font-medium">{filteredBills.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 bg-blue-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bill Detail Modal */}
      <BillModal
        bill={selectedBill}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />

      {/* Add Bill Modal */}
      <AddBillModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleAddBill}
      />
    </div>
  );
} 
import { useState } from 'react';

export default function Header({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">GSB Bill Manager</h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">John Doe</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-3 border-t border-gray-200 pt-3 md:hidden">
            <div className="space-y-1">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">John Doe</span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1 text-sm text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
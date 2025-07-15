import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui';
import { ROUTES } from '../../utils/constants';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        {!isOpen ? (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMenu}>
          <div 
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4">
              {isAuthenticated ? (
                <div className="space-y-1">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {user?.first_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link
                    to={ROUTES.DASHBOARD}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={ROUTES.SEARCH}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Search Properties
                  </Link>
                  <Link
                    to={ROUTES.BOOKINGS}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to={ROUTES.MY_PROPERTIES}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    My Properties
                  </Link>
                  <Link
                    to={ROUTES.MY_REVIEWS}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    My Reviews
                  </Link>
                  <Link
                    to={ROUTES.ANALYTICS}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Analytics
                  </Link>
                  <Link
                    to={ROUTES.UPLOAD_PROPERTY}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Add Property
                  </Link>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Profile
                  </Link>

                  {/* Logout */}
                  <div className="px-4 py-3 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to={ROUTES.SEARCH}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Search Properties
                  </Link>
                  <div className="px-4 py-3 space-y-3">
                    <Link to={ROUTES.LOGIN} onClick={closeMenu}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to={ROUTES.SIGNUP} onClick={closeMenu}>
                      <Button variant="primary" className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

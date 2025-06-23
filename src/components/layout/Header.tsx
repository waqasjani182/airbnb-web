import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui';
import { ROUTES } from '../../utils/constants';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <div className="text-3xl font-bold text-red-600 tracking-tight">
              AirBed
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to={ROUTES.SEARCH}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Search
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to={ROUTES.MY_PROPERTIES}
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  My Properties
                </Link>
                <Link
                  to={ROUTES.PROPERTY_BOOKINGS}
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  Manage Bookings
                </Link>
                <Link
                  to={ROUTES.UPLOAD_PROPERTY}
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  Host your property
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to={ROUTES.DASHBOARD}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link to={ROUTES.PROFILE}>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {user?.first_name?.[0]?.toUpperCase()}
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

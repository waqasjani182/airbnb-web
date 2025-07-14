import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { ROUTES } from './utils/constants';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Search from './pages/property/Search';
import PropertyDetails from './pages/property/PropertyDetails';
import UploadProperty from './pages/property/UploadProperty';
import EditProperty from './pages/property/EditProperty';
import MyProperties from './pages/property/MyProperties';
import PropertyStatusManagement from './pages/property/PropertyStatusManagement';
import Bookings from './pages/booking/Bookings';
import PropertyBookings from './pages/booking/PropertyBookings';
import BookingDetails from './pages/booking/BookingDetails';
import BookingConfirmation from './pages/booking/BookingConfirmation';
import Profile from './pages/profile/Profile';
import { UserReviews } from './pages/reviews';
import { ProtectedRoute, ErrorBoundary, GlobalLoading } from './components/common';
import AuthInitializer from './components/common/AuthInitializer';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AuthInitializer />
        <Router>
          <div className="App">
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.SEARCH} element={<Search />} />
              <Route path={ROUTES.PROPERTY_DETAILS} element={<PropertyDetails />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.UPLOAD_PROPERTY}
                element={
                  <ProtectedRoute>
                    <UploadProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EDIT_PROPERTY}
                element={
                  <ProtectedRoute>
                    <EditProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_PROPERTIES}
                element={
                  <ProtectedRoute>
                    <MyProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROPERTY_STATUS_MANAGEMENT}
                element={
                  <ProtectedRoute>
                    <PropertyStatusManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BOOKINGS}
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROPERTY_BOOKINGS}
                element={
                  <ProtectedRoute>
                    <PropertyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BOOKING_DETAILS}
                element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.BOOKING_CONFIRMATION}
                element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_REVIEWS}
                element={
                  <ProtectedRoute>
                    <UserReviews />
                  </ProtectedRoute>
                }
              />
              {/* More routes will be added here */}
            </Routes>
            <GlobalLoading />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;

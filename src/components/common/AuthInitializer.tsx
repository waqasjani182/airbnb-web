import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { loginSuccess, logout } from '../../store/slices/authSlice';
import { useGetCurrentUserQuery } from '../../services/authApi';
import { transformUserProfile } from '../../types';

/**
 * AuthInitializer component that handles authentication state restoration
 * when the app loads with a token but no user data (e.g., after page refresh)
 */
const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Only fetch current user if we have a token but no user data
  const shouldFetchUser = isAuthenticated && token && !user;

  const {
    data: currentUserData,
    error,
    isLoading,
  } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    if (currentUserData && token && !user) {
      // Transform the user profile data and update the auth state
      const transformedUser = transformUserProfile(currentUserData);
      dispatch(loginSuccess({ user: transformedUser, token }));
    }
  }, [currentUserData, token, user, dispatch]);

  useEffect(() => {
    if (error && shouldFetchUser) {
      // If fetching current user fails, the token is likely invalid
      // Clear the authentication state
      dispatch(logout());
    }
  }, [error, shouldFetchUser, dispatch]);

  // This component doesn't render anything
  return null;
};

export default AuthInitializer;

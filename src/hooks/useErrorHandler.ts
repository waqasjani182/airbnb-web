import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { handleApiError, isAuthError, ApiError } from '../utils/errorHandling';

export const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = useCallback((error: ApiError, customMessage?: string) => {
    // Handle authentication errors by logging out the user
    if (isAuthError(error)) {
      dispatch(logout());
      handleApiError(error, 'Your session has expired. Please log in again.');
      return;
    }

    // Handle other errors with custom or default messages
    handleApiError(error, customMessage);
  }, [dispatch]);

  return { handleError };
};

export default useErrorHandler;

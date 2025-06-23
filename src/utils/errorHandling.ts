import toast from 'react-hot-toast';

export interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
    error?: string;
  };
  status?: number;
  message?: string;
}

export const handleApiError = (error: ApiError, defaultMessage = 'An error occurred') => {
  let errorMessage = defaultMessage;

  if (error?.data?.message) {
    errorMessage = error.data.message;
  } else if (error?.data?.error) {
    errorMessage = error.data.error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.data?.errors) {
    // Handle validation errors
    const validationErrors = Object.values(error.data.errors).flat();
    errorMessage = validationErrors.join(', ');
  }

  toast.error(errorMessage);
  return errorMessage;
};

export const handleApiSuccess = (message: string) => {
  toast.success(message);
};

export const getErrorMessage = (error: ApiError, defaultMessage = 'An error occurred'): string => {
  if (error?.data?.message) {
    return error.data.message;
  } else if (error?.data?.error) {
    return error.data.error;
  } else if (error?.message) {
    return error.message;
  } else if (error?.data?.errors) {
    const validationErrors = Object.values(error.data.errors).flat();
    return validationErrors.join(', ');
  }
  return defaultMessage;
};

export const isNetworkError = (error: ApiError): boolean => {
  return !error?.status || error.status >= 500;
};

export const isAuthError = (error: ApiError): boolean => {
  return error?.status === 401 || error?.status === 403;
};

export const isValidationError = (error: ApiError): boolean => {
  return error?.status === 422 || (error?.data?.errors && Object.keys(error.data.errors).length > 0) || false;
};

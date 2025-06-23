import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice from './slices/authSlice';
import propertySlice from './slices/propertySlice';
import bookingSlice from './slices/bookingSlice';
import { apiSlice } from './api/apiSlice';

// Import all API services to ensure they're injected
import '../services/authApi';
import '../services/propertyApi';
import '../services/bookingApi';
import '../services/facilitiesApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    property: propertySlice,
    booking: bookingSlice,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

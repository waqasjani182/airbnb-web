import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property, PropertySearchParams } from '../../types';

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  searchParams: PropertySearchParams;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  searchParams: {
    page: 1,
    limit: 12,
    min_rating: undefined,
    max_rating: undefined,
  },
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  },
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    setSearchParams: (state, action: PayloadAction<PropertySearchParams>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<PropertyState['pagination']>) => {
      state.pagination = action.payload;
    },
    clearProperties: (state) => {
      state.properties = [];
      state.selectedProperty = null;
    },
  },
});

export const {
  setProperties,
  setSelectedProperty,
  setSearchParams,
  setLoading,
  setError,
  setPagination,
  clearProperties,
} = propertySlice.actions;

export default propertySlice.reducer;

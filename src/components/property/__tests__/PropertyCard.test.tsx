import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from '../PropertyCard';
import { Property } from '../../../types';

const mockProperty: Property = {
  property_id: 1,
  user_id: 1,
  title: 'Beautiful Beachfront Villa',
  description: 'Stunning oceanfront property with private beach access',
  property_type: 'Villa',
  rent_per_day: 250,
  address: '123 Ocean Drive',
  city: 'Miami',
  latitude: 25.7617,
  longitude: -80.1918,
  guest: 8,
  rating: 4.8,
  review_count: 24,
  booking_count: 45,
  primary_image: 'https://example.com/image.jpg',
  images: [],
  facilities: [],
  reviews: [],
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PropertyCard Component', () => {
  it('renders property information correctly', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText('Beautiful Beachfront Villa')).toBeInTheDocument();
    expect(screen.getByText('Miami • 8 guests')).toBeInTheDocument();
    expect(screen.getByText(/Stunning oceanfront property/)).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('displays property type badge', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Villa')).toBeInTheDocument();
  });

  it('displays rating when available', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('⭐ 4.8')).toBeInTheDocument();
  });

  it('displays review count when available', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('24 reviews')).toBeInTheDocument();
  });

  it('does not display rating badge when rating is 0', () => {
    const propertyWithoutRating = { ...mockProperty, rating: 0 };
    renderWithRouter(<PropertyCard property={propertyWithoutRating} />);
    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  it('does not display review count when reviewCount is 0', () => {
    const propertyWithoutReviews = { ...mockProperty, reviewCount: 0 };
    renderWithRouter(<PropertyCard property={propertyWithoutReviews} />);
    expect(screen.queryByText(/reviews/)).not.toBeInTheDocument();
  });

  it('renders property image with correct alt text', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);
    const image = screen.getByAltText('Beautiful Beachfront Villa');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('uses placeholder image when primaryImage is not provided', () => {
    const propertyWithoutImage = { ...mockProperty, primaryImage: '' };
    renderWithRouter(<PropertyCard property={propertyWithoutImage} />);
    const image = screen.getByAltText('Beautiful Beachfront Villa');
    expect(image).toHaveAttribute('src', '/placeholder-property.jpg');
  });
});

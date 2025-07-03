import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StarRating from '../StarRating';

describe('StarRating Component', () => {
  it('renders correct number of stars', () => {
    render(<StarRating rating={3.5} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  it('displays rating value', () => {
    render(<StarRating rating={4.2} />);
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('handles interactive mode', () => {
    const onRatingChange = vi.fn();
    render(
      <StarRating 
        rating={0} 
        interactive={true} 
        onRatingChange={onRatingChange} 
      />
    );
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]); // Click third star
    expect(onRatingChange).toHaveBeenCalledWith(3);
  });

  it('does not call onRatingChange when not interactive', () => {
    const onRatingChange = vi.fn();
    render(
      <StarRating 
        rating={3} 
        interactive={false} 
        onRatingChange={onRatingChange} 
      />
    );
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[0]);
    expect(onRatingChange).not.toHaveBeenCalled();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<StarRating rating={4} size="sm" />);
    let stars = screen.getAllByRole('button');
    expect(stars[0].querySelector('svg')).toHaveClass('w-4', 'h-4');

    rerender(<StarRating rating={4} size="lg" />);
    stars = screen.getAllByRole('button');
    expect(stars[0].querySelector('svg')).toHaveClass('w-6', 'h-6');
  });

  it('does not display rating text when rating is 0', () => {
    render(<StarRating rating={0} />);
    expect(screen.queryByText('0.0')).not.toBeInTheDocument();
  });
});

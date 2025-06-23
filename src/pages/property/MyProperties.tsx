import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../../components/layout';
import { Button, Card, Badge, Loading } from '../../components/ui';
import { useGetUserPropertiesQuery, useDeletePropertyMutation } from '../../services/propertyApi';
import { useErrorHandler } from '../../hooks';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import { Property } from '../../types/property.types';

const MyProperties: React.FC = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(null);

  const {
    data: propertiesData,
    isLoading,
    error
  } = useGetUserPropertiesQuery();

  const [deleteProperty] = useDeletePropertyMutation();



  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingPropertyId(propertyId);
      await deleteProperty(propertyId).unwrap();
      toast.success('Property deleted successfully');
    } catch (error: any) {
      handleError(error, 'Failed to delete property');
    } finally {
      setDeletingPropertyId(null);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading your properties..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Properties
            </h1>
            <p className="text-gray-600 mb-6">
              {(error as any)?.data?.message || 'Failed to load your properties'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const properties = propertiesData?.properties || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 mt-2">
              Manage your property listings and track performance
            </p>
          </div>
          <Link to={ROUTES.UPLOAD_PROPERTY}>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start earning by listing your first property on our platform.
            </p>
            <Link to={ROUTES.UPLOAD_PROPERTY}>
              <Button>
                Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <PropertyCard
                key={property.property_id}
                property={property}
                onDelete={handleDeleteProperty}
                isDeleting={deletingPropertyId === property.property_id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

interface PropertyCardProps {
  property: Property;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete, isDeleting }) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="relative">
        <img
          src={property.primary_image || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-white text-gray-800">
            {property.property_type}
          </Badge>
        </div>
        {property.rating && property.rating > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" className="bg-white text-gray-800">
              ⭐ {property.rating.toFixed(1)}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          {property.city} • {property.guest} guests
        </p>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(property.rent_per_day)}
            </span>
            <span className="text-sm text-gray-500"> / night</span>
          </div>
          <div className="flex items-center space-x-2">
            {(property.review_count || 0) > 0 && (
              <span className="text-sm text-gray-500">
                {property.review_count} reviews
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link to={`/property/${property.property_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              // TODO: Implement edit functionality
              toast('Edit functionality coming soon!');
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(property.property_id)}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MyProperties;

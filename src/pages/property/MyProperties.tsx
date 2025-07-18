import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Button, Card, Badge, Loading } from '../../components/ui';
import { useGetUserPropertiesQuery, useDeletePropertyMutation } from '../../services/propertyApi';
import { useErrorHandler } from '../../hooks';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import { Property } from '../../types/property.types';

const MyProperties: React.FC = () => {
  const { handleError } = useErrorHandler();
  const { user } = useSelector((state: RootState) => state.auth);

  // Debug user info
  console.log('MyProperties - Current user:', user);
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(null);

  const {
    data: propertiesData,
    isLoading,
    error
  } = useGetUserPropertiesQuery();

  // Debug properties data
  console.log('MyProperties - Properties data:', propertiesData);

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
  const navigate = useNavigate();
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="relative">
        <img
          src={property.primary_image || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge variant="default" className="bg-white text-gray-800">
            {property.property_type}
          </Badge>
          {/* Status indicators */}
          {property.status && (
            <Badge
              variant={property.status === 'active' ? 'success' : 'warning'}
              className="bg-white text-xs"
            >
              {property.status === 'active' ? 'Active' : 'Maintenance'}
            </Badge>
          )}
          {property.is_active !== undefined && (
            <Badge
              variant={property.is_active ? 'success' : 'error'}
              className="bg-white text-xs"
            >
              {property.is_active ? 'Enabled' : 'Disabled'}
            </Badge>
          )}
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

        <div className="space-y-2">
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
              onClick={() => navigate(`/property/${property.property_id}/edit`)}
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

          {/* Status Management Button */}
          <Link to={`/property/${property.property_id}/status`} className="block">
            <Button variant="outline" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Status
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default MyProperties;

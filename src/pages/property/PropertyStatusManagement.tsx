import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Layout } from '../../components/layout';
import { Button, Card, Loading, Input, Badge } from '../../components/ui';
import { 
  useGetPropertyStatusQuery,
  useSetPropertyMaintenanceMutation,
  useActivatePropertyMutation,
  useTogglePropertyStatusMutation 
} from '../../services/propertyApi';
import { useErrorHandler } from '../../hooks';
import { ROUTES } from '../../utils/constants';

const maintenanceSchema = z.object({
  maintenance_reason: z.string().min(10, 'Maintenance reason must be at least 10 characters'),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

const PropertyStatusManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = parseInt(id || '0');
  
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  
  const { data: statusData, isLoading, error } = useGetPropertyStatusQuery(propertyId);
  const [setMaintenance, { isLoading: isSettingMaintenance }] = useSetPropertyMaintenanceMutation();
  const [activateProperty, { isLoading: isActivating }] = useActivatePropertyMutation();
  const [toggleStatus, { isLoading: isToggling }] = useTogglePropertyStatusMutation();
  
  useErrorHandler(error);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
  });

  const handleSetMaintenance = async (data: MaintenanceFormData) => {
    try {
      const result = await setMaintenance({
        id: propertyId,
        data: { maintenance_reason: data.maintenance_reason }
      }).unwrap();
      
      toast.success(result.message);
      setShowMaintenanceForm(false);
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to set property to maintenance');
    }
  };

  const handleActivateProperty = async () => {
    try {
      const result = await activateProperty(propertyId).unwrap();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to activate property');
    }
  };

  const handleToggleActive = async (isActive: boolean) => {
    try {
      const result = await toggleStatus({
        id: propertyId,
        data: { is_active: isActive }
      }).unwrap();
      
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update property status');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading property status..." />
        </div>
      </Layout>
    );
  }

  if (!statusData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
              <p className="text-gray-600 mb-4">
                The property you're looking for doesn't exist or you don't have permission to manage it.
              </p>
              <Button onClick={() => navigate(ROUTES.MY_PROPERTIES)}>
                Back to My Properties
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const { property_id, title, status, is_active, can_accept_bookings } = statusData;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Status Management</h1>
              <p className="text-gray-600 mt-2">Manage availability and maintenance status</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(ROUTES.MY_PROPERTIES)}
            >
              Back to Properties
            </Button>
          </div>
        </div>

        {/* Property Info */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-gray-600">Property ID: {property_id}</p>
            </div>
            <div className="flex gap-2">
              <Badge 
                variant={status === 'active' ? 'success' : 'warning'}
                className="text-sm"
              >
                {status === 'active' ? 'Active' : 'Maintenance'}
              </Badge>
              <Badge
                variant={is_active ? 'success' : 'error'}
                className="text-sm"
              >
                {is_active ? 'Enabled' : 'Disabled'}
              </Badge>
              <Badge
                variant={can_accept_bookings ? 'success' : 'default'}
                className="text-sm"
              >
                {can_accept_bookings ? 'Accepting Bookings' : 'Not Accepting Bookings'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Status Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Maintenance Mode Control */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                When in maintenance mode, your property will be automatically disabled and hidden from guests.
              </p>
              
              {status === 'maintenance' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium">
                      Property is currently in maintenance mode
                    </p>
                  </div>
                  <Button
                    onClick={handleActivateProperty}
                    disabled={isActivating}
                    className="w-full"
                  >
                    {isActivating ? 'Activating...' : 'Activate Property'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!showMaintenanceForm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowMaintenanceForm(true)}
                      className="w-full"
                    >
                      Set to Maintenance
                    </Button>
                  ) : (
                    <form onSubmit={handleSubmit(handleSetMaintenance)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maintenance Reason
                        </label>
                        <Input
                          {...register('maintenance_reason')}
                          placeholder="e.g., Renovating kitchen and bathrooms"
                          error={errors.maintenance_reason?.message}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isSettingMaintenance}
                          className="flex-1"
                        >
                          {isSettingMaintenance ? 'Setting...' : 'Set Maintenance'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowMaintenanceForm(false);
                            reset();
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Enable/Disable Control */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Availability</h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Temporarily enable or disable your property without changing maintenance status.
              </p>
              
              {status === 'maintenance' ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    Cannot enable property while in maintenance mode. Please activate the property first.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleToggleActive(true)}
                    disabled={isToggling || is_active}
                    variant={is_active ? 'secondary' : 'default'}
                    className="w-full"
                  >
                    {is_active ? 'Property Enabled' : 'Enable Property'}
                  </Button>
                  <Button
                    onClick={() => handleToggleActive(false)}
                    disabled={isToggling || !is_active}
                    variant={!is_active ? 'secondary' : 'outline'}
                    className="w-full"
                  >
                    {!is_active ? 'Property Disabled' : 'Disable Property'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Business Rules Info */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Rules</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Properties in maintenance mode are automatically disabled and hidden from guests</p>
            <p>• Properties must be both active and enabled to accept bookings</p>
            <p>• Existing bookings remain valid when property is disabled or in maintenance</p>
            <p>• Only active properties can be enabled - activate from maintenance first</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default PropertyStatusManagement;

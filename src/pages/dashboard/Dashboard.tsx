import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { useGetUserPropertiesQuery } from '../../services/propertyApi';
import { useGetUserBookingsQuery, useGetHostBookingsQuery } from '../../services/bookingApi';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch user data based on role
  const { data: userProperties } = useGetUserPropertiesQuery(undefined, {
    skip: true, // Temporarily disabled
  });

  const { data: userBookings } = useGetUserBookingsQuery(undefined, {
    skip: !user,
  });

  const { data: hostBookings } = useGetHostBookingsQuery(undefined, {
    skip: true, // Temporarily disabled
  });

  const propertiesCount = userProperties?.properties?.length || 0;
  const userBookingsCount = userBookings?.bookings?.length || 0;
  const hostBookingsCount = hostBookings?.bookings?.length || 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and trips
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to={ROUTES.SEARCH} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Properties
                </Button>
              </Link>
              
              {/* Host actions temporarily disabled */}
              
              <Link to={ROUTES.USER_BOOKINGS} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Bookings
                </Button>
              </Link>
              <Link to={ROUTES.PROPERTY_BOOKINGS} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Manage Property Bookings
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                No recent activity to show
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Travel Stats
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {userBookingsCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Trips
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {userBookingsCount}
                  </div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Completion */}
        <Card className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Complete Your Profile</h3>
              <p className="text-gray-600">
                Add more information to help others get to know you better
              </p>
            </div>
            <Link to={ROUTES.PROFILE}>
              <Button variant="primary">
                Update Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

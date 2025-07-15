import React, { useState } from 'react';
import { CityAnalytics, BookingsAnalytics } from '../../components/analytics';
import { Card } from '../../components/ui';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'city' | 'bookings'>('city');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Explore property and booking analytics with our new search and analytics features
          </p>
        </div>

        {/* Tab Navigation */}
        <Card className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('city')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'city'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              City Property Analytics
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bookings Analytics
            </button>
          </div>
        </Card>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'city' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Properties by City with Ratings
                </h2>
                <p className="text-gray-600">
                  Search for properties in any city and get comprehensive rating information, 
                  review statistics, and property details.
                </p>
              </div>
              <CityAnalytics />
              
             
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Bookings with Ratings by Date Range
                </h2>
                <p className="text-gray-600">
                  Analyze bookings within any date range with comprehensive rating information, 
                  guest/host details, and revenue statistics.
                </p>
              </div>
              <BookingsAnalytics />
              
             
            </div>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default AnalyticsPage;

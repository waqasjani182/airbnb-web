import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Button, Card } from '../components/ui';
import { ROUTES, API_BASE_URL } from '../utils/constants';
import { useGetPropertiesQuery } from '../services/propertyApi';
import PropertyList from '../components/property/PropertyList';
import { Property } from '../types/property.types';

const Home: React.FC = () => {
  // Fetch properties from API
  const { data: propertiesData, isLoading, error } = useGetPropertiesQuery({});

  // Fallback fetch test
  const [fetchData, setFetchData] = useState<Property[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Debug logging
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Home component - isLoading:', isLoading);
  console.log('Home component - error:', error);
  console.log('Home component - data:', propertiesData);

  // Test direct fetch as fallback
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('Testing direct fetch to:', `${API_BASE_URL}/api/properties`);
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Direct fetch success:', result);
        setFetchData(result.properties || []);
      } catch (err) {
        console.error('Direct fetch error:', err);
        setFetchError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    // Only use fallback if RTK Query fails
    if (error && !isLoading) {
      testFetch();
    }
  }, [error, isLoading]);

  return (
    <Layout>
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Find your next stay
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Search low prices on hotels, homes and much more...
            </p>
            <Link to={ROUTES.SEARCH}>
              <Button size="lg" className="px-12 py-4 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                Start your search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-200">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Unique stays</h3>
              <p className="text-gray-600 text-lg">Find amazing places to stay from local hosts</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-200">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Verified hosts</h3>
              <p className="text-gray-600 text-lg">All our hosts are verified for your safety</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-200">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Best prices</h3>
              <p className="text-gray-600 text-lg">Get the best deals on your next vacation</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing places to stay from our verified hosts
            </p>
          </div>

          {/* Properties List */}
          <PropertyList
            properties={propertiesData?.properties || fetchData || []}
            isLoading={isLoading}
            emptyMessage="No properties available at the moment"
          />

          {/* View All Properties Button */}
          {((propertiesData?.properties && propertiesData.properties.length > 0) || (fetchData && fetchData.length > 0)) && (
            <div className="text-center mt-12">
              <Link to={ROUTES.SEARCH}>
                <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  View All Properties
                </Button>
              </Link>
            </div>
          )}

          {/* Error State */}
          {(error || fetchError) && !fetchData && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unable to load properties
              </h3>
              <p className="text-gray-500 mb-4">
                There was an error loading the properties. Please try again later.
                {error && <><br />RTK Query Error: {JSON.stringify(error)}</>}
                {fetchError && <><br />Fetch Error: {fetchError}</>}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-red-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to earn as a host?</h2>
          <p className="text-xl mb-10 text-red-100 max-w-2xl mx-auto">
            Join thousands of hosts earning extra income by sharing their space
          </p>
          <Link to={ROUTES.SIGNUP}>
            <Button size="lg" className="px-12 py-4 text-lg font-semibold bg-white text-red-600 hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
              Become a host
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

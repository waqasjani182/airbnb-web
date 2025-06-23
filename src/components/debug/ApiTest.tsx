import React, { useEffect, useState } from 'react';
import { useGetPropertiesQuery } from '../../services/propertyApi';
import { API_BASE_URL } from '../../utils/constants';

const ApiTest: React.FC = () => {
  const { data, error, isLoading } = useGetPropertiesQuery({ limit: 8 });
  const [fetchTest, setFetchTest] = useState<any>(null);
  const [fetchError, setFetchError] = useState<any>(null);

  console.log('API Test - Data:', data);
  console.log('API Test - Error:', error);
  console.log('API Test - Loading:', isLoading);
  console.log('API Base URL:', API_BASE_URL);

  // Test direct fetch
  useEffect(() => {
    const testFetch = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties?limit=8`);
        const result = await response.json();
        setFetchTest(result);
        console.log('Direct fetch result:', result);
      } catch (err) {
        setFetchError(err);
        console.log('Direct fetch error:', err);
      }
    };
    testFetch();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Debug Test</h3>
      <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
      <p><strong>RTK Query Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
      <p><strong>RTK Query Error:</strong> {error ? JSON.stringify(error) : 'None'}</p>
      <p><strong>RTK Query Data:</strong> {data ? `${data.properties?.length || 0} properties` : 'None'}</p>

      <hr />

      <p><strong>Direct Fetch Error:</strong> {fetchError ? JSON.stringify(fetchError) : 'None'}</p>
      <p><strong>Direct Fetch Data:</strong> {fetchTest ? `${fetchTest.properties?.length || 0} properties` : 'None'}</p>

      {fetchTest && (
        <div>
          <h4>Direct Fetch Result:</h4>
          <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(fetchTest, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;

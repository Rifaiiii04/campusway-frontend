'use client';

import { useState } from 'react';
import { apiRequest, ApiResponse } from '../services/api';

export default function ApiTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('idle');
  const [testResults, setTestResults] = useState<ApiResponse[]>([]);
  const [error, setError] = useState<string>('');

  const testApiConnection = async () => {
    setConnectionStatus('testing');
    setError('');

    try {
      const response = await apiRequest('/test');
      setTestResults(prev => [...prev, response]);
      setConnectionStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  const testHealthCheck = async () => {
    setConnectionStatus('testing');
    setError('');

    try {
      const response = await apiRequest('/health');
      setTestResults(prev => [...prev, response]);
      setConnectionStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setError('');
    setConnectionStatus('idle');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={testApiConnection}
          disabled={connectionStatus === 'testing'}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {connectionStatus === 'testing' ? 'Testing...' : 'Test API Connection'}
        </button>
        
        <button
          onClick={testHealthCheck}
          disabled={connectionStatus === 'testing'}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {connectionStatus === 'testing' ? 'Testing...' : 'Health Check'}
        </button>
      </div>

      <button
        onClick={clearResults}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Clear Results
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results:</h2>
          {testResults.map((result, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Test {index + 1}</h3>
              <pre className="bg-white p-2 rounded text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Make sure your Laravel backend is running on port 8000</li>
          <li>Click &quot;Test API Connection&quot; to test basic connectivity</li>
          <li>Click &quot;Health Check&quot; to test backend health</li>
          <li>Check the results below for response details</li>
        </ul>
      </div>
    </div>
  );
}

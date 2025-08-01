import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Server,
  ExternalLink,
  Terminal,
  Copy
} from 'lucide-react';
import { checkBackendStatus, testBackendConnection, getBackendSetupCommands } from '../utils/backend-connection-test';

const BackendStatus = ({ className = '' }) => {
  const [status, setStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [detailedResults, setDetailedResults] = useState(null);
  const [showCommands, setShowCommands] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setTesting(true);
    const result = await checkBackendStatus();
    setStatus(result);
    setTesting(false);
  };

  const runDetailedTest = async () => {
    setTesting(true);
    const results = await testBackendConnection();
    setDetailedResults(results);
    setTesting(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const setupCommands = getBackendSetupCommands();

  const StatusIcon = () => {
    if (testing) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    
    if (status?.isRunning) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const StatusMessage = () => {
    if (testing) {
      return <span className="text-blue-600">Testing connection...</span>;
    }
    
    if (status?.isRunning) {
      return <span className="text-green-600">Backend is running</span>;
    }
    
    return (
      <span className="text-red-600">
        Backend not accessible: {status?.error || 'Unknown error'}
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Server className="h-6 w-6 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Backend Status</h3>
        </div>
        <button
          onClick={checkStatus}
          disabled={testing}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Summary */}
      <div className="flex items-center space-x-3 mb-4">
        <StatusIcon />
        <StatusMessage />
      </div>

      {/* Backend URL */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Backend URL:</p>
            <p className="text-sm text-gray-600 font-mono">{status?.url}</p>
          </div>
          <a
            href={status?.url?.replace('/api', '/swagger')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Swagger
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={runDetailedTest}
          disabled={testing}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          Test Endpoints
        </button>
        
        <button
          onClick={() => setShowCommands(!showCommands)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Terminal className="h-4 w-4 mr-2" />
          Setup Commands
        </button>
      </div>

      {/* Detailed Test Results */}
      {detailedResults && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Endpoint Test Results:</h4>
          <div className="space-y-1">
            {Object.entries(detailedResults.endpoints).map(([endpoint, result]) => (
              <div key={endpoint} className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-600">{endpoint}</span>
                <span className={`${
                  result.includes('OK') || result.includes('Expected 401') 
                    ? 'text-green-600' 
                    : result.includes('Error') || result.includes('Not Found')
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {result}
                </span>
              </div>
            ))}
          </div>
          
          {detailedResults.errors.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 rounded">
              <p className="text-xs font-medium text-red-800">Errors:</p>
              {detailedResults.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">{error}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Setup Commands */}
      {showCommands && (
        <div className="p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Backend Setup Commands:</h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Start .NET Backend:</p>
              {setupCommands.dotnet.map((command, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 text-green-400 p-2 rounded text-xs font-mono">
                  <span>{command}</span>
                  <button
                    onClick={() => copyToClipboard(command)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Expected URLs:</p>
              <div className="space-y-1">
                {Object.entries(setupCommands.urls).map(([name, url]) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 capitalize">{name}:</span>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono"
                    >
                      {url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Message */}
      {!status?.isRunning && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">Backend Not Running</h4>
              <div className="mt-1 text-sm text-yellow-700">
                <p>To connect to your .NET backend:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Navigate to your TechBirdsWebapi project</li>
                  <li>Run: <code className="bg-yellow-100 px-1 rounded">dotnet run</code></li>
                  <li>Ensure it's running on: <code className="bg-yellow-100 px-1 rounded">https://localhost:7001</code></li>
                  <li>Configure CORS to allow: <code className="bg-yellow-100 px-1 rounded">http://localhost:5174</code></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;

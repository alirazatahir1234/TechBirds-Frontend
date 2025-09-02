import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, RefreshCw, Activity } from 'lucide-react';
import BackendStatus from '../../components/BackendStatus';
import BackendIntegrationTester from '../../components/BackendIntegrationTester';
import BackendEndpointChecker from '../../components/BackendEndpointChecker';
import DebugPanel from '../../components/DebugPanel';

const AdminDebug = () => {
  const [systemHealth, setSystemHealth] = useState({
    status: 'checking',
    issues: [],
    lastChecked: null
  });

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    // In a real app, this would call an API endpoint to check system health
    setSystemHealth({
      status: 'checking',
      issues: [],
      lastChecked: new Date()
    });
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, randomly decide if the system is healthy or has issues
      const hasIssues = Math.random() > 0.7;
      
      if (hasIssues) {
        setSystemHealth({
          status: 'warning',
          issues: [
            'Cache server response time above threshold',
            'Media storage approaching capacity (87%)'
          ],
          lastChecked: new Date()
        });
      } else {
        setSystemHealth({
          status: 'healthy',
          issues: [],
          lastChecked: new Date()
        });
      }
    } catch (error) {
      setSystemHealth({
        status: 'error',
        issues: ['Failed to check system health'],
        lastChecked: new Date()
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Diagnostics</h1>
        <p className="mt-2 text-gray-600">
          Debug and troubleshoot your TechBirds installation.
        </p>
      </div>
      
      {/* System Health Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">System Health</h2>
          <button 
            onClick={checkSystemHealth}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {systemHealth.status === 'checking' && (
            <div className="animate-pulse flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Checking system health...</span>
            </div>
          )}
          
          {systemHealth.status === 'healthy' && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 font-medium">All systems operational</span>
            </div>
          )}
          
          {systemHealth.status === 'warning' && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-amber-700 font-medium">Issues detected</span>
            </div>
          )}
          
          {systemHealth.status === 'error' && (
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-red-700 font-medium">System error</span>
            </div>
          )}
          
          {systemHealth.lastChecked && (
            <span className="text-xs text-gray-500">
              Last checked: {systemHealth.lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {systemHealth.issues.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Issues:</h3>
            <ul className="space-y-1">
              {systemHealth.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Backend Status */}
      <BackendStatus />
      
      {/* Integration Tester */}
      <BackendIntegrationTester />
      
      {/* Endpoint Checker */}
      <BackendEndpointChecker />
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
};

export default AdminDebug;
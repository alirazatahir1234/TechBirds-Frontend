import React, { useState } from 'react';
import { Terminal, Code, CheckCircle, XCircle } from 'lucide-react';

const DebugPanel = () => {
  const [activeTab, setActiveTab] = useState('console');
  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'info', message: 'Debug panel initialized', timestamp: new Date() },
    { type: 'log', message: 'System information loaded', timestamp: new Date() }
  ]);
  const [systemInfo, setSystemInfo] = useState({
    browserInfo: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    localeSettings: navigator.language || navigator.userLanguage
  });

  const addConsoleMessage = (type, message) => {
    setConsoleOutput(prev => [
      ...prev, 
      { type, message, timestamp: new Date() }
    ]);
  };

  const clearConsole = () => {
    setConsoleOutput([{ 
      type: 'info', 
      message: 'Console cleared', 
      timestamp: new Date() 
    }]);
  };

  const testNetworkRequest = async () => {
    addConsoleMessage('info', 'Testing network request to backend...');
    
    try {
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.3) {
        addConsoleMessage('success', 'Network request successful (200 OK)');
      } else {
        addConsoleMessage('error', 'Network request failed (503 Service Unavailable)');
      }
    } catch (error) {
      addConsoleMessage('error', `Network error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'console'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('console')}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Console
            </div>
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'system'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('system')}
          >
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              System Info
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'console' && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium text-gray-900">Debug Console</h3>
              <div className="flex gap-2">
                <button
                  onClick={testNetworkRequest}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                >
                  Test Network
                </button>
                <button
                  onClick={clearConsole}
                  className="px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-md p-4 h-64 overflow-y-auto text-sm font-mono">
              {consoleOutput.map((entry, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400 text-xs">
                    [{entry.timestamp.toLocaleTimeString()}] 
                  </span>{' '}
                  <span className={`${
                    entry.type === 'error' ? 'text-red-400' : 
                    entry.type === 'success' ? 'text-green-400' : 
                    entry.type === 'info' ? 'text-blue-400' : 'text-gray-200'
                  }`}>
                    {entry.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">System Information</h3>
            
            <div className="space-y-2">
              {Object.entries(systemInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Feature Support</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">LocalStorage</span>
                  <span>
                    {typeof window !== 'undefined' && 'localStorage' in window ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">SessionStorage</span>
                  <span>
                    {typeof window !== 'undefined' && 'sessionStorage' in window ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Cookies</span>
                  <span>
                    {typeof document !== 'undefined' && 'cookie' in document ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;

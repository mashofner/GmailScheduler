import React, { useState, useEffect } from 'react';
import { authorizeGmail, checkGmailAuth } from '../utils/emailUtils';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EmailIntegration: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authStatus = await checkGmailAuth();
        setIsAuthorized(authStatus);
      } catch (err) {
        setError('Failed to check authorization status');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleAuthorize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await authorizeGmail();
      setIsAuthorized(success);
      if (!success) {
        setError('Authorization failed');
      }
    } catch (err) {
      setError('Failed to authorize with Gmail');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Email Integration</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Mail className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-md font-medium">Gmail Integration</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Connect your Gmail account to send emails directly from this CRM.
        </p>
        
        {isAuthorized ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Gmail account connected
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your Gmail account is successfully connected. You can now send emails directly from the CRM.
              </p>
              <button
                className="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsAuthorized(false)}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Gmail account not connected
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Connect your Gmail account to send emails directly from the CRM.
                </p>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleAuthorize}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect Gmail Account'}
            </button>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium mb-2">Email Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Signature
            </label>
            <textarea
              rows={4}
              placeholder="Your email signature"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="flex items-center">
            <input
              id="track-opens"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="track-opens" className="ml-2 block text-sm text-gray-700">
              Track email opens
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="track-clicks"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="track-clicks" className="ml-2 block text-sm text-gray-700">
              Track link clicks
            </label>
          </div>
          
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailIntegration;
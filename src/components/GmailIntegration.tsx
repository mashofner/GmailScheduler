import React, { useState, useEffect } from 'react';
import { authorizeGmail, checkGmailAuth, loadGmailApi, getGmailUserProfile } from '../utils/emailUtils';
import { Mail, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const GmailIntegration: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ email: string; name: string } | null>(null);
  
  useEffect(() => {
    const initGmailApi = async () => {
      try {
        setIsLoading(true);
        await loadGmailApi();
        const authStatus = await checkGmailAuth();
        setIsAuthorized(authStatus);
        
        if (authStatus) {
          const profile = await getGmailUserProfile();
          setUserProfile(profile);
        }
      } catch (err) {
        setError('Failed to initialize Gmail API');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initGmailApi();
  }, []);
  
  const handleAuthorize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await authorizeGmail();
      setIsAuthorized(success);
      
      if (success) {
        const profile = await getGmailUserProfile();
        setUserProfile(profile);
        toast.success('Successfully connected to Gmail');
      } else {
        setError('Authorization failed');
        toast.error('Failed to connect to Gmail');
      }
    } catch (err) {
      setError('Failed to authorize with Gmail');
      toast.error('Error connecting to Gmail');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    // In a real implementation, this would revoke the OAuth token
    // For now, we'll just simulate disconnecting
    setIsAuthorized(false);
    setUserProfile(null);
    toast.success('Disconnected from Gmail');
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
      <h2 className="text-lg font-semibold mb-4">Gmail Integration</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Mail className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-md font-medium">Gmail Connection Status</h3>
        </div>
        
        {isAuthorized ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Gmail account connected
              </h3>
              {userProfile && (
                <p className="text-sm text-green-700 mt-1">
                  Connected as: <strong>{userProfile.email}</strong> {userProfile.name && `(${userProfile.name})`}
                </p>
              )}
              <p className="text-sm text-green-700 mt-1">
                Your Gmail account is successfully connected. You can now use Gmail's native features to send emails.
              </p>
              <button
                className="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleDisconnect}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              onClick={handleAuthorize}
              disabled={isLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? 'Connecting...' : 'Connect Gmail Account'}
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Setting Up Gmail API
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              To use Gmail integration, you need to set up a Google Cloud project and configure OAuth credentials:
            </p>
            <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1 ml-2">
              <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" /></a></li>
              <li>Create a new project</li>
              <li>Enable the Gmail API for your project</li>
              <li>Configure OAuth consent screen</li>
              <li>Create OAuth client ID credentials</li>
              <li>Add your application's domain to authorized JavaScript origins</li>
              <li>Copy the Client ID and update the GMAIL_API_CLIENT_ID in the application code</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium mb-2">Gmail Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isAuthorized}
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
              disabled={!isAuthorized}
            ></textarea>
          </div>
          
          <div className="flex items-center">
            <input
              id="track-opens"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={!isAuthorized}
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
              disabled={!isAuthorized}
            />
            <label htmlFor="track-clicks" className="ml-2 block text-sm text-gray-700">
              Track link clicks
            </label>
          </div>
          
          <button
            className={`mt-2 px-4 py-2 rounded-md ${
              isAuthorized 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isAuthorized}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default GmailIntegration;
import React, { useState } from 'react';
import { Sliders, User, Bell, Shield, Database, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useContactStore } from '../store/contactStore';
import { useTemplateStore } from '../store/templateStore';
import { useCampaignStore } from '../store/campaignStore';
import { useEmailStore } from '../store/emailStore';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { contacts } = useContactStore();
  const { templates } = useTemplateStore();
  const { campaigns } = useCampaignStore();
  const { emailLogs } = useEmailStore();

  const handleExportData = () => {
    const exportData = {
      contacts,
      templates,
      campaigns,
      emailLogs,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cold-email-crm-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data exported successfully!');
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared. Refresh the page to see changes.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left ${
                  activeTab === 'general' 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <Sliders className={`${
                  activeTab === 'general' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-5 w-5`} />
                <span className="truncate">General</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <User className={`${
                  activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-5 w-5`} />
                <span className="truncate">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <Bell className={`${
                  activeTab === 'notifications' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-5 w-5`} />
                <span className="truncate">Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left ${
                  activeTab === 'security' 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <Shield className={`${
                  activeTab === 'security' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-5 w-5`} />
                <span className="truncate">Security</span>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full text-left ${
                  activeTab === 'data' 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <Database className={`${
                  activeTab === 'data' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-5 w-5`} />
                <span className="truncate">Data Management</span>
              </button>
            </nav>
          </div>
          
          <div className="col-span-2">
            {activeTab === 'general' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CRM Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Cold Email CRM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select
                      defaultValue="America/New_York"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      defaultValue="MM/DD/YYYY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="auto-follow-up"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auto-follow-up" className="ml-2 block text-sm text-gray-700">
                      Enable automatic follow-ups
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <h4 className="text-md font-medium text-blue-800 mb-2">Data Persistence</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Your data is automatically saved in your browser's local storage. This means your data will persist even when you close the browser or refresh the page.
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Clearing your browser cache or using private/incognito mode will delete this data. For long-term storage, please export your data regularly.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                      <Download className="h-5 w-5 mr-2 text-gray-600" />
                      Export Data
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Export all your CRM data as a JSON file for backup or migration purposes.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Export All Data
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                      <Trash2 className="h-5 w-5 mr-2 text-red-600" />
                      Clear Data
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Clear all data stored in your browser. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleClearAllData}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Clear All Data
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">Current Data Summary</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Contacts: {contacts.length}</li>
                        <li>Email Templates: {templates.length}</li>
                        <li>Campaigns: {campaigns.length}</li>
                        <li>Email Logs: {emailLogs.length}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
                <p className="text-gray-500">Profile settings will be available in a future update.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <p className="text-gray-500">Notification settings will be available in a future update.</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <p className="text-gray-500">Security settings will be available in a future update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
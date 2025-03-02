import React from 'react';
import { Sliders, User, Bell, Shield, Database } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <nav className="space-y-1">
              <a
                href="#general"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <Sliders className="text-blue-500 mr-3 flex-shrink-0 h-5 w-5" />
                <span className="truncate">General</span>
              </a>
              <a
                href="#profile"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <User className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
                <span className="truncate">Profile</span>
              </a>
              <a
                href="#notifications"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <Bell className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
                <span className="truncate">Notifications</span>
              </a>
              <a
                href="#security"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <Shield className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
                <span className="truncate">Security</span>
              </a>
              <a
                href="#data"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <Database className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
                <span className="truncate">Data Management</span>
              </a>
            </nav>
          </div>
          
          <div className="col-span-2">
            <div id="general">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
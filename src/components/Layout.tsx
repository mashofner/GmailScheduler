import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, Mail, BarChart2, Settings, FileText, Send } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <Send className="mr-2 h-5 w-5 text-blue-600" />
            Cold Email CRM
          </h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/"
                className={`flex items-center px-4 py-3 ${
                  isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart2 className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/contacts"
                className={`flex items-center px-4 py-3 ${
                  isActive('/contacts') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Contacts
              </Link>
            </li>
            <li>
              <Link
                to="/campaigns"
                className={`flex items-center px-4 py-3 ${
                  isActive('/campaigns') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Send className="mr-3 h-5 w-5" />
                Campaigns
              </Link>
            </li>
            <li>
              <Link
                to="/templates"
                className={`flex items-center px-4 py-3 ${
                  isActive('/templates') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Templates
              </Link>
            </li>
            <li>
              <Link
                to="/email"
                className={`flex items-center px-4 py-3 ${
                  isActive('/email') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mail className="mr-3 h-5 w-5" />
                Email
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center px-4 py-3 ${
                  isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/contacts' && 'Contacts'}
              {location.pathname === '/campaigns' && 'Campaigns'}
              {location.pathname === '/templates' && 'Email Templates'}
              {location.pathname === '/email' && 'Email Integration'}
              {location.pathname === '/settings' && 'Settings'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
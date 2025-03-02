import React from 'react';
import { useContactStore } from '../store/contactStore';
import { useCampaignStore } from '../store/campaignStore';
import { useTemplateStore } from '../store/templateStore';
import { useEmailStore } from '../store/emailStore';
import { Users, Mail, FileText, Send, BarChart2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { contacts } = useContactStore();
  const { campaigns } = useCampaignStore();
  const { templates } = useTemplateStore();
  const { emailLogs } = useEmailStore();
  
  // Calculate stats
  const totalContacts = contacts.length;
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalTemplates = templates.length;
  const totalEmailsSent = emailLogs.length;
  const emailsOpened = emailLogs.filter((log) => log.status === 'opened').length;
  const emailsReplied = emailLogs.filter((log) => log.status === 'replied').length;
  
  const openRate = totalEmailsSent > 0 ? Math.round((emailsOpened / totalEmailsSent) * 100) : 0;
  const replyRate = totalEmailsSent > 0 ? Math.round((emailsReplied / totalEmailsSent) * 100) : 0;
  
  // Recent activity (would be from email logs in a real app)
  const recentActivity = [
    { type: 'email_sent', contact: 'John Doe', time: '2 hours ago' },
    { type: 'email_opened', contact: 'Sarah Smith', time: '3 hours ago' },
    { type: 'email_replied', contact: 'Michael Johnson', time: '5 hours ago' },
    { type: 'contact_added', contact: 'Emily Brown', time: '1 day ago' },
    { type: 'campaign_started', campaign: 'Q2 Outreach', time: '2 days ago' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Contacts</p>
              <p className="text-2xl font-semibold text-gray-900">{totalContacts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Send className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">{activeCampaigns}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Mail className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Emails Sent</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEmailsSent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reply Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{replyRate}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/contacts"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Import Contacts</p>
              <p className="text-sm text-gray-500">Add contacts from CSV or Google Sheets</p>
            </div>
          </Link>
          
          <Link
            to="/templates"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Create Template</p>
              <p className="text-sm text-gray-500">Design a new email template</p>
            </div>
          </Link>
          
          <Link
            to="/campaigns"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Send className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Start Campaign</p>
              <p className="text-sm text-gray-500">Launch a new email campaign</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div key={index} className="px-6 py-4 flex items-start">
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-full ${
                  activity.type === 'email_sent' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'email_opened' ? 'bg-green-100 text-green-600' :
                  activity.type === 'email_replied' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'contact_added' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  {activity.type === 'email_sent' && <Send className="h-4 w-4" />}
                  {activity.type === 'email_opened' && <Mail className="h-4 w-4" />}
                  {activity.type === 'email_replied' && <Mail className="h-4 w-4" />}
                  {activity.type === 'contact_added' && <Users className="h-4 w-4" />}
                  {activity.type === 'campaign_started' && <Send className="h-4 w-4" />}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">
                  {activity.type === 'email_sent' && `Email sent to ${activity.contact}`}
                  {activity.type === 'email_opened' && `${activity.contact} opened your email`}
                  {activity.type === 'email_replied' && `${activity.contact} replied to your email`}
                  {activity.type === 'contact_added' && `Added ${activity.contact} to contacts`}
                  {activity.type === 'campaign_started' && `Campaign "${activity.campaign}" started`}
                </p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
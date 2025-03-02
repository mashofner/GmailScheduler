import React, { useState } from 'react';
import { useCampaignStore } from '../store/campaignStore';
import { useTemplateStore } from '../store/templateStore';
import { Campaign } from '../types';
import { Edit, Trash2, Play, Pause, Users, Calendar, FileText } from 'lucide-react';
import CampaignForm from './CampaignForm';
import { format } from 'date-fns';

const CampaignList: React.FC = () => {
  const { campaigns, updateCampaign, deleteCampaign } = useCampaignStore();
  const { getTemplateById } = useTemplateStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>(undefined);
  
  const handleEdit = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setIsEditing(true);
  };
  
  const handleCreate = () => {
    setCurrentCampaign(undefined);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    setCurrentCampaign(undefined);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCampaign(undefined);
  };
  
  const toggleCampaignStatus = (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaign(campaign.id, { status: newStatus });
  };
  
  if (isEditing) {
    return (
      <CampaignForm
        campaign={currentCampaign}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Email Campaigns</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
          <Play className="h-4 w-4 mr-1" />
          New Campaign
        </button>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No campaigns yet. Create your first campaign to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {campaigns.map((campaign) => {
            const template = getTemplateById(campaign.templateId);
            
            return (
              <div key={campaign.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-md font-medium text-gray-900">{campaign.name}</h3>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        campaign.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    {campaign.description && (
                      <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>{campaign.contacts.length} contacts</span>
                      </div>
                      {campaign.startDate && (
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Starts: {format(new Date(campaign.startDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {template && (
                        <div className="flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          <span>Template: {template.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`${
                        campaign.status === 'active'
                          ? 'text-yellow-600 hover:text-yellow-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                      onClick={() => toggleCampaignStatus(campaign)}
                    >
                      {campaign.status === 'active' ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Campaign"
                      onClick={() => handleEdit(campaign)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Delete Campaign"
                      onClick={() => deleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
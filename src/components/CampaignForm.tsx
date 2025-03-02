import React, { useState } from 'react';
import { useCampaignStore } from '../store/campaignStore';
import { useContactStore } from '../store/contactStore';
import { useTemplateStore } from '../store/templateStore';
import { Campaign } from '../types';
import { Calendar, Users, FileText } from 'lucide-react';

interface CampaignFormProps {
  campaign?: Campaign;
  onSave: () => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaign,
  onSave,
  onCancel,
}) => {
  const { addCampaign, updateCampaign } = useCampaignStore();
  const { contacts } = useContactStore();
  const { templates } = useTemplateStore();
  
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [templateId, setTemplateId] = useState(campaign?.templateId || '');
  const [selectedContacts, setSelectedContacts] = useState<string[]>(campaign?.contacts || []);
  const [startDate, setStartDate] = useState(campaign?.startDate || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (campaign) {
      updateCampaign(campaign.id, {
        name,
        description,
        templateId,
        contacts: selectedContacts,
        startDate,
      });
    } else {
      addCampaign({
        name,
        description,
        templateId,
        contacts: selectedContacts,
        status: 'draft',
        startDate,
      });
    }
    
    onSave();
  };
  
  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((contact) => contact.id));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        {campaign ? 'Edit Campaign' : 'Create Campaign'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Q2 Outreach"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief description of this campaign"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            Email Template
          </label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {templates.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              No templates available. Please create a template first.
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Select Contacts ({selectedContacts.length} selected)
          </label>
          
          <div className="mb-2 flex justify-between items-center">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedContacts.length === contacts.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-gray-500">
              {contacts.length} contacts available
            </span>
          </div>
          
          <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No contacts available. Please add contacts first.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <li key={contact.id} className="p-3 hover:bg-gray-50">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleContactToggle(contact.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">
                          {contact.firstName} {contact.lastName}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {contact.email} • {contact.company}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={templates.length === 0 || contacts.length === 0 || selectedContacts.length === 0}
          >
            {campaign ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
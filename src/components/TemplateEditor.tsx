import React, { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { EmailTemplate } from '../types';

interface TemplateEditorProps {
  template?: EmailTemplate;
  onSave: () => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const { addTemplate, updateTemplate } = useTemplateStore();
  
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [body, setBody] = useState(template?.body || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (template) {
      updateTemplate(template.id, { name, subject, body });
    } else {
      addTemplate({ name, subject, body });
    }
    
    onSave();
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        {template ? 'Edit Template' : 'Create Template'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Initial Outreach"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E.g., Opportunity to collaborate with {{company}}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Body
          </label>
          <div className="mb-2 text-sm text-gray-500">
            Use variables like {{firstName}}, {{lastName}}, {{company}}, etc.
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="Dear {{firstName}},

I hope this email finds you well. I recently came across {{company}} and was impressed by your work in...

Best regards,
Your Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
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
          >
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateEditor;
import React, { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { EmailTemplate } from '../types';
import { Edit, Trash2, Copy, Plus } from 'lucide-react';
import TemplateEditor from './TemplateEditor';
import { format } from 'date-fns';

const TemplateList: React.FC = () => {
  const { templates, deleteTemplate } = useTemplateStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | undefined>(undefined);
  
  const handleEdit = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };
  
  const handleCreate = () => {
    setCurrentTemplate(undefined);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    setCurrentTemplate(undefined);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentTemplate(undefined);
  };
  
  if (isEditing) {
    return (
      <TemplateEditor
        template={currentTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Email Templates</h2>
        <button
          onClick={handleCreate}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </button>
      </div>
      
      {templates.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No templates yet. Create your first template to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {templates.map((template) => (
            <div key={template.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-md font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Subject: {template.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {format(new Date(template.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    title="Duplicate Template"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Template"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    title="Delete Template"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
                  {template.body.substring(0, 150)}
                  {template.body.length > 150 && '...'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
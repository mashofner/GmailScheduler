import React from 'react';
import { useContactStore } from '../store/contactStore';
import { useEmailStore } from '../store/emailStore';
import { Contact, EmailLog } from '../types';
import { format } from 'date-fns';
import { Mail, Phone, Building, Briefcase, Tag, Clock, Edit, Trash2, Send } from 'lucide-react';

interface ContactDetailProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  onSendEmail: () => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({
  contact,
  onEdit,
  onDelete,
  onSendEmail,
}) => {
  const { getEmailLogsByContact } = useEmailStore();
  const emailLogs = getEmailLogsByContact(contact.id);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Contact Details</h2>
        <div className="flex space-x-2">
          <button
            onClick={onSendEmail}
            className="p-1.5 text-blue-600 hover:text-blue-900"
            title="Send Email"
          >
            <Send className="h-5 w-5" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-indigo-600 hover:text-indigo-900"
            title="Edit Contact"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:text-red-900"
            title="Delete Contact"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600">
            {contact.firstName.charAt(0)}
            {contact.lastName.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-gray-600">{contact.position}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Contact Information
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-900">{contact.email}</span>
              </li>
              {contact.phone && (
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-gray-900">{contact.phone}</span>
                </li>
              )}
              <li className="flex items-start">
                <Building className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-900">{contact.company}</span>
              </li>
              <li className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-900">{contact.position}</span>
              </li>
            </ul>
            
            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {contact.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </h4>
                <p className="text-gray-700 whitespace-pre-line">{contact.notes}</p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Activity
            </h4>
            
            <div className="flex items-center mb-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                contact.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                contact.status === 'replied' ? 'bg-green-100 text-green-800' :
                contact.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                'bg-red-100 text-red-800'
              }`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </div>
              
              <div className="ml-3 text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Added {format(new Date(contact.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
            
            {contact.lastContacted && (
              <div className="mb-4 text-sm text-gray-500">
                Last contacted: {format(new Date(contact.lastContacted), 'MMM d, yyyy')}
              </div>
            )}
            
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Email History
            </h4>
            
            {emailLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No emails sent yet</p>
            ) : (
              <div className="space-y-3">
                {emailLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{log.subject}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(log.sentAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        log.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        log.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                        log.status === 'opened' ? 'bg-green-100 text-green-800' :
                        log.status === 'clicked' ? 'bg-indigo-100 text-indigo-800' :
                        log.status === 'replied' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
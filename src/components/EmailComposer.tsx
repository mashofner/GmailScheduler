import React, { useState, useEffect } from 'react';
import { useContactStore } from '../store/contactStore';
import { useTemplateStore } from '../store/templateStore';
import { useEmailStore } from '../store/emailStore';
import { parseTemplate, sendEmail, checkGmailAuth } from '../utils/emailUtils';
import { Contact } from '../types';
import { Send, FileText, User, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface EmailComposerProps {
  contactId?: string;
  onClose?: () => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ contactId, onClose }) => {
  const { contacts } = useContactStore();
  const { templates } = useTemplateStore();
  const { addEmailLog } = useEmailStore();
  
  const [selectedContactId, setSelectedContactId] = useState(contactId || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGmailAuthorized, setIsGmailAuthorized] = useState(false);
  
  // Get the selected contact
  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  
  // Check Gmail authorization on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthorized = await checkGmailAuth();
      setIsGmailAuthorized(isAuthorized);
    };
    
    checkAuth();
  }, []);
  
  // Update subject and body when template changes
  useEffect(() => {
    if (selectedTemplateId && selectedContact) {
      const template = templates.find((t) => t.id === selectedTemplateId);
      if (template) {
        setSubject(parseTemplate(template.subject, selectedContact));
        setBody(parseTemplate(template.body, selectedContact));
      }
    }
  }, [selectedTemplateId, selectedContact, templates]);
  
  const handleContactChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContactId(e.target.value);
  };
  
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplateId(e.target.value);
  };
  
  const handleSendEmail = async () => {
    if (!selectedContact) return;
    
    if (!isGmailAuthorized) {
      toast.error('Please connect to Gmail first to send emails');
      return;
    }
    
    try {
      setIsSending(true);
      
      // Send the email
      const result = await sendEmail(selectedContact.email, subject, body);
      
      if (result.success) {
        // Log the email
        const now = new Date().toISOString();
        addEmailLog({
          contactId: selectedContact.id,
          templateId: selectedTemplateId,
          subject,
          body,
          status: 'sent',
          sentAt: now,
        });
        
        // Update contact's last contacted date
        // In a real app, you would update the contact here
        
        toast.success(`Email sent to ${selectedContact.firstName} ${selectedContact.lastName}`);
        
        // Clear the form or close it
        if (onClose) {
          onClose();
        } else {
          setSelectedContactId('');
          setSelectedTemplateId('');
          setSubject('');
          setBody('');
        }
      } else {
        toast.error(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('An error occurred while sending the email');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Send className="mr-2 h-5 w-5 text-blue-600" />
        Compose Email
      </h2>
      
      {!isGmailAuthorized && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-700">
              Gmail account not connected. Please connect your Gmail account in the Gmail Integration tab to send emails.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <User className="mr-1 h-4 w-4" />
            Recipient
          </label>
          <select
            value={selectedContactId}
            onChange={handleContactChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!contactId}
          >
            <option value="">Select a contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.firstName} {contact.lastName} ({contact.email})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            Template
          </label>
          <select
            value={selectedTemplateId}
            onChange={handleTemplateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a template or compose custom email</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email subject"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your message here..."
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={!selectedContactId || !subject || !body || isSending || !isGmailAuthorized}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              !selectedContactId || !subject || !body || isSending || !isGmailAuthorized
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
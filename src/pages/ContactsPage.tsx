import React, { useState } from 'react';
import ContactList from '../components/ContactList';
import ContactImport from '../components/ContactImport';
import ContactForm from '../components/ContactForm';
import ContactDetail from '../components/ContactDetail';
import EmailComposer from '../components/EmailComposer';
import { useContactStore } from '../store/contactStore';
import { Contact } from '../types';
import { Plus, Upload } from 'lucide-react';

const ContactsPage: React.FC = () => {
  const { contacts, deleteContact } = useContactStore();
  const [showImport, setShowImport] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const handleAddContact = () => {
    setShowAddForm(true);
    setShowImport(false);
    setShowDetail(false);
    setShowEditForm(false);
    setShowEmailComposer(false);
  };
  
  const handleImportContacts = () => {
    setShowImport(true);
    setShowAddForm(false);
    setShowDetail(false);
    setShowEditForm(false);
    setShowEmailComposer(false);
  };
  
  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetail(true);
    setShowAddForm(false);
    setShowImport(false);
    setShowEditForm(false);
    setShowEmailComposer(false);
  };
  
  const handleEditContact = () => {
    setShowEditForm(true);
    setShowDetail(false);
    setShowAddForm(false);
    setShowImport(false);
    setShowEmailComposer(false);
  };
  
  const handleDeleteContact = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id);
      setSelectedContact(null);
      setShowDetail(false);
    }
  };
  
  const handleSendEmail = () => {
    setShowEmailComposer(true);
    setShowDetail(false);
    setShowEditForm(false);
    setShowAddForm(false);
    setShowImport(false);
  };
  
  const handleFormSave = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetail(selectedContact !== null);
  };
  
  const handleFormCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDetail(selectedContact !== null);
  };
  
  const handleEmailSent = () => {
    setShowEmailComposer(false);
    setShowDetail(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleAddContact}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </button>
        <button
          onClick={handleImportContacts}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
        >
          <Upload className="h-4 w-4 mr-1" />
          Import Contacts
        </button>
      </div>
      
      {showImport && (
        <ContactImport />
      )}
      
      {showAddForm && (
        <ContactForm
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
      
      {showEditForm && selectedContact && (
        <ContactForm
          contact={selectedContact}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
      
      {showDetail && selectedContact && (
        <ContactDetail
          contact={selectedContact}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onSendEmail={handleSendEmail}
        />
      )}
      
      {showEmailComposer && selectedContact && (
        <EmailComposer
          contactId={selectedContact.id}
          onClose={() => setShowEmailComposer(false)}
        />
      )}
      
      {!showAddForm && !showEditForm && !showDetail && !showEmailComposer && (
        <ContactList onViewContact={handleViewContact} />
      )}
    </div>
  );
};

export default ContactsPage;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact } from '../types';
import { v4 } from '../utils/uuid';

interface ContactState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => Contact | null;
  deleteContact: (id: string) => void;
  importContacts: (contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]) => ImportResult;
}

interface ImportResult {
  success: boolean;
  count: number;
  errors?: string[];
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      isLoading: false,
      error: null,
      
      addContact: (contactData) => {
        const now = new Date().toISOString();
        const newContact: Contact = {
          id: v4(),
          ...contactData,
          status: contactData.status || 'new',
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
        
        return newContact;
      },
      
      updateContact: (id, contactData) => {
        let updatedContact: Contact | null = null;
        
        set((state) => {
          const contacts = state.contacts.map((contact) => {
            if (contact.id === id) {
              updatedContact = {
                ...contact,
                ...contactData,
                updatedAt: new Date().toISOString(),
              };
              return updatedContact;
            }
            return contact;
          });
          
          return { contacts };
        });
        
        return updatedContact;
      },
      
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
      },
      
      importContacts: (contactsData) => {
        const now = new Date().toISOString();
        const errors: string[] = [];
        const validContacts: Contact[] = [];
        
        contactsData.forEach((contactData, index) => {
          if (!contactData.email) {
            errors.push(`Row ${index + 1}: Missing email address`);
            return;
          }
          
          // Check for duplicate emails
          const isDuplicate = get().contacts.some(
            (c) => c.email.toLowerCase() === contactData.email.toLowerCase()
          );
          
          if (isDuplicate) {
            errors.push(`Row ${index + 1}: Duplicate email address - ${contactData.email}`);
            return;
          }
          
          const newContact: Contact = {
            id: v4(),
            ...contactData,
            status: 'new',
            createdAt: now,
            updatedAt: now,
          };
          
          validContacts.push(newContact);
        });
        
        set((state) => ({
          contacts: [...state.contacts, ...validContacts],
        }));
        
        return {
          success: validContacts.length > 0,
          count: validContacts.length,
          errors: errors.length > 0 ? errors : undefined,
        };
      },
    }),
    {
      name: 'cold-email-crm-contacts',
    }
  )
);
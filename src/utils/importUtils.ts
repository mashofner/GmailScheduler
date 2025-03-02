import Papa from 'papaparse';
import { Contact } from '../types';

interface ParsedContact {
  [key: string]: string;
}

export const parseCSV = (file: File): Promise<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const contacts = mapContactsFromParsed(results.data as ParsedContact[]);
          resolve(contacts);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const mapContactsFromParsed = (
  parsedData: ParsedContact[]
): Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return parsedData.map((row) => {
    // Map CSV columns to contact fields
    // This handles different possible column names from Google Sheets
    const contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: row['First Name'] || row['FirstName'] || row['first_name'] || row['firstName'] || '',
      lastName: row['Last Name'] || row['LastName'] || row['last_name'] || row['lastName'] || '',
      email: row['Email'] || row['email'] || row['Email Address'] || row['email_address'] || '',
      company: row['Company'] || row['company'] || row['Organization'] || row['organization'] || '',
      position: row['Position'] || row['position'] || row['Title'] || row['title'] || row['Job Title'] || row['job_title'] || '',
      phone: row['Phone'] || row['phone'] || row['Phone Number'] || row['phone_number'] || '',
      status: 'new',
      notes: row['Notes'] || row['notes'] || '',
      tags: row['Tags'] || row['tags'] ? (row['Tags'] || row['tags']).split(',').map((tag: string) => tag.trim()) : [],
    };
    
    return contact;
  });
};

export const parseGoogleSheet = async (url: string): Promise<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]> => {
  try {
    // For demo purposes, we'll simulate importing contacts
    // In a real app, you would fetch the actual Google Sheet
    console.log('Simulating import from Google Sheet URL:', url);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate some sample contacts
    const sampleContacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Acme Inc',
        position: 'Marketing Director',
        status: 'new',
        tags: ['lead', 'marketing']
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        company: 'Tech Solutions',
        position: 'CEO',
        status: 'new',
        tags: ['decision-maker', 'tech']
      },
      {
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@example.com',
        company: 'Global Services',
        position: 'Sales Manager',
        status: 'new',
        tags: ['sales', 'manager']
      },
      {
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emily.brown@example.com',
        company: 'Creative Design',
        position: 'Art Director',
        status: 'new',
        tags: ['creative', 'design']
      },
      {
        firstName: 'Michael',
        lastName: 'Wilson',
        email: 'michael.wilson@example.com',
        company: 'Data Analytics',
        position: 'Data Scientist',
        status: 'new',
        tags: ['tech', 'analytics']
      }
    ];
    
    return sampleContacts;
  } catch (error) {
    console.error('Error parsing Google Sheet:', error);
    throw error;
  }
};
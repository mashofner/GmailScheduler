export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  phone?: string;
  status: 'new' | 'contacted' | 'replied' | 'converted' | 'rejected';
  lastContacted?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  contacts: string[]; // Contact IDs
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  dailyLimit: number;
  createdAt: string;
  updatedAt: string;
  useGmailScheduling?: boolean;
}

export interface EmailLog {
  id: string;
  contactId: string;
  campaignId?: string;
  templateId: string;
  subject: string;
  body: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced';
  sentAt: string;
  openedAt?: string;
  repliedAt?: string;
  gmailMessageId?: string;
  scheduledFor?: string;
}

export interface ImportResult {
  success: boolean;
  count: number;
  errors?: string[];
}

// Add Gmail API types
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: any) => Promise<void>;
        gmail: {
          users: {
            drafts: {
              create: (params: any) => Promise<any>;
              send: (params: any) => Promise<any>;
            };
            messages: {
              send: (params: any) => Promise<any>;
            };
            getProfile: (params: any) => Promise<any>;
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          signIn: () => Promise<void>;
          currentUser: {
            get: () => {
              getBasicProfile: () => {
                getName: () => string;
              } | null;
            };
          };
        };
      };
    };
  }
}
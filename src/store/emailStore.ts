import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailLog } from '../types';
import { v4 } from '../utils/uuid';

interface EmailState {
  emailLogs: EmailLog[];
  isLoading: boolean;
  error: string | null;
  addEmailLog: (log: Omit<EmailLog, 'id'>) => EmailLog;
  updateEmailStatus: (id: string, status: EmailLog['status'], timestamp?: string) => EmailLog | null;
  getEmailLogsByContact: (contactId: string) => EmailLog[];
  getEmailLogsByCampaign: (campaignId: string) => EmailLog[];
}

export const useEmailStore = create<EmailState>()(
  persist(
    (set, get) => ({
      emailLogs: [],
      isLoading: false,
      error: null,
      
      addEmailLog: (logData) => {
        const newLog: EmailLog = {
          id: v4(),
          ...logData,
        };
        
        set((state) => ({
          emailLogs: [...state.emailLogs, newLog],
        }));
        
        return newLog;
      },
      
      updateEmailStatus: (id, status, timestamp) => {
        let updatedLog: EmailLog | null = null;
        const now = timestamp || new Date().toISOString();
        
        set((state) => {
          const emailLogs = state.emailLogs.map((log) => {
            if (log.id === id) {
              updatedLog = {
                ...log,
                status,
                ...(status === 'opened' && { openedAt: now }),
                ...(status === 'replied' && { repliedAt: now }),
              };
              return updatedLog;
            }
            return log;
          });
          
          return { emailLogs };
        });
        
        return updatedLog;
      },
      
      getEmailLogsByContact: (contactId) => {
        return get().emailLogs.filter((log) => log.contactId === contactId);
      },
      
      getEmailLogsByCampaign: (campaignId) => {
        return get().emailLogs.filter((log) => log.campaignId === campaignId);
      },
    }),
    {
      name: 'cold-email-crm-email-logs',
    }
  )
);
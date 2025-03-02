import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailTemplate } from '../types';
import { v4 } from '../utils/uuid';

interface TemplateState {
  templates: EmailTemplate[];
  isLoading: boolean;
  error: string | null;
  addTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => EmailTemplate;
  updateTemplate: (id: string, template: Partial<EmailTemplate>) => EmailTemplate | null;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => EmailTemplate | undefined;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      isLoading: false,
      error: null,
      
      addTemplate: (templateData) => {
        const now = new Date().toISOString();
        const newTemplate: EmailTemplate = {
          id: v4(),
          ...templateData,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
        
        return newTemplate;
      },
      
      updateTemplate: (id, templateData) => {
        let updatedTemplate: EmailTemplate | null = null;
        
        set((state) => {
          const templates = state.templates.map((template) => {
            if (template.id === id) {
              updatedTemplate = {
                ...template,
                ...templateData,
                updatedAt: new Date().toISOString(),
              };
              return updatedTemplate;
            }
            return template;
          });
          
          return { templates };
        });
        
        return updatedTemplate;
      },
      
      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },
      
      getTemplateById: (id) => {
        return get().templates.find((template) => template.id === id);
      },
    }),
    {
      name: 'cold-email-crm-templates',
    }
  )
);
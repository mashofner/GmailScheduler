import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign } from '../types';
import { v4 } from '../utils/uuid';

interface CampaignState {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Campaign;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => Campaign | null;
  deleteCampaign: (id: string) => void;
  getCampaignById: (id: string) => Campaign | undefined;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      isLoading: false,
      error: null,
      
      addCampaign: (campaignData) => {
        const now = new Date().toISOString();
        const newCampaign: Campaign = {
          id: v4(),
          ...campaignData,
          dailyLimit: campaignData.dailyLimit || 25,
          status: campaignData.status || 'draft',
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          campaigns: [...state.campaigns, newCampaign],
        }));
        
        return newCampaign;
      },
      
      updateCampaign: (id, campaignData) => {
        let updatedCampaign: Campaign | null = null;
        
        set((state) => {
          const campaigns = state.campaigns.map((campaign) => {
            if (campaign.id === id) {
              updatedCampaign = {
                ...campaign,
                ...campaignData,
                updatedAt: new Date().toISOString(),
              };
              return updatedCampaign;
            }
            return campaign;
          });
          
          return { campaigns };
        });
        
        return updatedCampaign;
      },
      
      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        }));
      },
      
      getCampaignById: (id) => {
        return get().campaigns.find((campaign) => campaign.id === id);
      },
    }),
    {
      name: 'cold-email-crm-campaigns',
    }
  )
);
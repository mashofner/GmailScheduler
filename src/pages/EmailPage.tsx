import React, { useState } from 'react';
import EmailIntegration from '../components/EmailIntegration';
import EmailComposer from '../components/EmailComposer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const EmailPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Email</h2>
        </div>
        
        <div className="p-4">
          <Tabs defaultValue="compose">
            <TabsList className="mb-4">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose">
              <EmailComposer />
            </TabsContent>
            
            <TabsContent value="integration">
              <EmailIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
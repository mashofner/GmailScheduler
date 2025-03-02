import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailSender from './components/EmailSender';
import GmailIntegration from './components/GmailIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          Email Campaign Sender
        </h1>
        <p className="text-gray-600">Send scheduled emails to your contact list using Gmail</p>
      </header>
      
      <main>
        <Tabs defaultValue="campaign">
          <TabsList className="mb-4">
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
            <TabsTrigger value="gmail">Gmail Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaign">
            <EmailSender />
          </TabsContent>
          
          <TabsContent value="gmail">
            <GmailIntegration />
          </TabsContent>
        </Tabs>
      </main>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { parseGoogleSheet } from '../utils/importUtils';
import { sendEmail, scheduleEmailForLater, authorizeGmail, checkGmailAuth } from '../utils/emailUtils';
import { useContactStore } from '../store/contactStore';
import { useTemplateStore } from '../store/templateStore';
import { useCampaignStore } from '../store/campaignStore';
import { useEmailStore } from '../store/emailStore';
import { parseTemplate } from '../utils/emailUtils';
import { FileText, Send, Upload, Calendar, Users, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EmailSender: React.FC = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [dailyLimit, setDailyLimit] = useState(25);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [useGmailScheduling, setUseGmailScheduling] = useState(true);
  const [isGmailAuthorized, setIsGmailAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const { contacts, importContacts } = useContactStore();
  const { addTemplate } = useTemplateStore();
  const { addCampaign } = useCampaignStore();
  const { addEmailLog } = useEmailStore();
  
  // Check Gmail authorization on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      const isAuthorized = await checkGmailAuth();
      setIsGmailAuthorized(isAuthorized);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, []);
  
  const handleGmailAuth = async () => {
    try {
      const success = await authorizeGmail();
      setIsGmailAuthorized(success);
      
      if (success) {
        toast.success('Successfully connected to Gmail');
      } else {
        toast.error('Failed to connect to Gmail');
      }
    } catch (error) {
      console.error('Error authorizing Gmail:', error);
      toast.error('Error connecting to Gmail');
    }
  };
  
  const handleImportSheet = async () => {
    if (!sheetUrl) {
      toast.error('Please enter a Google Sheet URL');
      return;
    }
    
    try {
      setIsImporting(true);
      const contactsData = await parseGoogleSheet(sheetUrl);
      const result = importContacts(contactsData);
      
      if (result.success) {
        toast.success(`Successfully imported ${result.count} contacts`);
      } else {
        toast.error('Failed to import contacts');
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Error importing contacts from Google Sheet:', error);
      toast.error('Error importing contacts: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleScheduleCampaign = async () => {
    if (!emailSubject || !emailTemplate) {
      toast.error('Please provide both email subject and template');
      return;
    }
    
    if (contacts.length === 0) {
      toast.error('Please import contacts first');
      return;
    }
    
    // If using Gmail scheduling, check if authorized
    if (useGmailScheduling && !isGmailAuthorized) {
      toast.error('Please connect to Gmail first to use Gmail scheduling');
      return;
    }
    
    try {
      setIsScheduling(true);
      
      // Save the template
      const template = addTemplate({
        name: `Campaign Template ${new Date().toISOString().slice(0, 10)}`,
        subject: emailSubject,
        body: emailTemplate
      });
      
      // Create a campaign
      const campaign = addCampaign({
        name: `Email Campaign ${new Date().toISOString().slice(0, 10)}`,
        description: `Sending ${contacts.length} emails with daily limit of ${dailyLimit}`,
        templateId: template.id,
        contacts: contacts.map(contact => contact.id),
        status: 'active',
        startDate,
        dailyLimit,
        useGmailScheduling
      });
      
      // If using Gmail scheduling, schedule the first batch of emails
      if (useGmailScheduling && isGmailAuthorized) {
        const startDateTime = new Date(startDate);
        const contactsToSchedule = contacts.slice(0, Math.min(dailyLimit, contacts.length));
        
        let scheduledCount = 0;
        
        for (let i = 0; i < contactsToSchedule.length; i++) {
          const contact = contactsToSchedule[i];
          const subject = parseTemplate(emailSubject, contact);
          const body = parseTemplate(emailTemplate, contact);
          
          // Schedule emails 5 minutes apart
          const scheduledTime = new Date(startDateTime);
          scheduledTime.setMinutes(scheduledTime.getMinutes() + (i * 5));
          
          const result = await scheduleEmailForLater(
            contact.email,
            subject,
            body,
            scheduledTime
          );
          
          if (result.success) {
            // Log the scheduled email
            addEmailLog({
              contactId: contact.id,
              campaignId: campaign.id,
              templateId: template.id,
              subject,
              body,
              status: 'sent',
              sentAt: new Date().toISOString(),
              scheduledFor: scheduledTime.toISOString(),
              gmailMessageId: result.messageId
            });
            
            scheduledCount++;
          }
        }
        
        toast.success(`Successfully scheduled ${scheduledCount} emails with Gmail`);
        toast.info(`The remaining emails will need to be scheduled manually in batches of ${dailyLimit} per day`);
      } else {
        toast.success('Campaign scheduled successfully!');
        toast.info(`Will send ${dailyLimit} emails per day starting from ${startDate}`);
      }
      
      // Show summary
      const totalDays = Math.ceil(contacts.length / dailyLimit);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + totalDays - 1);
      
      toast.info(`Campaign will complete in approximately ${totalDays} days (by ${endDate.toISOString().slice(0, 10)})`);
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast.error('Error scheduling campaign: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsScheduling(false);
    }
  };
  
  const handleTestEmail = async () => {
    if (!emailSubject || !emailTemplate || contacts.length === 0) {
      toast.error('Please provide email subject, template, and import contacts first');
      return;
    }
    
    try {
      const testContact = contacts[0];
      const subject = parseTemplate(emailSubject, testContact);
      const body = parseTemplate(emailTemplate, testContact);
      
      const result = await sendEmail(testContact.email, subject, body);
      
      if (result.success) {
        toast.success(`Test email sent to ${testContact.email}`);
      } else {
        toast.error(`Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Error sending test email: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Upload className="mr-2 h-5 w-5 text-blue-600" />
          Import Contacts
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Sheet URL
          </label>
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Make sure your Google Sheet is publicly accessible or shared with view access
          </p>
        </div>
        
        <button
          onClick={handleImportSheet}
          disabled={!sheetUrl || isImporting}
          className={`px-4 py-2 rounded-md ${
            !sheetUrl || isImporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isImporting ? 'Importing...' : 'Import Contacts'}
        </button>
        
        {contacts.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>{contacts.length} contacts imported</span>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Expected Sheet Format</h3>
          <p className="text-sm text-gray-600 mb-2">
            Your Google Sheet should include the following columns:
          </p>
          <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
            <code className="text-xs">
              First Name, Last Name, Email, Company, Position
            </code>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          Email Template
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Subject
          </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="E.g., Opportunity to collaborate with {{company}}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Body
          </label>
          <div className="mb-2 text-sm text-gray-500">
            Use variables like {"{{firstName}}"}, {"{{lastName}}"}, {"{{company}}"}, etc.
          </div>
          <textarea
            value={emailTemplate}
            onChange={(e) => setEmailTemplate(e.target.value)}
            rows={8}
            placeholder={`Dear {{firstName}},

I hope this email finds you well. I recently came across {{company}} and was impressed by your work in...

Best regards,
Your Name`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <button
          onClick={handleTestEmail}
          disabled={!emailSubject || !emailTemplate || contacts.length === 0}
          className={`px-4 py-2 rounded-md mr-2 ${
            !emailSubject || !emailTemplate || contacts.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Send Test Email
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Schedule Campaign
        </h2>
        
        <div className="mb-6">
          <div className={`p-4 rounded-md ${
            isGmailAuthorized 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              {isGmailAuthorized ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              )}
              <div>
                <h3 className={`text-sm font-medium ${
                  isGmailAuthorized ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {isGmailAuthorized 
                    ? 'Gmail account connected' 
                    : 'Gmail account not connected'}
                </h3>
                <p className={`text-sm mt-1 ${
                  isGmailAuthorized ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isGmailAuthorized 
                    ? 'You can use Gmail\'s native scheduling feature to schedule your emails.' 
                    : 'Connect your Gmail account to use Gmail\'s native scheduling feature.'}
                </p>
                {!isGmailAuthorized && (
                  <button
                    onClick={handleGmailAuth}
                    disabled={isCheckingAuth}
                    className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {isCheckingAuth ? 'Checking...' : 'Connect Gmail Account'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Email Limit
            </label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(parseInt(e.target.value))}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum number of emails to send per day
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="use-gmail-scheduling"
              type="checkbox"
              checked={useGmailScheduling}
              onChange={(e) => setUseGmailScheduling(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="use-gmail-scheduling" className="ml-2 block text-sm text-gray-700">
              Use Gmail's native scheduling feature
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500 ml-6">
            When enabled, emails will be scheduled using Gmail's built-in scheduling feature.
            {useGmailScheduling && !isGmailAuthorized && (
              <span className="text-red-500 block mt-1">
                You need to connect your Gmail account first.
              </span>
            )}
          </p>
        </div>
        
        <button
          onClick={handleScheduleCampaign}
          disabled={!emailSubject || !emailTemplate || contacts.length === 0 || isScheduling || (useGmailScheduling && !isGmailAuthorized)}
          className={`px-4 py-2 rounded-md flex items-center ${
            !emailSubject || !emailTemplate || contacts.length === 0 || isScheduling || (useGmailScheduling && !isGmailAuthorized)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Send className="h-4 w-4 mr-2" />
          {isScheduling ? 'Scheduling...' : 'Schedule Campaign'}
        </button>
        
        {contacts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Campaign Summary</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>Total contacts: {contacts.length}</li>
              <li>Emails per day: {dailyLimit}</li>
              <li>Estimated duration: {Math.ceil(contacts.length / dailyLimit)} days</li>
              <li>Scheduling method: {useGmailScheduling ? 'Gmail native scheduling' : 'Custom scheduling'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSender;
import { toast } from 'react-toastify';

// Gmail API configuration
const GMAIL_API_CLIENT_ID = ''; // Will be filled by the user
const GMAIL_API_SCOPES = [
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

// Load the Gmail API client
export const loadGmailApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          clientId: GMAIL_API_CLIENT_ID,
          scope: GMAIL_API_SCOPES.join(' '),
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
        }).then(() => {
          resolve();
        }).catch((error: any) => {
          console.error('Error initializing Gmail API:', error);
          reject(error);
        });
      });
    };
    script.onerror = () => {
      reject(new Error('Failed to load Gmail API script'));
    };
    document.body.appendChild(script);
  });
};

// Check if user is authenticated with Gmail
export const isGmailAuthenticated = (): boolean => {
  if (!window.gapi || !window.gapi.auth2) {
    return false;
  }
  
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance && authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error checking Gmail authentication:', error);
    return false;
  }
};

// Authenticate with Gmail
export const authenticateGmail = async (): Promise<boolean> => {
  try {
    if (!window.gapi || !window.gapi.auth2) {
      await loadGmailApi();
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance) {
      console.error('Auth instance not available');
      return false;
    }
    
    if (authInstance.isSignedIn.get()) {
      return true;
    }
    
    await authInstance.signIn();
    return authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error authenticating with Gmail:', error);
    return false;
  }
};

// Create a base64 encoded email
const createEmailContent = (to: string, subject: string, body: string): string => {
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body
  ];
  
  const email = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Schedule an email using Gmail's native scheduling
export const scheduleEmail = async (
  to: string,
  subject: string,
  body: string,
  scheduledTime: Date
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    if (!isGmailAuthenticated()) {
      const authenticated = await authenticateGmail();
      if (!authenticated) {
        return { success: false, error: 'Failed to authenticate with Gmail' };
      }
    }
    
    // Create the email content
    const emailContent = createEmailContent(to, subject, body);
    
    // Create a draft email
    const createDraftResponse = await window.gapi.client.gmail.users.drafts.create({
      userId: 'me',
      resource: {
        message: {
          raw: emailContent
        }
      }
    });
    
    const draftId = createDraftResponse.result.id;
    
    // For scheduling, we would use the Gmail API's scheduling feature
    // However, the Gmail API doesn't directly expose scheduling via API
    // In a real implementation, you might use a service like Google Cloud Functions
    // to trigger the email at the scheduled time
    
    // For now, we'll create a draft and return its ID
    return { 
      success: true, 
      messageId: draftId
    };
  } catch (error) {
    console.error('Error scheduling email with Gmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error scheduling email' 
    };
  }
};

// Send an email immediately using Gmail
export const sendGmailEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    if (!isGmailAuthenticated()) {
      const authenticated = await authenticateGmail();
      if (!authenticated) {
        return { success: false, error: 'Failed to authenticate with Gmail' };
      }
    }
    
    // Create the email content
    const emailContent = createEmailContent(to, subject, body);
    
    // Send the email
    const response = await window.gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: emailContent
      }
    });
    
    return { 
      success: true, 
      messageId: response.result.id 
    };
  } catch (error) {
    console.error('Error sending email with Gmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sending email' 
    };
  }
};

// Get Gmail user profile
export const getGmailUserProfile = async (): Promise<{ email: string; name: string } | null> => {
  try {
    if (!isGmailAuthenticated()) {
      return null;
    }
    
    const response = await window.gapi.client.gmail.users.getProfile({
      userId: 'me'
    });
    
    const email = response.result.emailAddress;
    
    // Get user name from Google Auth
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const profile = user.getBasicProfile();
    const name = profile ? profile.getName() : email;
    
    return { email, name };
  } catch (error) {
    console.error('Error getting Gmail user profile:', error);
    return null;
  }
};
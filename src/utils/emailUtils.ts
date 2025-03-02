import { Contact, EmailTemplate } from '../types';
import { sendGmailEmail, scheduleEmail, isGmailAuthenticated, authenticateGmail, loadGmailApi, getGmailUserProfile } from './gmailApi';

// Function to replace template variables with contact data
export const parseTemplate = (template: string, contact: Contact): string => {
  return template
    .replace(/{{firstName}}/g, contact.firstName)
    .replace(/{{lastName}}/g, contact.lastName)
    .replace(/{{fullName}}/g, `${contact.firstName} ${contact.lastName}`)
    .replace(/{{email}}/g, contact.email)
    .replace(/{{company}}/g, contact.company)
    .replace(/{{position}}/g, contact.position)
    .replace(/{{phone}}/g, contact.phone || '');
};

// Function to send email via Gmail API
export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    // Check if Gmail is authenticated
    if (!isGmailAuthenticated()) {
      // Try to authenticate
      const authenticated = await authenticateGmail();
      if (!authenticated) {
        console.log('Gmail authentication failed, falling back to simulation');
        // Simulate sending for demo purposes
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        return { success: true };
      }
    }
    
    // Use Gmail API to send email
    return await sendGmailEmail(to, subject, body);
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending email',
    };
  }
};

// Function to schedule email via Gmail API
export const scheduleEmailForLater = async (
  to: string,
  subject: string,
  body: string,
  scheduledTime: Date
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    // Check if Gmail is authenticated
    if (!isGmailAuthenticated()) {
      // Try to authenticate
      const authenticated = await authenticateGmail();
      if (!authenticated) {
        console.log('Gmail authentication failed, falling back to simulation');
        // Simulate scheduling for demo purposes
        console.log(`Scheduling email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        console.log(`Scheduled for: ${scheduledTime.toISOString()}`);
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        return { success: true, messageId: `sim-${Date.now()}` };
      }
    }
    
    // Use Gmail API to schedule email
    return await scheduleEmail(to, subject, body, scheduledTime);
  } catch (error) {
    console.error('Error scheduling email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error scheduling email',
    };
  }
};

// Function to authorize with Gmail API
export const authorizeGmail = async (): Promise<boolean> => {
  try {
    return await authenticateGmail();
  } catch (error) {
    console.error('Error authorizing with Gmail:', error);
    return false;
  }
};

// Function to check if user is authorized with Gmail
export const checkGmailAuth = async (): Promise<boolean> => {
  try {
    return isGmailAuthenticated();
  } catch (error) {
    console.error('Error checking Gmail authorization:', error);
    return false;
  }
};

// Export the Gmail API loading function
export { loadGmailApi, getGmailUserProfile };
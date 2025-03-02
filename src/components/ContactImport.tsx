import React, { useState } from 'react';
import { parseCSV, parseGoogleSheet } from '../utils/importUtils';
import { useContactStore } from '../store/contactStore';
import { ImportResult } from '../types';
import { Upload, Link2, AlertCircle, CheckCircle } from 'lucide-react';

const ContactImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importMethod, setImportMethod] = useState<'file' | 'sheet'>('file');
  
  const { importContacts } = useContactStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSheetUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSheetUrl(e.target.value);
  };
  
  const handleImportFile = async () => {
    if (!file) return;
    
    try {
      setIsImporting(true);
      const contacts = await parseCSV(file);
      const result = importContacts(contacts);
      setImportResult(result);
    } catch (error) {
      console.error('Error importing contacts:', error);
      setImportResult({
        success: false,
        count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error importing contacts'],
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleImportSheet = async () => {
    if (!sheetUrl) return;
    
    try {
      setIsImporting(true);
      const contacts = await parseGoogleSheet(sheetUrl);
      const result = importContacts(contacts);
      setImportResult(result);
    } catch (error) {
      console.error('Error importing contacts from Google Sheet:', error);
      setImportResult({
        success: false,
        count: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error importing contacts'],
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Import Contacts</h2>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              importMethod === 'file'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setImportMethod('file')}
          >
            <Upload className="inline-block mr-2 h-4 w-4" />
            Upload CSV
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              importMethod === 'sheet'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setImportMethod('sheet')}
          >
            <Link2 className="inline-block mr-2 h-4 w-4" />
            Google Sheet
          </button>
        </div>
        
        {importMethod === 'file' ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <button
              onClick={handleImportFile}
              disabled={!file || isImporting}
              className={`px-4 py-2 rounded-md ${
                !file || isImporting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isImporting ? 'Importing...' : 'Import Contacts'}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Sheet URL
              </label>
              <input
                type="text"
                value={sheetUrl}
                onChange={handleSheetUrlChange}
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
          </div>
        )}
      </div>
      
      {importResult && (
        <div className={`mt-4 p-4 rounded-md ${
          importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            {importResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <div>
              <h3 className={`text-sm font-medium ${
                importResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {importResult.success
                  ? `Successfully imported ${importResult.count} contacts`
                  : 'Import failed'}
              </h3>
              
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-700 font-medium">Errors:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm text-red-700">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Expected CSV Format</h3>
        <p className="text-sm text-gray-600 mb-2">
          Your CSV file should include the following columns:
        </p>
        <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
          <code className="text-xs">
            First Name,Last Name,Email,Company,Position,Phone,Notes,Tags
          </code>
        </div>
      </div>
    </div>
  );
};

export default ContactImport;
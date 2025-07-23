// Test script to verify PDF extraction works with the Hebrew PDF
import { createClient } from '@blinkdotnew/sdk';
import fs from 'fs';

const blink = createClient({
  projectId: 'pdf-to-podcast-web-app-can7ww85',
  authRequired: false
});

async function testPDFExtraction() {
  try {
    console.log('Testing PDF extraction...');
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync('test_pdf.pdf');
    const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
    
    console.log('PDF file size:', pdfBuffer.length, 'bytes');
    
    // Extract text using Blink SDK
    const extractedText = await blink.data.extractFromBlob(pdfBlob);
    
    console.log('Extraction successful!');
    console.log('Extracted text length:', extractedText.length, 'characters');
    console.log('First 200 characters:', extractedText.substring(0, 200));
    console.log('Contains Hebrew text:', /[\u0590-\u05FF]/.test(extractedText));
    
    return extractedText;
  } catch (error) {
    console.error('PDF extraction failed:', error);
    throw error;
  }
}

testPDFExtraction().catch(console.error);
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PodcastConfig } from '@/types/podcast';
import { blink } from '@/blink/client';

interface PDFUploadStepProps {
  config: PodcastConfig;
  updateConfig: (updates: Partial<PodcastConfig>) => void;
  onNext: () => void;
}

export function PDFUploadStep({ config, updateConfig, onNext }: PDFUploadStepProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      updateConfig({
        processingStatus: {
          ...config.processingStatus,
          errors: ['Please upload a valid PDF file']
        }
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      updateConfig({
        processingStatus: {
          ...config.processingStatus,
          errors: ['File size must be less than 50MB']
        }
      });
      return;
    }

    setIsExtracting(true);
    setExtractionProgress(0);
    setValidationStatus('validating');

    // Clear any previous errors
    updateConfig({
      processingStatus: {
        ...config.processingStatus,
        errors: []
      }
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Extract text from PDF using Blink SDK
      const extractedText = await blink.data.extractFromBlob(file);
      
      clearInterval(progressInterval);
      setExtractionProgress(100);

      // Validate extracted text
      if (!extractedText || typeof extractedText !== 'string') {
        throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
      }

      if (extractedText.trim().length < 50) {
        throw new Error('PDF appears to contain very little text content. Please ensure your PDF has readable text.');
      }

      // Update config with successful extraction
      updateConfig({
        pdfFile: file,
        pdfText: extractedText,
        processingStatus: {
          ...config.processingStatus,
          validations: {
            ...config.processingStatus.validations,
            pdfExtracted: true
          },
          errors: []
        }
      });

      setValidationStatus('success');
      
      // Auto-advance after a brief delay
      setTimeout(() => {
        onNext();
      }, 1500);

    } catch (error) {
      console.error('PDF extraction failed:', error);
      setValidationStatus('error');
      
      let errorMessage = 'Failed to extract text from PDF';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      updateConfig({
        processingStatus: {
          ...config.processingStatus,
          validations: {
            ...config.processingStatus.validations,
            pdfExtracted: false
          },
          errors: [errorMessage]
        }
      });
    } finally {
      setIsExtracting(false);
    }
  }, [config, updateConfig, onNext]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isExtracting
  });

  const canProceed = config.pdfFile && config.pdfText && config.processingStatus.validations.pdfExtracted;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Upload PDF Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : isExtracting
                ? 'border-slate-300 bg-slate-50 cursor-not-allowed'
                : 'border-slate-300 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            
            {isExtracting ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Extracting text from PDF...</p>
                  <Progress value={extractionProgress} className="max-w-xs mx-auto" />
                  <p className="text-sm text-slate-600">
                    {extractionProgress < 30 ? 'Reading document structure...' :
                     extractionProgress < 60 ? 'Extracting text content...' :
                     extractionProgress < 90 ? 'Validating content...' :
                     'Finalizing extraction...'}
                  </p>
                </div>
              </div>
            ) : config.pdfFile ? (
              <div className="space-y-4">
                {validationStatus === 'success' ? (
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                ) : validationStatus === 'error' ? (
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                ) : (
                  <FileText className="w-12 h-12 text-primary mx-auto" />
                )}
                <div>
                  <p className="text-lg font-medium">{config.pdfFile.name}</p>
                  <p className="text-sm text-slate-600">
                    {(config.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {config.pdfText && (
                    <p className="text-sm text-slate-600 mt-2">
                      Extracted {config.pdfText.length.toLocaleString()} characters
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
                  </p>
                  <p className="text-sm text-slate-600">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Supports PDF files up to 50MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {config.processingStatus.errors.length > 0 && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{config.processingStatus.errors[0]}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    updateConfig({
                      pdfFile: null,
                      pdfText: '',
                      processingStatus: {
                        ...config.processingStatus,
                        errors: [],
                        validations: {
                          ...config.processingStatus.validations,
                          pdfExtracted: false
                        }
                      }
                    });
                    setValidationStatus('idle');
                  }}
                  className="ml-4"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {validationStatus === 'success' && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                PDF successfully processed! The text has been extracted and validated.
                Proceeding to voice configuration...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Manual proceed button (in case auto-advance doesn't work) */}
      {canProceed && validationStatus !== 'success' && (
        <div className="flex justify-end">
          <Button onClick={onNext} className="px-8">
            Continue to Voice Selection
          </Button>
        </div>
      )}
    </div>
  );
}
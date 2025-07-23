import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { PodcastConfig, ProcessingStatus } from '@/types/podcast';
import { PDFUploadStep } from './steps/PDFUploadStep';
import { VoiceConfigStep } from './steps/VoiceConfigStep';
import { SponsorshipStep } from './steps/SponsorshipStep';
import { PersonalVoiceStep } from './steps/PersonalVoiceStep';
import { ProcessingStep } from './steps/ProcessingStep';
import { CompletionStep } from './steps/CompletionStep';

const STEPS = [
  { id: 'upload', title: 'Upload PDF', description: 'Upload and validate your PDF document' },
  { id: 'configure', title: 'Voice & Language', description: 'Select language and narrator voice' },
  { id: 'sponsorship', title: 'Sponsorships', description: 'Add sponsorship segments (optional)' },
  { id: 'voice', title: 'Personal Voice', description: 'Upload your voice sample (optional)' },
  { id: 'processing', title: 'Processing', description: 'Generate your podcast' },
  { id: 'complete', title: 'Download', description: 'Download your MP3 podcast' }
];

export function PodcastWizard() {
  const [config, setConfig] = useState<PodcastConfig>({
    pdfFile: null,
    pdfText: '',
    language: 'english',
    narratorVoice: '',
    sponsorships: [],
    personalVoice: null,
    processingStatus: {
      step: 'upload',
      progress: 0,
      validations: {
        pdfExtracted: false,
        textToSpeechReady: false,
        audioSegmentsReady: false,
        mp3Generated: false
      },
      errors: []
    }
  });

  const currentStepIndex = STEPS.findIndex(step => step.id === config.processingStatus.step);
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateConfig = (updates: Partial<PodcastConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const nextIndex = Math.min(currentStepIndex + 1, STEPS.length - 1);
    const nextStep = STEPS[nextIndex];
    updateConfig({
      processingStatus: {
        ...config.processingStatus,
        step: nextStep.id as ProcessingStatus['step']
      }
    });
  };

  const prevStep = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    const prevStep = STEPS[prevIndex];
    updateConfig({
      processingStatus: {
        ...config.processingStatus,
        step: prevStep.id as ProcessingStatus['step']
      }
    });
  };

  const renderStepContent = () => {
    switch (config.processingStatus.step) {
      case 'upload':
        return <PDFUploadStep config={config} updateConfig={updateConfig} onNext={nextStep} />;
      case 'configure':
        return <VoiceConfigStep config={config} updateConfig={updateConfig} onNext={nextStep} onPrev={prevStep} />;
      case 'sponsorship':
        return <SponsorshipStep config={config} updateConfig={updateConfig} onNext={nextStep} onPrev={prevStep} />;
      case 'voice':
        return <PersonalVoiceStep config={config} updateConfig={updateConfig} onNext={nextStep} onPrev={prevStep} />;
      case 'processing':
        return <ProcessingStep config={config} updateConfig={updateConfig} onNext={nextStep} />;
      case 'complete':
        return <CompletionStep config={config} updateConfig={updateConfig} onRestart={() => {
          setConfig({
            pdfFile: null,
            pdfText: '',
            language: 'english',
            narratorVoice: '',
            sponsorships: [],
            personalVoice: null,
            processingStatus: {
              step: 'upload',
              progress: 0,
              validations: {
                pdfExtracted: false,
                textToSpeechReady: false,
                audioSegmentsReady: false,
                mp3Generated: false
              },
              errors: []
            }
          });
        }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            PDF to Podcast Converter
          </h1>
          <p className="text-lg text-slate-600">
            Transform your documents into engaging audio content
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl">Progress</CardTitle>
              <Badge variant="outline" className="text-sm">
                Step {currentStepIndex + 1} of {STEPS.length}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const hasError = config.processingStatus.errors.length > 0 && isActive;

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/10 border-2 border-primary'
                        : isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="mb-2">
                      {hasError ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <h3 className={`font-medium text-sm ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-700' : 'text-slate-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="animate-fade-in-up">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
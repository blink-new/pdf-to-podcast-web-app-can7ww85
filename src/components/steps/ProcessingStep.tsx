import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, Radio } from 'lucide-react';
import { PodcastConfig } from '@/types/podcast';

interface ProcessingStepProps {
  config: PodcastConfig;
  updateConfig: (updates: Partial<PodcastConfig>) => void;
  onNext: () => void;
}

interface ProcessingStage {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export function ProcessingStep({ config, updateConfig, onNext }: ProcessingStepProps) {
  const [stages, setStages] = useState<ProcessingStage[]>([
    {
      id: 'text-analysis',
      title: 'Analyzing PDF Content',
      description: 'Processing and validating extracted text',
      status: 'pending',
      progress: 0
    },
    {
      id: 'voice-synthesis',
      title: 'Generating Speech',
      description: 'Converting text to speech with selected voice',
      status: 'pending',
      progress: 0
    },
    {
      id: 'sponsorship-integration',
      title: 'Adding Sponsorships',
      description: 'Integrating sponsorship segments',
      status: 'pending',
      progress: 0
    },
    {
      id: 'personal-voice',
      title: 'Processing Personal Voice',
      description: 'Cloning voice and generating questions',
      status: 'pending',
      progress: 0
    },
    {
      id: 'audio-mixing',
      title: 'Mixing Audio Segments',
      description: 'Combining all audio elements',
      status: 'pending',
      progress: 0
    },
    {
      id: 'mp3-generation',
      title: 'Generating Final MP3',
      description: 'Creating downloadable podcast file',
      status: 'pending',
      progress: 0
    }
  ]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const getStageProcessingTime = (stageId: string): number => {
    // Simulate different processing times for different stages
    switch (stageId) {
      case 'text-analysis': return 2000;
      case 'voice-synthesis': return 5000;
      case 'sponsorship-integration': return 1500;
      case 'personal-voice': return 4000;
      case 'audio-mixing': return 3000;
      case 'mp3-generation': return 2500;
      default: return 2000;
    }
  };

  const updateValidationStatus = useCallback((stageId: string) => {
    const validations = { ...config.processingStatus.validations };
    
    switch (stageId) {
      case 'text-analysis':
        validations.pdfExtracted = true;
        break;
      case 'voice-synthesis':
        validations.textToSpeechReady = true;
        break;
      case 'audio-mixing':
        validations.audioSegmentsReady = true;
        break;
      case 'mp3-generation':
        validations.mp3Generated = true;
        break;
    }

    updateConfig({
      processingStatus: {
        ...config.processingStatus,
        validations,
        progress: overallProgress
      }
    });
  }, [config.processingStatus, overallProgress, updateConfig]);

  const processStage = useCallback(async (stage: ProcessingStage, onProgress: (progress: number) => void): Promise<void> => {
    const duration = getStageProcessingTime(stage.id);
    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      onProgress((i / steps) * 100);
    }
  }, []);

  const processStages = useCallback(async () => {
    const stagesToProcess = [...stages];
    
    // Skip personal voice stage if not configured
    if (!config.personalVoice) {
      stagesToProcess[3].status = 'completed';
      stagesToProcess[3].progress = 100;
    }

    // Skip sponsorship stage if no sponsorships
    if (config.sponsorships.length === 0) {
      stagesToProcess[2].status = 'completed';
      stagesToProcess[2].progress = 100;
    }

    for (let i = 0; i < stagesToProcess.length; i++) {
      setCurrentStageIndex(i);
      
      // Update stage to processing
      stagesToProcess[i].status = 'processing';
      setStages([...stagesToProcess]);

      try {
        // Simulate processing with progress updates
        await processStage(stagesToProcess[i], (progress) => {
          stagesToProcess[i].progress = progress;
          setStages([...stagesToProcess]);
          
          // Update overall progress
          const completedStages = stagesToProcess.slice(0, i).reduce((sum, stage) => sum + 100, 0);
          const currentStageProgress = progress;
          const totalProgress = (completedStages + currentStageProgress) / stagesToProcess.length;
          setOverallProgress(totalProgress);
        });

        // Mark stage as completed
        stagesToProcess[i].status = 'completed';
        stagesToProcess[i].progress = 100;
        setStages([...stagesToProcess]);

        // Update validation status
        updateValidationStatus(stagesToProcess[i].id);

      } catch (error) {
        stagesToProcess[i].status = 'error';
        setStages([...stagesToProcess]);
        
        updateConfig({
          processingStatus: {
            ...config.processingStatus,
            errors: [...config.processingStatus.errors, `Failed at stage: ${stagesToProcess[i].title}`]
          }
        });
        return;
      }
    }

    // All stages completed
    setOverallProgress(100);
    setTimeout(() => {
      onNext();
    }, 2000);
  }, [stages, config.personalVoice, config.sponsorships, config.processingStatus, updateValidationStatus, updateConfig, onNext, processStage]);

  useEffect(() => {
    // Start processing automatically
    processStages();
  }, [processStages]);

  const getStageIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Processing Your Podcast
          </CardTitle>
          <p className="text-sm text-slate-600">
            Please wait while we generate your podcast. This may take a few minutes.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-slate-600">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Processing Stages */}
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  stage.status === 'processing'
                    ? 'border-primary bg-primary/5'
                    : stage.status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : stage.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="shrink-0">
                  {getStageIcon(stage)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${
                      stage.status === 'processing' ? 'text-primary' :
                      stage.status === 'completed' ? 'text-green-700' :
                      stage.status === 'error' ? 'text-red-700' :
                      'text-slate-700'
                    }`}>
                      {stage.title}
                    </h3>
                    {stage.status === 'processing' && (
                      <span className="text-sm text-slate-600">{Math.round(stage.progress)}%</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{stage.description}</p>
                  
                  {stage.status === 'processing' && (
                    <Progress value={stage.progress} className="h-1" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Validation Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg text-center ${
              config.processingStatus.validations.pdfExtracted
                ? 'bg-green-50 border border-green-200'
                : 'bg-slate-50 border border-slate-200'
            }`}>
              <CheckCircle className={`w-5 h-5 mx-auto mb-1 ${
                config.processingStatus.validations.pdfExtracted ? 'text-green-500' : 'text-slate-400'
              }`} />
              <p className="text-xs font-medium">PDF Extracted</p>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${
              config.processingStatus.validations.textToSpeechReady
                ? 'bg-green-50 border border-green-200'
                : 'bg-slate-50 border border-slate-200'
            }`}>
              <CheckCircle className={`w-5 h-5 mx-auto mb-1 ${
                config.processingStatus.validations.textToSpeechReady ? 'text-green-500' : 'text-slate-400'
              }`} />
              <p className="text-xs font-medium">Speech Ready</p>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${
              config.processingStatus.validations.audioSegmentsReady
                ? 'bg-green-50 border border-green-200'
                : 'bg-slate-50 border border-slate-200'
            }`}>
              <CheckCircle className={`w-5 h-5 mx-auto mb-1 ${
                config.processingStatus.validations.audioSegmentsReady ? 'text-green-500' : 'text-slate-400'
              }`} />
              <p className="text-xs font-medium">Audio Mixed</p>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${
              config.processingStatus.validations.mp3Generated
                ? 'bg-green-50 border border-green-200'
                : 'bg-slate-50 border border-slate-200'
            }`}>
              <CheckCircle className={`w-5 h-5 mx-auto mb-1 ${
                config.processingStatus.validations.mp3Generated ? 'text-green-500' : 'text-slate-400'
              }`} />
              <p className="text-xs font-medium">MP3 Generated</p>
            </div>
          </div>

          {/* Error Display */}
          {config.processingStatus.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Processing Error:</strong>
                <ul className="list-disc list-inside mt-1">
                  {config.processingStatus.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
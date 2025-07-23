import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Mic, Upload, User, MessageCircle, Info, CheckCircle } from 'lucide-react';
import { PodcastConfig, PersonalVoice } from '@/types/podcast';

interface PersonalVoiceStepProps {
  config: PodcastConfig;
  updateConfig: (updates: Partial<PodcastConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PersonalVoiceStep({ config, updateConfig, onNext, onPrev }: PersonalVoiceStepProps) {
  const [selectedRole, setSelectedRole] = useState<'interviewer' | 'narrator' | 'host'>('interviewer');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const generateInterviewQuestions = async (pdfText: string): Promise<string[]> => {
    // Simulate AI question generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock questions based on content type
    const mockQuestions = [
      "Can you tell us more about the main topic discussed in this document?",
      "What are the key insights that readers should take away?",
      "How does this information impact the current understanding of the subject?",
      "What questions might readers have after going through this content?",
      "Are there any practical applications of these concepts?"
    ];

    return mockQuestions.slice(0, 3); // Return 3 questions
  };

  const handleVoiceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }

    const personalVoice: PersonalVoice = {
      audioFile: file,
      role: selectedRole,
      generatedQuestions: []
    };

    // If interviewer role, generate questions based on PDF content
    if (selectedRole === 'interviewer' && config.pdfText) {
      setIsGeneratingQuestions(true);
      try {
        // In a real implementation, this would use AI to generate questions
        const questions = await generateInterviewQuestions(config.pdfText);
        personalVoice.generatedQuestions = questions;
      } catch (error) {
        console.error('Failed to generate questions:', error);
      } finally {
        setIsGeneratingQuestions(false);
      }
    }

    updateConfig({ personalVoice });
  };

  const removePersonalVoice = () => {
    updateConfig({ personalVoice: null });
  };

  const skipPersonalVoice = () => {
    updateConfig({ personalVoice: null });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Personal Voice Integration
          </CardTitle>
          <p className="text-sm text-slate-600">
            Add your own voice to create a more engaging podcast experience (optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!config.personalVoice ? (
            <>
              {/* Role Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Select Your Role</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === 'interviewer'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedRole('interviewer')}
                  >
                    <MessageCircle className="w-8 h-8 text-primary mb-2" />
                    <h3 className="font-medium mb-1">Interviewer</h3>
                    <p className="text-sm text-slate-600">
                      Ask AI-generated questions based on the PDF content
                    </p>
                    <Badge className="mt-2" variant="secondary">Recommended</Badge>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === 'narrator'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedRole('narrator')}
                  >
                    <User className="w-8 h-8 text-primary mb-2" />
                    <h3 className="font-medium mb-1">Co-Narrator</h3>
                    <p className="text-sm text-slate-600">
                      Share narration duties with the AI voice
                    </p>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === 'host'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedRole('host')}
                  >
                    <Mic className="w-8 h-8 text-primary mb-2" />
                    <h3 className="font-medium mb-1">Host</h3>
                    <p className="text-sm text-slate-600">
                      Introduce segments and provide commentary
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Upload */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Upload Voice Sample</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="voice-upload"
                    accept="audio/*"
                    onChange={handleVoiceUpload}
                    className="hidden"
                  />
                  <Label htmlFor="voice-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Upload Your Voice Sample</p>
                    <p className="text-sm text-slate-600 mb-2">
                      Upload a clear audio recording of your voice (30 seconds - 2 minutes recommended)
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports MP3, WAV, M4A files • Max 10MB
                    </p>
                  </Label>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tips for best results:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Record in a quiet environment</li>
                      <li>Speak clearly and at a natural pace</li>
                      <li>Include varied sentences and emotions</li>
                      <li>Minimum 30 seconds, maximum 2 minutes</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </>
          ) : (
            /* Voice Uploaded */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Voice Sample Uploaded</p>
                    <p className="text-sm text-green-700">
                      Role: {config.personalVoice.role.charAt(0).toUpperCase() + config.personalVoice.role.slice(1)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={removePersonalVoice}>
                  Remove
                </Button>
              </div>

              {/* Generated Questions (for interviewer role) */}
              {config.personalVoice.role === 'interviewer' && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">AI-Generated Interview Questions</Label>
                  {isGeneratingQuestions ? (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Generating questions based on your PDF content...</p>
                    </div>
                  ) : config.personalVoice.generatedQuestions && config.personalVoice.generatedQuestions.length > 0 ? (
                    <div className="space-y-2">
                      {config.personalVoice.generatedQuestions.map((question, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm font-medium">Q{index + 1}:</p>
                          <p className="text-sm text-slate-700">{question}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Questions will be generated during processing.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back to Sponsorships
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={skipPersonalVoice}>
            Skip Personal Voice
          </Button>
          <Button onClick={onNext} className="px-8">
            Continue to Processing
          </Button>
        </div>
      </div>
    </div>
  );
}
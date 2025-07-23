import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, Languages } from 'lucide-react';
import { PodcastConfig, VoiceOption } from '@/types/podcast';

interface VoiceConfigStepProps {
  config: PodcastConfig;
  updateConfig: (updates: Partial<PodcastConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const VOICE_OPTIONS: VoiceOption[] = [
  // English voices
  { id: 'en-male-1', name: 'David', gender: 'male', language: 'english', description: 'Professional, warm tone' },
  { id: 'en-male-2', name: 'Michael', gender: 'male', language: 'english', description: 'Deep, authoritative voice' },
  { id: 'en-male-3', name: 'James', gender: 'male', language: 'english', description: 'Friendly, conversational' },
  { id: 'en-female-1', name: 'Sarah', gender: 'female', language: 'english', description: 'Clear, engaging tone' },
  { id: 'en-female-2', name: 'Emma', gender: 'female', language: 'english', description: 'Sophisticated, professional' },
  { id: 'en-female-3', name: 'Lisa', gender: 'female', language: 'english', description: 'Warm, storytelling voice' },
  
  // Hebrew voices
  { id: 'he-male-1', name: 'אבי', gender: 'male', language: 'hebrew', description: 'קול מקצועי וחם' },
  { id: 'he-male-2', name: 'דני', gender: 'male', language: 'hebrew', description: 'קול עמוק וסמכותי' },
  { id: 'he-male-3', name: 'יוסי', gender: 'male', language: 'hebrew', description: 'קול ידידותי ושיחתי' },
  { id: 'he-female-1', name: 'מיכל', gender: 'female', language: 'hebrew', description: 'קול ברור ומעניין' },
  { id: 'he-female-2', name: 'רונית', gender: 'female', language: 'hebrew', description: 'קול מתוחכם ומקצועי' },
  { id: 'he-female-3', name: 'שירה', gender: 'female', language: 'hebrew', description: 'קול חם לסיפור' },
];

export function VoiceConfigStep({ config, updateConfig, onNext, onPrev }: VoiceConfigStepProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const handleLanguageChange = (language: 'hebrew' | 'english') => {
    updateConfig({
      language,
      narratorVoice: '' // Reset voice selection when language changes
    });
  };

  const handleVoiceChange = (voiceId: string) => {
    updateConfig({ narratorVoice: voiceId });
  };

  const playVoicePreview = (voiceId: string) => {
    // In a real implementation, this would play a voice sample
    setPlayingVoice(voiceId);
    setTimeout(() => setPlayingVoice(null), 3000); // Simulate 3-second preview
  };

  const filteredVoices = VOICE_OPTIONS.filter(voice => voice.language === config.language);
  const canProceed = config.language && config.narratorVoice;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Language & Voice Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={config.language} onValueChange={handleLanguageChange} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Language</Label>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="english" className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  English
                </TabsTrigger>
                <TabsTrigger value="hebrew" className="flex items-center gap-2">
                  <span>🇮🇱</span>
                  עברית
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="english" className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-medium">Choose English Voice</Label>
                <RadioGroup value={config.narratorVoice} onValueChange={handleVoiceChange}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVoices.map((voice) => (
                      <div key={voice.id} className="relative">
                        <Label
                          htmlFor={voice.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            config.narratorVoice === voice.id
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <RadioGroupItem value={voice.id} id={voice.id} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{voice.name}</span>
                              <Badge variant={voice.gender === 'male' ? 'default' : 'secondary'}>
                                {voice.gender}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{voice.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              playVoicePreview(voice.id);
                            }}
                            className="shrink-0"
                          >
                            {playingVoice === voice.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="hebrew" className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-medium">בחר קול עברי</Label>
                <RadioGroup value={config.narratorVoice} onValueChange={handleVoiceChange}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVoices.map((voice) => (
                      <div key={voice.id} className="relative">
                        <Label
                          htmlFor={voice.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            config.narratorVoice === voice.id
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <RadioGroupItem value={voice.id} id={voice.id} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{voice.name}</span>
                              <Badge variant={voice.gender === 'male' ? 'default' : 'secondary'}>
                                {voice.gender === 'male' ? 'זכר' : 'נקבה'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{voice.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              playVoicePreview(voice.id);
                            }}
                            className="shrink-0"
                          >
                            {playingVoice === voice.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>

          {config.narratorVoice && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Voice Selected: {VOICE_OPTIONS.find(v => v.id === config.narratorVoice)?.name}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your podcast will be narrated in {config.language === 'hebrew' ? 'Hebrew' : 'English'} 
                using this voice.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back to Upload
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="px-8">
          Continue to Sponsorships
        </Button>
      </div>
    </div>
  );
}
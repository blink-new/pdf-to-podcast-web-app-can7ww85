import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Upload, Play, DollarSign } from 'lucide-react';
import { PodcastConfig, Sponsorship } from '@/types/podcast';

interface SponsorshipStepProps {
  config: PodcastConfig;
  updateConfig: (updates: Partial<PodcastConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SponsorshipStep({ config, updateConfig, onNext, onPrev }: SponsorshipStepProps) {
  const [newSponsorship, setNewSponsorship] = useState<Partial<Sponsorship>>({
    type: 'text',
    position: 'beginning',
    content: '',
    voice: config.narratorVoice
  });

  const addSponsorship = () => {
    if (!newSponsorship.content) return;

    const sponsorship: Sponsorship = {
      id: Date.now().toString(),
      type: newSponsorship.type as 'text' | 'audio',
      content: newSponsorship.content,
      position: newSponsorship.position as any,
      customPosition: newSponsorship.customPosition,
      voice: newSponsorship.voice || config.narratorVoice
    };

    updateConfig({
      sponsorships: [...config.sponsorships, sponsorship]
    });

    // Reset form
    setNewSponsorship({
      type: 'text',
      position: 'beginning',
      content: '',
      voice: config.narratorVoice
    });
  };

  const removeSponsorship = (id: string) => {
    updateConfig({
      sponsorships: config.sponsorships.filter(s => s.id !== id)
    });
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload this to storage
      const audioUrl = URL.createObjectURL(file);
      setNewSponsorship(prev => ({ ...prev, content: audioUrl }));
    }
  };

  const getPositionLabel = (position: string, customPosition?: number) => {
    switch (position) {
      case 'beginning': return 'Beginning';
      case 'middle': return 'Middle';
      case 'end': return 'End';
      case 'custom': return `${customPosition}% through`;
      default: return position;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Sponsorship Configuration
          </CardTitle>
          <p className="text-sm text-slate-600">
            Add sponsorship segments to your podcast (optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Sponsorships */}
          {config.sponsorships.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Current Sponsorships</Label>
              <div className="space-y-3">
                {config.sponsorships.map((sponsorship) => (
                  <div key={sponsorship.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={sponsorship.type === 'text' ? 'default' : 'secondary'}>
                          {sponsorship.type === 'text' ? 'Text' : 'Audio'}
                        </Badge>
                        <Badge variant="outline">
                          {getPositionLabel(sponsorship.position, sponsorship.customPosition)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 truncate">
                        {sponsorship.type === 'text' 
                          ? sponsorship.content 
                          : 'Audio file uploaded'
                        }
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSponsorship(sponsorship.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Sponsorship */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Add New Sponsorship</Label>
            
            <Tabs 
              value={newSponsorship.type} 
              onValueChange={(value) => setNewSponsorship(prev => ({ ...prev, type: value as 'text' | 'audio', content: '' }))}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Sponsorship</TabsTrigger>
                <TabsTrigger value="audio">Audio Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sponsor-text">Sponsorship Text</Label>
                  <Textarea
                    id="sponsor-text"
                    placeholder="Enter your sponsorship message here..."
                    value={newSponsorship.content}
                    onChange={(e) => setNewSponsorship(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor-voice">Voice for Sponsorship</Label>
                  <Select 
                    value={newSponsorship.voice} 
                    onValueChange={(value) => setNewSponsorship(prev => ({ ...prev, voice: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={config.narratorVoice}>Same as narrator</SelectItem>
                      <SelectItem value="sponsor-voice-1">Professional Announcer</SelectItem>
                      <SelectItem value="sponsor-voice-2">Friendly Host</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sponsor-audio">Upload Audio File</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="sponsor-audio"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    <Label htmlFor="sponsor-audio" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        {newSponsorship.content ? 'Audio file selected' : 'Click to upload audio file'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports MP3, WAV, M4A files
                      </p>
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Position Selection */}
            <div className="space-y-2">
              <Label>Sponsorship Position</Label>
              <Select 
                value={newSponsorship.position} 
                onValueChange={(value) => setNewSponsorship(prev => ({ 
                  ...prev, 
                  position: value as any,
                  customPosition: value === 'custom' ? 50 : undefined
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginning">Beginning of podcast</SelectItem>
                  <SelectItem value="middle">Middle of podcast</SelectItem>
                  <SelectItem value="end">End of podcast</SelectItem>
                  <SelectItem value="custom">Custom position</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Position Slider */}
            {newSponsorship.position === 'custom' && (
              <div className="space-y-2">
                <Label>Custom Position: {newSponsorship.customPosition}% through podcast</Label>
                <Slider
                  value={[newSponsorship.customPosition || 50]}
                  onValueChange={([value]) => setNewSponsorship(prev => ({ ...prev, customPosition: value }))}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            )}

            <Button 
              onClick={addSponsorship} 
              disabled={!newSponsorship.content}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsorship
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back to Voice Selection
        </Button>
        <Button onClick={onNext} className="px-8">
          Continue to Personal Voice
        </Button>
      </div>
    </div>
  );
}
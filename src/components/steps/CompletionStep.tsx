import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Play, Pause, RotateCcw, CheckCircle, Clock, FileAudio } from 'lucide-react';
import { PodcastConfig } from '@/types/podcast';

interface CompletionStepProps {
  config: PodcastConfig;
  updateConfig: (updates: Partial<PodcastConfig>) => void;
  onRestart: () => void;
}

export function CompletionStep({ config, updateConfig, onRestart }: CompletionStepProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock podcast details
  const podcastDetails = {
    duration: '12:34',
    fileSize: '11.2 MB',
    quality: 'High Quality (320 kbps)',
    segments: [
      { type: 'intro', duration: '0:15' },
      { type: 'content', duration: '10:45' },
      ...(config.sponsorships.length > 0 ? [{ type: 'sponsorship', duration: '0:30' }] : []),
      ...(config.personalVoice ? [{ type: 'interview', duration: '1:04' }] : []),
      { type: 'outro', duration: '0:10' }
    ]
  };

  const handlePlayPreview = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 5000); // Simulate 5-second preview
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // In a real implementation, this would download the actual MP3 file
      // For now, we'll simulate the download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock download
      const link = document.createElement('a');
      link.href = '#'; // In real implementation, this would be the actual MP3 URL
      link.download = `podcast-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-800">
                Your Podcast is Ready!
              </h2>
              <p className="text-green-700">
                Successfully converted your PDF to a high-quality podcast
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Podcast Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="w-5 h-5" />
            Podcast Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <Clock className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <p className="text-sm font-medium">Duration</p>
              <p className="text-lg font-semibold text-primary">{podcastDetails.duration}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <Download className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <p className="text-sm font-medium">File Size</p>
              <p className="text-lg font-semibold text-primary">{podcastDetails.fileSize}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <FileAudio className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <p className="text-sm font-medium">Quality</p>
              <p className="text-sm font-semibold text-primary">{podcastDetails.quality}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <CheckCircle className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm font-semibold text-green-600">Complete</p>
            </div>
          </div>

          {/* Segment Breakdown */}
          <div className="space-y-3">
            <h3 className="font-medium">Podcast Segments</h3>
            <div className="space-y-2">
              {podcastDetails.segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      segment.type === 'content' ? 'default' :
                      segment.type === 'sponsorship' ? 'secondary' :
                      segment.type === 'interview' ? 'outline' :
                      'secondary'
                    }>
                      {segment.type === 'content' ? 'Main Content' :
                       segment.type === 'sponsorship' ? 'Sponsorship' :
                       segment.type === 'interview' ? 'Interview' :
                       segment.type === 'intro' ? 'Introduction' :
                       'Conclusion'}
                    </Badge>
                  </div>
                  <span className="text-sm text-slate-600">{segment.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Preview & Download */}
      <Card>
        <CardHeader>
          <CardTitle>Preview & Download</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Preview */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPreview}
              className="shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Preview'}
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">Audio Preview</p>
              <p className="text-xs text-slate-600">
                {isPlaying ? 'Playing preview...' : 'Click to hear a 5-second preview'}
              </p>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Preparing Download...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download MP3 Podcast
              </>
            )}
          </Button>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your podcast has been generated with all requested features:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>PDF content converted to {config.language} speech</li>
                <li>High-quality {config.narratorVoice ? 'AI voice narration' : 'narration'}</li>
                {config.sponsorships.length > 0 && (
                  <li>{config.sponsorships.length} sponsorship segment(s) integrated</li>
                )}
                {config.personalVoice && (
                  <li>Personal voice integration with {config.personalVoice.role} role</li>
                )}
                <li>Professional audio mixing and MP3 encoding</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onRestart} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Create Another Podcast
        </Button>
        <div className="text-sm text-slate-600">
          Podcast generated successfully • All validations passed
        </div>
      </div>
    </div>
  );
}
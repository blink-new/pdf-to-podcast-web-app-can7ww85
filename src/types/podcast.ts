export interface PodcastConfig {
  pdfFile: File | null;
  pdfText: string;
  language: 'english' | 'hebrew';
  narratorVoice: string;
  sponsorships: Sponsorship[];
  personalVoice: PersonalVoice | null;
  processingStatus: ProcessingStatus;
}

export interface Sponsorship {
  id: string;
  type: 'text' | 'audio';
  content: string; // Text content or audio file URL
  voice?: string; // For text-to-speech sponsorships
  position: 'beginning' | 'middle' | 'end' | 'custom';
  customPosition?: number; // Percentage (0-100) for custom positioning
}

export interface PersonalVoice {
  audioFile: File;
  role: 'interviewer' | 'co-narrator' | 'host';
  sampleDuration: number;
}

export interface ProcessingStatus {
  step: 'upload' | 'configure' | 'sponsorship' | 'voice' | 'processing' | 'complete';
  progress: number;
  validations: {
    pdfExtracted: boolean;
    textToSpeechReady: boolean;
    audioSegmentsReady: boolean;
    mp3Generated: boolean;
  };
  errors: string[];
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: 'english' | 'hebrew';
  preview?: string; // URL to preview audio
}

export interface ProcessingResult {
  audioUrl: string;
  duration: number;
  fileSize: number;
  segments: AudioSegment[];
}

export interface AudioSegment {
  type: 'content' | 'sponsorship' | 'personal';
  startTime: number;
  endTime: number;
  content: string;
}
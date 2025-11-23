export interface Persona {
  id: string;
  name: string;
  trigger_phrase: string;
  mood_profile: string;
  description: string;
  system_prompt_addendum: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isRitual?: boolean;
}

export enum AppState {
  LOCKED = 'LOCKED',
  TERMINAL = 'TERMINAL',
  SANCTUARY = 'SANCTUARY'
}

export interface RitualStatus {
  step: number;
  completed: boolean;
  log: string[];
}
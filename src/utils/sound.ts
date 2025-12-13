// src/utils/sound.ts
// If you have a sound.wav file, place it in public/sounds/notification.wav
// Then use this utility to play it

export class SoundPlayer {
  private audio: HTMLAudioElement | null = null;
  
  constructor(soundUrl?: string) {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      if (soundUrl) {
        this.audio.src = soundUrl;
      } else {
        // Default fallback sound
        this.audio.src = '/sounds/notification.wav'; // Place your WAV file here
      }
      this.audio.preload = 'auto';
    }
  }
  
  async play(volume: number = 70) {
    if (!this.audio) return;
    
    try {
      this.audio.volume = Math.max(0.01, Math.min(1, volume / 100));
      await this.audio.play();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }
  
  setSoundUrl(url: string) {
    if (this.audio) {
      this.audio.src = url;
    }
  }
  
  cleanup() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}

// Create singleton instance
export const soundPlayer = new SoundPlayer();
import { useEffect, useRef } from "react";
import { useSettings } from "../hooks/useSettings";

/**
 * Audio playback manager
 */
class AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();

  setVolume(id: string, volume: number) {
    const element = this.audioElements.get(id);
    if (element) {
      element.volume = volume / 100;
    }
  }

  setMuted(id: string, muted: boolean) {
    const element = this.audioElements.get(id);
    if (element) {
      element.muted = muted;
    }
  }

  registerElement(id: string, element: HTMLAudioElement) {
    this.audioElements.set(id, element);
  }

  unregisterElement(id: string) {
    this.audioElements.delete(id);
  }
}

const audioManager = new AudioManager();

/**
 * useAudio hook provides audio playback functionality integrated with settings
 * 
 * @example
 * ```tsx
 * function GameComponent() {
 *   const audioRef = useAudio("move-sound");
 *   
 *   const handleMove = () => {
 *     audioRef.current?.play();
 *   };
 *   
 *   return (
 *     <>
 *       <audio ref={audioRef} src="/sounds/move.mp3" />
 *       <button onClick={handleMove}>Make Move</button>
 *     </>
 *   );
 * }
 * ```
 */
export const useAudio = (id: string) => {
  const { settings } = useSettings();
    const audioRef = useRef<HTMLAudioElement>(null);
    if (audioRef.current) {
      audioManager.registerElement(id, audioRef.current);
      return () => {
        audioManager.unregisterElement(id);
      };
    }
  }, [id]);

  useEffect(() => {
    if (audioRef.current) {
      // Update SFX volume
      audioManager.setVolume(id, settings.audio.sfxVolume);
      audioManager.setMuted(id, !settings.audio.soundEnabled);
    }
  }, [id, settings.audio.sfxVolume, settings.audio.soundEnabled]);

  return audioRef;
};

export default audioManager;

/**
 * Sound and Speech Synthesis Service for PAUD Kids E-Learning
 * Built with Web Audio API and SpeechSynthesis API
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isSpeaking: boolean = false;
  private currentBgmOsc: OscillatorNode | null = null;
  private currentBgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    const savedMute = localStorage.getItem('paud_sound_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('paud_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopBgm();
      this.stopSpeech();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Playful pop sound for clicking buttons
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Star collection / reward sparkle sound
  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      const now = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch {
      // ignore
    }
  }

  // Victory fanfare for completing a game or getting 3 stars
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const chordNotes = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 659.25, d: 0.12, t: 0.12 },
        { f: 783.99, d: 0.12, t: 0.24 },
        { f: 1046.5, d: 0.45, t: 0.36 },
      ];
      const now = this.audioCtx.currentTime;

      chordNotes.forEach(({ f, d, t }) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.25, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {
      // ignore
    }
  }

  // Soft Boing for try again
  public playBoing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Play musical note (frequency in Hz, duration in seconds)
  public playNote(freq: number, duration: number = 0.3) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }

  // Synthesize cute animal sound frequencies
  public playAnimalSound(type: string) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (type === 'kucing') {
        // Meow sound: pitch sliding up then down
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.linearRampToValueAtTime(780, now + 0.22);
        osc.frequency.linearRampToValueAtTime(480, now + 0.55);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'bebek') {
        // Duck quack: rapid dual frequency bursts
        for (let i = 0; i < 2; i++) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.2;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(340, t);
          osc.frequency.linearRampToValueAtTime(230, t + 0.15);

          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.15);
        }
      } else if (type === 'burung') {
        // Bird chirp trill
        for (let i = 0; i < 4; i++) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.1;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1600, t);
          osc.frequency.linearRampToValueAtTime(2400, t + 0.07);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.07);
        }
      } else if (type === 'kodok') {
        // Frog croak
        for (let i = 0; i < 2; i++) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.22;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, t);
          osc.frequency.exponentialRampToValueAtTime(75, t + 0.18);

          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.18);
        }
      } else if (type === 'sapi') {
        // Cow moo: long deep resonant sound with low filter
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(115, now);
        osc.frequency.linearRampToValueAtTime(145, now + 0.35);
        osc.frequency.linearRampToValueAtTime(105, now + 0.95);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.95);
      } else if (type === 'domba') {
        // Sheep bleat: undulating vibrato
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);

        // Vibrato
        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfo.frequency.setValueAtTime(9, now); // 9Hz bleat
        lfoGain.gain.setValueAtTime(25, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 0.7);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'singa') {
        // Lion roar: low rumble frequency drop
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.85);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
      } else if (type === 'gajah') {
        // Elephant trumpet: high pitched brass horn glissando
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.linearRampToValueAtTime(680, now + 0.3);
        osc.frequency.linearRampToValueAtTime(820, now + 0.6);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.32, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.75);
      } else if (type === 'anjing') {
        // Dog bark: 2 short punchy barks
        for (let i = 0; i < 2; i++) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.22;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(120, t + 0.13);

          gain.gain.setValueAtTime(0.32, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.13);
        }
      } else if (type === 'kuda') {
        // Horse whinny & gallop sound
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(950, now + 0.2);
        osc.frequency.linearRampToValueAtTime(550, now + 0.65);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.26, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (type === 'ayam') {
        // Rooster crow: "kukuruyuk" pitch climb
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(520, now + 0.2);
        osc.frequency.linearRampToValueAtTime(740, now + 0.5);
        osc.frequency.linearRampToValueAtTime(620, now + 0.85);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
      } else if (type === 'monyet') {
        // Monkey chattering
        for (let i = 0; i < 4; i++) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.14;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(i % 2 === 0 ? 550 : 850, t);
          osc.frequency.linearRampToValueAtTime(i % 2 === 0 ? 800 : 1100, t + 0.08);

          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.08);
        }
      } else {
        this.playSparkle();
      }
    } catch {
      // ignore
    }
  }

  // Play pleasant musical chord/arpeggio for song lyrics
  public playSongLineMelody(melodyBeats: number[], lineIndex: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const baseNote = melodyBeats[lineIndex % melodyBeats.length];
      const now = this.audioCtx.currentTime;

      // Play a 3-note melodic marimba flourish
      const pattern = [baseNote, baseNote * 1.25, baseNote * 1.5];
      pattern.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.18, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Indonesian Speech Synthesizer with garbage-collection protection and fallback timeout
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private speechTimeout: number | null = null;

  public speakIndonesian(text: string, onEnd?: () => void) {
    if (this.speechTimeout) {
      window.clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }

    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance;
      // Retain on window object to prevent Chromium GC bug
      (window as unknown as { _activeUtterance?: SpeechSynthesisUtterance })._activeUtterance = utterance;

      utterance.lang = 'id-ID';
      utterance.rate = 0.92; // Clear, friendly pace for preschool children
      utterance.pitch = 1.25; // Joyful children tone

      // Try finding an Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().includes('indonesian'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      this.isSpeaking = true;
      let hasCompleted = false;

      const finishCallback = () => {
        if (hasCompleted) return;
        hasCompleted = true;
        this.isSpeaking = false;
        if (this.speechTimeout) {
          window.clearTimeout(this.speechTimeout);
          this.speechTimeout = null;
        }
        this.activeUtterance = null;
        (window as unknown as { _activeUtterance?: SpeechSynthesisUtterance | null })._activeUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onend = finishCallback;
      utterance.onerror = finishCallback;

      // Safety timeout: calculate based on text length with generous buffer
      // Guarantees progression even if browser drops speech event
      const expectedDurationMs = Math.max(2000, text.length * 105 + 900);
      this.speechTimeout = window.setTimeout(finishCallback, expectedDurationMs);

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  // Speak Arabic or phonics pronunciation for Hijaiyah learning
  public speakHijaiyah(arabicChar: string, indonesianName: string, description?: string) {
    if (this.speechTimeout) {
      window.clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }

    if (this.isMuted || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      // First check if an Arabic voice exists (ar-SA, ar-EG, ar, etc.)
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.toLowerCase().startsWith('ar'));

      if (arVoice) {
        const utterance = new SpeechSynthesisUtterance(arabicChar);
        utterance.voice = arVoice;
        utterance.lang = 'ar-SA';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;

        utterance.onend = () => {
          // Follow up with child-friendly Indonesian explanation
          const indText = description || `Huruf ${indonesianName}`;
          this.speakIndonesian(indText);
        };
        utterance.onerror = () => {
          const indText = description || `Huruf ${indonesianName}`;
          this.speakIndonesian(indText);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Clear Indonesian phonetic description if Arabic voice isn't installed
        const indText = description ? `${indonesianName}! ${description}` : `Huruf Hijaiyah ${indonesianName}. ${arabicChar}!`;
        this.speakIndonesian(indText);
      }
    } catch {
      this.speakIndonesian(`Huruf ${indonesianName}`);
    }
  }

  public stopSpeech() {
    if (this.speechTimeout) {
      window.clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.activeUtterance = null;
      (window as unknown as { _activeUtterance?: SpeechSynthesisUtterance | null })._activeUtterance = null;
    }
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  public stopBgm() {
    if (this.currentBgmOsc) {
      try {
        this.currentBgmOsc.stop();
        this.currentBgmOsc.disconnect();
      } catch {
        // ignore
      }
      this.currentBgmOsc = null;
    }
    this.isBgmPlaying = false;
  }
}

export const soundService = new SoundService();


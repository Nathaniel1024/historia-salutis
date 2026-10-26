import { chaptersData } from '../data/chaptersData';

type VisualizerFrame = Uint8Array;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ambientTargetRms = 0.11;

const audioExtensions = ['mp3', 'ogg', 'wav'];
const chapterTrackFilenames = ['Chapter1', 'Chapter2', 'Chapter3', 'Chapter4', 'Chapter5', 'Chapter6', 'Chapter7', 'Chapter8'];

export class HistoriaAudioEngine {
  private readonly synthDisabled = true;
  private masterVolume = 0.76;
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  private masterGain: GainNode | null = null;
  private synthBusGain: GainNode | null = null;
  private ambientBusGain: GainNode | null = null;

  private droneGain: GainNode | null = null;
  private textureGain: GainNode | null = null;
  private harpGain: GainNode | null = null;
  private choirGain: GainNode | null = null;
  private subGain: GainNode | null = null;

  private droneA: OscillatorNode | null = null;
  private droneB: OscillatorNode | null = null;
  private choirA: OscillatorNode | null = null;
  private choirB: OscillatorNode | null = null;
  private choirC: OscillatorNode | null = null;
  private sub: OscillatorNode | null = null;
  private harp: OscillatorNode | null = null;
  private shimmerLfo: OscillatorNode | null = null;
  private shimmerGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private textureSource: AudioBufferSourceNode | null = null;

  private ambientGains: GainNode[] = [];
  private ambientSources: AudioBufferSourceNode[] = [];
  private ambientLevelCompensation: number[] = [];
  private ambientLoadedCount = 0;
  private ambientLoadPromise: Promise<void> | null = null;
  private activeAmbientIndex = -1;

  private muted = false;
  private started = false;
  private currentChapterIndex = 0;
  private driftTimer: number | null = null;

  private ensureContext() {
    if (this.context) return;

    this.context = new AudioContext();

    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.0001;

    this.synthBusGain = this.context.createGain();
    this.synthBusGain.gain.value = 0.8;

    this.ambientBusGain = this.context.createGain();
    this.ambientBusGain.gain.value = 0.0001;

    this.droneGain = this.context.createGain();
    this.droneGain.gain.value = 0.2;

    this.textureGain = this.context.createGain();
    this.textureGain.gain.value = 0.14;

    this.harpGain = this.context.createGain();
    this.harpGain.gain.value = 0.08;

    this.choirGain = this.context.createGain();
    this.choirGain.gain.value = 0.11;

    this.subGain = this.context.createGain();
    this.subGain.gain.value = 0.07;

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 64;

    this.droneA = this.context.createOscillator();
    this.droneA.type = 'sine';

    this.droneB = this.context.createOscillator();
    this.droneB.type = 'triangle';

    this.harp = this.context.createOscillator();
    this.harp.type = 'sawtooth';

    this.choirA = this.context.createOscillator();
    this.choirA.type = 'sine';

    this.choirB = this.context.createOscillator();
    this.choirB.type = 'triangle';

    this.choirC = this.context.createOscillator();
    this.choirC.type = 'sine';

    this.sub = this.context.createOscillator();
    this.sub.type = 'triangle';

    this.shimmerLfo = this.context.createOscillator();
    this.shimmerLfo.type = 'sine';
    this.shimmerLfo.frequency.value = 0.11;

    this.shimmerGain = this.context.createGain();
    this.shimmerGain.gain.value = 2;

    this.noiseFilter = this.context.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.noiseFilter.frequency.value = 1200;

    this.windFilter = this.context.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 640;
    this.windFilter.Q.value = 0.7;

    this.textureSource = this.context.createBufferSource();
    this.textureSource.buffer = this.createNoiseBuffer(this.context, 2.8);
    this.textureSource.loop = true;

    this.droneA.connect(this.droneGain);
    this.droneB.connect(this.droneGain);
    this.harp.connect(this.harpGain);
    this.choirA.connect(this.choirGain);
    this.choirB.connect(this.choirGain);
    this.choirC.connect(this.choirGain);
    this.sub.connect(this.subGain);
    this.shimmerLfo.connect(this.shimmerGain);
    this.shimmerGain.connect(this.harp.detune);

    this.textureSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.windFilter);
    this.windFilter.connect(this.textureGain);

    this.droneGain.connect(this.synthBusGain);
    this.harpGain.connect(this.synthBusGain);
    this.choirGain.connect(this.synthBusGain);
    this.subGain.connect(this.synthBusGain);
    this.textureGain.connect(this.synthBusGain);

    this.synthBusGain.connect(this.masterGain);
    this.ambientBusGain.connect(this.masterGain);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.droneA.start();
    this.droneB.start();
    this.harp.start();
    this.choirA.start();
    this.choirB.start();
    this.choirC.start();
    this.sub.start();
    this.shimmerLfo.start();
    this.textureSource.start();
  }

  private createNoiseBuffer(context: AudioContext, seconds: number) {
    const frameCount = context.sampleRate * seconds;
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const channel = buffer.getChannelData(0);

    let last = 0;
    for (let i = 0; i < frameCount; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      channel[i] = last * 3.5;
    }

    return buffer;
  }

  private async decodeAmbientBuffer(chapterIndex: number): Promise<AudioBuffer | null> {
    if (!this.context) return null;

    const chapterTrackName = chapterTrackFilenames[chapterIndex];

    for (const ext of audioExtensions) {
      const sources = chapterTrackName
        ? [`/audio/new-audio/${chapterTrackName}.${ext}`]
        : [];

      for (const src of sources) {
        try {
          const response = await fetch(src, { cache: 'force-cache' });
          if (!response.ok) continue;
          const bytes = await response.arrayBuffer();
          return await this.context.decodeAudioData(bytes.slice(0));
        } catch {
          continue;
        }
      }
    }

    return null;
  }

  private calculateAmbientCompensation(buffer: AudioBuffer) {
    let energy = 0;
    let count = 0;
    let peak = 0;

    const sampleStride = 96;
    const channels = buffer.numberOfChannels;

    for (let ch = 0; ch < channels; ch += 1) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i += sampleStride) {
        const sample = data[i];
        const absolute = Math.abs(sample);
        if (absolute > peak) peak = absolute;
        energy += sample * sample;
        count += 1;
      }
    }

    const rms = Math.sqrt(energy / Math.max(1, count));
    let gain = ambientTargetRms / Math.max(rms, 0.0001);

    gain = clamp(gain, 0.45, 1.85);

    if (peak > 0.0001) {
      gain = Math.min(gain, 0.98 / peak);
    }

    return clamp(gain, 0.35, 1.85);
  }

  private async ensureAmbientTracks() {
    if (!this.context || !this.ambientBusGain) return;
    if (this.ambientLoadPromise) return this.ambientLoadPromise;

    this.ambientLoadPromise = (async () => {
      for (let index = 0; index < chaptersData.length; index += 1) {
        const buffer = await this.decodeAmbientBuffer(index);
        if (!buffer) continue;

        const source = this.context!.createBufferSource();
        const gain = this.context!.createGain();
        const compensation = this.calculateAmbientCompensation(buffer);

        source.buffer = buffer;
        source.loop = true;
        gain.gain.value = 0.0001;

        source.connect(gain);
        gain.connect(this.ambientBusGain!);
        source.start();

        this.ambientSources[index] = source;
        this.ambientGains[index] = gain;
        this.ambientLevelCompensation[index] = compensation;
        this.ambientLoadedCount += 1;
      }

      if (this.synthBusGain) {
        const now = this.context!.currentTime;
        const synthTarget = this.ambientLoadedCount > 0 ? 0.2 : 0.8;
        this.synthBusGain.gain.setTargetAtTime(synthTarget, now, 0.8);
      }
    })();

    return this.ambientLoadPromise;
  }

  async start() {
    this.ensureContext();
    if (!this.context || !this.masterGain || !this.ambientBusGain) return;

    await this.context.resume();
    await this.ensureAmbientTracks();

    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : this.masterVolume, now + 1.5);

    const ambientTarget = this.ambientLoadedCount > 0 ? 0.72 : 0.0001;
    this.ambientBusGain.gain.setTargetAtTime(ambientTarget, now, 1.1);

    if (this.synthDisabled && this.synthBusGain) {
      this.synthBusGain.gain.setTargetAtTime(0.0001, now, 0.2);
    }

    this.started = true;
    if (!this.synthDisabled) this.startDrift();
  }

  async pause() {
    if (!this.context || !this.masterGain) return;
    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    this.ambientGains.forEach((gain) => {
      if (!gain) return;
      gain.gain.setTargetAtTime(0.0001, now, 0.12);
    });
    this.activeAmbientIndex = -1;
    this.started = false;
    this.stopDrift();
  }

  toggleMute(force?: boolean) {
    this.muted = typeof force === 'boolean' ? force : !this.muted;
    if (!this.context || !this.masterGain) return this.muted;

    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : this.started ? this.masterVolume : 0.0001, now + 0.45);

    return this.muted;
  }

  setMasterVolume(nextValue: number) {
    this.masterVolume = clamp(nextValue, 0, 1);
    if (!this.context || !this.masterGain) return this.masterVolume;

    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : this.started ? this.masterVolume : 0.0001, now + 0.2);

    return this.masterVolume;
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  setSoundProfile(chapterIndex: number, chapterProgress: number) {
    this.currentChapterIndex = clamp(chapterIndex, 0, chaptersData.length - 1);

    if (this.context && this.ambientGains.length > 0) {
      const now = this.context.currentTime;
      const compensation = this.ambientLevelCompensation[this.currentChapterIndex] ?? 1;
      const normalizedTarget = clamp(0.5 * compensation, 0.24, 0.86);

      if (this.activeAmbientIndex !== this.currentChapterIndex) {
        this.ambientGains.forEach((gain, idx) => {
          if (!gain) return;
          gain.gain.cancelScheduledValues(now);

          if (idx === this.currentChapterIndex) {
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.setTargetAtTime(normalizedTarget, now, 0.12);
          } else {
            gain.gain.setValueAtTime(0.0001, now);
          }
        });

        this.activeAmbientIndex = this.currentChapterIndex;
      } else {
        const activeGain = this.ambientGains[this.currentChapterIndex];
        if (activeGain) {
          activeGain.gain.setTargetAtTime(normalizedTarget, now, 0.22);
        }
      }
    }

    if (this.synthDisabled) return;

    if (
      !this.context ||
      !this.droneA ||
      !this.droneB ||
      !this.harp ||
      !this.choirA ||
      !this.choirB ||
      !this.choirC ||
      !this.sub ||
      !this.noiseFilter ||
      !this.windFilter ||
      !this.textureGain ||
      !this.harpGain ||
      !this.choirGain ||
      !this.subGain ||
      !this.droneGain ||
      !this.shimmerLfo ||
      !this.shimmerGain
    ) {
      return;
    }

    const profile = chaptersData[this.currentChapterIndex].audio;
    const travel = clamp(chapterProgress, 0, 1);

    const now = this.context.currentTime;
    const base = profile.baseFrequency * (1 + travel * 0.08);

    this.droneA.frequency.setTargetAtTime(base, now, 0.4);
    this.droneB.frequency.setTargetAtTime(base / 2, now, 0.5);
    this.droneB.detune.setTargetAtTime(profile.detuneCents * (1 - travel * 0.4), now, 0.3);

    const harpBase = base * 1.5;
    const arpPhase = Math.sin(now * 1.8) * 18;
    this.harp.frequency.setTargetAtTime(harpBase + arpPhase, now, 0.18);

    const majorThird = base * 1.25;
    const perfectFifth = base * 1.5;
    this.choirA.frequency.setTargetAtTime(base, now, 0.35);
    this.choirB.frequency.setTargetAtTime(majorThird, now, 0.5);
    this.choirC.frequency.setTargetAtTime(perfectFifth, now, 0.62);
    this.sub.frequency.setTargetAtTime(base / 4, now, 0.7);

    const brightness = 600 + profile.brightness * 2400 + travel * 480;
    this.noiseFilter.frequency.setTargetAtTime(brightness, now, 0.3);
    this.windFilter.frequency.setTargetAtTime(280 + profile.textureAmount * 1300 + travel * 160, now, 0.35);
    this.shimmerLfo.frequency.setTargetAtTime(0.06 + profile.brightness * 0.22, now, 0.8);
    this.shimmerGain.gain.setTargetAtTime(1.2 + profile.brightness * 4.4, now, 0.6);

    const textureTarget = 0.05 + profile.textureAmount * 0.24;
    this.textureGain.gain.setTargetAtTime(textureTarget, now, 0.45);
    this.harpGain.gain.setTargetAtTime(0.04 + profile.brightness * 0.12, now, 0.5);
    this.choirGain.gain.setTargetAtTime(0.07 + profile.brightness * 0.11, now, 0.6);
    this.subGain.gain.setTargetAtTime(0.04 + (1 - profile.brightness) * 0.09, now, 0.8);
    this.droneGain.gain.setTargetAtTime(0.16 + (1 - profile.brightness) * 0.18, now, 0.5);

    if (this.ambientGains.length > 0) {
      const primaryGain = 0.45 + profile.brightness * 0.2;
      const chapterBlend = 0.68 + travel * 0.2;
      const activeGain = this.ambientGains[this.currentChapterIndex];
      if (activeGain) {
        activeGain.gain.setTargetAtTime(primaryGain * chapterBlend, now, 0.2);
      }
    }
  }

  private startDrift() {
    if (!this.context || this.driftTimer !== null) return;

    this.driftTimer = window.setInterval(() => {
      if (!this.context || !this.started) return;
      const now = this.context.currentTime;
      const profile = chaptersData[this.currentChapterIndex].audio;

      if (this.harp) {
        const flutter = (Math.random() * 2 - 1) * (14 + profile.brightness * 20);
        this.harp.detune.setTargetAtTime(flutter, now, 0.9);
      }

      if (this.noiseFilter) {
        const drift = 560 + profile.brightness * 2200 + Math.random() * 320;
        this.noiseFilter.frequency.setTargetAtTime(drift, now, 1.2);
      }

      if (this.windFilter) {
        const wind = 260 + profile.textureAmount * 1100 + Math.random() * 160;
        this.windFilter.frequency.setTargetAtTime(wind, now, 1.1);
      }

      if (Math.random() > 0.6) {
        this.playBell(now + 0.1 + Math.random() * 0.4, profile.brightness);
      }
    }, 9000);
  }

  private playBell(time: number, brightness: number) {
    if (!this.context || !this.masterGain || this.ambientLoadedCount > 0) return;

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    oscillator.type = 'triangle';
    oscillator.frequency.value = 420 + brightness * 380 + Math.random() * 120;

    filter.type = 'highpass';
    filter.frequency.value = 450;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.028 + brightness * 0.018, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.9);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    oscillator.start(time);
    oscillator.stop(time + 2.1);
  }

  private stopDrift() {
    if (this.driftTimer === null) return;
    window.clearInterval(this.driftTimer);
    this.driftTimer = null;
  }

  getVisualizerData(): VisualizerFrame {
    if (!this.analyser) return new Uint8Array(32);
    const bins = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(bins);
    return bins;
  }

  dispose() {
    this.stopDrift();
    this.ambientSources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // no-op
      }
    });

    if (!this.context) return;
    this.context.close();
    this.context = null;
  }
}

export const createAudioEngine = () => new HistoriaAudioEngine();

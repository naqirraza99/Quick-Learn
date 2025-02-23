declare module 'wav-encoder' {
  export interface AudioData {
    sampleRate: number;
    channelData: Float32Array[];
  }

  export function encodeWAV(audioData: AudioData): Promise<Blob>;
}
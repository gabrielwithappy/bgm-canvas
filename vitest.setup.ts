import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => ({
    save: () => { },
    restore: () => { },
    clearRect: () => { },
    beginPath: () => { },
    moveTo: () => { },
    lineTo: () => { },
    stroke: () => { },
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 1,
    strokeStyle: "#111111",
    globalAlpha: 1,
  }),
});

class MockAudioBufferSourceNode {
  buffer: AudioBuffer | null = null;
  loop = false;

  connect() { }
  disconnect() { }
  start() { }
  stop() { }
}

class MockGainNode {
  gain = { value: 0 };

  connect() { }
  disconnect() { }
}

class MockBiquadFilterNode {
  frequency = { value: 0 };
  Q = { value: 1 };
  type: BiquadFilterType = "lowpass";

  connect() { }
  disconnect() { }
}

class MockAudioContext {
  destination = {};
  state: AudioContextState = "running";
  sampleRate = 44100;

  close = vi.fn(async () => {
    this.state = "closed";
  });

  createBuffer(channels: number, frameCount: number, _sampleRate: number): AudioBuffer {
    const data = new Float32Array(frameCount);
    return {
      numberOfChannels: channels,
      length: frameCount,
      sampleRate: _sampleRate,
      duration: frameCount / _sampleRate,
      getChannelData: () => data,
      copyFromChannel: () => { },
      copyToChannel: () => { },
    } as unknown as AudioBuffer;
  }

  createBufferSource() {
    return new MockAudioBufferSourceNode() as unknown as AudioBufferSourceNode;
  }

  createGain() {
    return new MockGainNode() as unknown as GainNode;
  }

  createBiquadFilter() {
    return new MockBiquadFilterNode() as unknown as BiquadFilterNode;
  }

  resume = vi.fn(async () => {
    this.state = "running";
  });

  suspend = vi.fn(async () => {
    this.state = "suspended";
  });
}

Object.defineProperty(window, "AudioContext", {
  configurable: true,
  value: MockAudioContext,
});

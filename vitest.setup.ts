import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => ({
    save: () => {},
    restore: () => {},
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 1,
    strokeStyle: "#111111",
    globalAlpha: 1,
  }),
});

class MockOscillatorNode {
  frequency = { value: 0 };
  type: OscillatorType = "sine";

  connect() {}
  disconnect() {}
  start() {}
  stop() {}
}

class MockGainNode {
  gain = { value: 0 };

  connect() {}
  disconnect() {}
}

class MockAudioContext {
  destination = {};
  state: AudioContextState = "running";

  close = vi.fn(async () => {
    this.state = "closed";
  });

  createGain() {
    return new MockGainNode() as unknown as GainNode;
  }

  createOscillator() {
    return new MockOscillatorNode() as unknown as OscillatorNode;
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

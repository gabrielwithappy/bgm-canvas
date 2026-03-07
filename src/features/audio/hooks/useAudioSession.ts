import { useEffect, useRef, useState } from "react";
import type { SceneElement } from "../../../shared/types/domain";
import type { AudioSessionState } from "../model/audioLayers";

type AudioNodes = {
  gain: GainNode;
  oscillator: OscillatorNode;
};

const motifFrequencies: Record<SceneElement["motif"], number> = {
  campfire: 220,
  rain: 320,
  wind: 270,
  tree: 196,
  star: 523,
  sea: 174,
  unknown: 246,
};

export function useAudioSession(sceneElements: SceneElement[]) {
  const [sessionState, setSessionState] = useState<AudioSessionState>("idle");
  const contextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Map<string, AudioNodes>>(new Map());

  const ensureContext = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!contextRef.current) {
      contextRef.current = new AudioContextCtor();
    }

    return contextRef.current;
  };

  const stopAllNodes = () => {
    for (const [, node] of nodesRef.current) {
      node.oscillator.stop();
      node.oscillator.disconnect();
      node.gain.disconnect();
    }

    nodesRef.current.clear();
  };

  const syncNodes = async (nextSceneElements: SceneElement[]) => {
    const context = ensureContext();
    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    const nextIds = new Set(nextSceneElements.map((element) => element.id));

    for (const [elementId, nodes] of nodesRef.current) {
      if (!nextIds.has(elementId)) {
        nodes.oscillator.stop();
        nodes.oscillator.disconnect();
        nodes.gain.disconnect();
        nodesRef.current.delete(elementId);
      }
    }

    for (const element of nextSceneElements) {
      if (nodesRef.current.has(element.id)) {
        continue;
      }

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = element.motif === "sea" ? "sine" : "triangle";
      oscillator.frequency.value = motifFrequencies[element.motif];
      gain.gain.value = 0.018 + element.confidence * 0.012;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();

      nodesRef.current.set(element.id, { oscillator, gain });
    }
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (sceneElements.length === 0) {
        stopAllNodes();
        setSessionState("idle");
        return;
      }

      if (sessionState === "paused") {
        return;
      }

      await syncNodes(sceneElements);

      if (active) {
        setSessionState("playing");
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [sceneElements, sessionState]);

  const pause = async () => {
    if (sceneElements.length > 0) {
      setSessionState("paused");
    }

    const context = ensureContext();

    if (context && context.state === "running") {
      await context.suspend();
    }
  };

  const replay = async () => {
    if (sceneElements.length === 0) {
      setSessionState("idle");
      return;
    }

    setSessionState("playing");
    await syncNodes(sceneElements);
  };

  const reset = async () => {
    setSessionState("idle");
    stopAllNodes();

    if (contextRef.current) {
      await contextRef.current.close();
      contextRef.current = null;
    }
  };

  return {
    pause,
    replay,
    reset,
    sessionState,
  };
}

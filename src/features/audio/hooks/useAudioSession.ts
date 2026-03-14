import { useEffect, useRef, useState } from "react";
import type { SceneElement } from "../../../shared/types/domain";
import type { AudioSessionState } from "../model/audioLayers";
import { resolveAudioPreset } from "../model/audioPresets";
import { generateNoiseBuffer } from "../model/noiseBuffer";

type AudioNodes = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
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
      try {
        node.source.stop();
      } catch {
        // already stopped
      }
      node.source.disconnect();
      node.filter?.disconnect();
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
        try {
          nodes.source.stop();
        } catch {
          // already stopped
        }
        nodes.source.disconnect();
        nodes.filter?.disconnect();
        nodes.gain.disconnect();
        nodesRef.current.delete(elementId);
      }
    }

    for (const element of nextSceneElements) {
      if (nodesRef.current.has(element.id)) {
        continue;
      }

      const preset = resolveAudioPreset(element.motif);
      const noiseBuffer = generateNoiseBuffer(context, preset.noiseType);

      const source = context.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const gain = context.createGain();
      gain.gain.value = 0.12 * preset.gainMultiplier * (0.8 + element.confidence * 0.2);

      let filter: BiquadFilterNode | undefined = undefined;

      if (preset.filter) {
        filter = context.createBiquadFilter();
        filter.type = preset.filter.type;
        filter.frequency.value = preset.filter.frequency;
        if (preset.filter.Q !== undefined) {
          filter.Q.value = preset.filter.Q;
        }

        source.connect(filter);
        filter.connect(gain);
      } else {
        source.connect(gain);
      }

      gain.connect(context.destination);
      source.start();

      nodesRef.current.set(element.id, { source, gain, filter });
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

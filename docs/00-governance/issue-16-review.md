# Issue #16 Review: Tune motif-to-audio mapping for more natural BGM matches

## 문서 정보
- 작성일: 2026-03-08
- 작성자: Gabriel Codex
- 관련 이슈: gabrielwithappy/bgm-canvas#16
- 브랜치: claude/review-agent-docs-issue-t8nbx
- 목적: 이슈 #16의 제안에 대한 Gabriel Codex의 기술적 검토 의견

---

## review

- **입장**: agree (조건부 동의)
- **관련 브랜치**: claude/review-agent-docs-issue-t8nbx
- **관련 이슈**: #16
- **관련 문서**: `docs/20-planning/2026-03-07-bgm-canvas-implementation-plan.md` § 단계 3

---

## 근거

### 현재 구현의 문제점

`src/features/audio/hooks/useAudioSession.ts`의 현재 오디오 엔진은 아래와 같은 방식으로 동작한다.

```ts
const motifFrequencies: Record<SceneElement["motif"], number> = {
  campfire: 220,
  rain: 320,
  wind: 270,
  tree: 196,
  star: 523,
  sea: 174,
  unknown: 246,
};
// OscillatorNode + triangle/sine 파형 → 전자음 출력
```

이 구현은 "전자음 플레이스홀더" 수준이며, PRD가 요구하는 "내가 만든 장면이 바로 소리가 된다"는 감각적 경험을 전혀 제공하지 못한다. 이슈 제기자(@ericKwon95)의 진단에 동의한다.

---

## 기술적 방향 검토

### 옵션 A: Web Audio API AudioBufferSourceNode (실제 오디오 파일)
- **장점**: 외부 의존성 없음, AudioBuffer 캐싱 가능, `loading` 상태를 자연스럽게 표현
- **단점**: 오디오 파일 asset 관리 필요, 보일러플레이트 코드 증가
- **추천도**: ⭐⭐⭐⭐⭐ (MVP에 적합)

### 옵션 B: Tone.js Player
- **장점**: 깔끔한 API, 페이드인/아웃 내장, 복잡한 오디오 스케줄링에 유리
- **단점**: ~300KB 번들 추가, MVP 단계에서 과잉
- **추천도**: ⭐⭐⭐ (중장기 audio polish 단계에서 검토)

### 옵션 C: 개선된 Web Audio API 합성음 (노이즈 기반)
- **장점**: asset 파일 불필요
- **단점**: 진짜 자연음과 괴리가 크고, 구현 복잡도가 높다
- **추천도**: ⭐⭐ (비목표)

**결론**: MVP에서는 옵션 A(실제 오디오 파일 + Web Audio API)를 권장한다.

---

## 제안하는 구현 방향

### 1. 새 파일: `src/features/audio/model/motifPresets.ts`

```ts
// 공용 계약이 아닌 audio feature 내부 타입
type MotifAudioPreset = {
  assetPath: string      // e.g. "/audio/campfire-loop.mp3"
  gainLevel: number      // 0.0 ~ 1.0
  loop: boolean
  fadeInMs: number
  fadeOutMs: number
}

const motifPresets: Record<Motif, MotifAudioPreset> = {
  campfire: { assetPath: "/audio/campfire-loop.mp3", gainLevel: 0.6, loop: true, fadeInMs: 500, fadeOutMs: 800 },
  rain:     { assetPath: "/audio/rain-loop.mp3",     gainLevel: 0.5, loop: true, fadeInMs: 300, fadeOutMs: 500 },
  tree:     { assetPath: "/audio/wind-tree-loop.mp3",gainLevel: 0.4, loop: true, fadeInMs: 400, fadeOutMs: 600 },
  star:     { assetPath: "/audio/star-chimes-loop.mp3", gainLevel: 0.3, loop: true, fadeInMs: 600, fadeOutMs: 1000 },
  // ... 나머지 motif
  unknown:  { assetPath: "/audio/ambient-loop.mp3",  gainLevel: 0.2, loop: true, fadeInMs: 300, fadeOutMs: 500 },
}
```

### 2. `useAudioSession.ts` 전면 교체

- `OscillatorNode` → `AudioBufferSourceNode`
- `AudioBuffer` 캐싱: 한 번 fetch한 파일은 Map에 저장 (재로드 방지)
- `loading` 상태: fetch/decode 중에 `AudioLayer.state === "loading"` 노출
- 레이어 제거 시 fadeOut 후 stop (hard cut 없음)

### 3. Asset 구조

```
public/
  audio/
    campfire-loop.mp3
    rain-loop.mp3
    wind-tree-loop.mp3
    star-chimes-loop.mp3
    sea-wave-loop.mp3
    ambient-loop.mp3   # unknown fallback
```

> ⚠️ 오디오 파일 라이선스: CC0 또는 직접 제작이 필요하다. freesound.org CC0 계열 권장.

---

## 영향 코드

- **변경**: `src/features/audio/hooks/useAudioSession.ts` (전면 교체)
- **신규**: `src/features/audio/model/motifPresets.ts`
- **신규**: `public/audio/*.mp3` (asset 추가)
- **유지**: `src/shared/types/domain.ts` (AudioLayer 타입 변경 없음 — `loading` 상태 이미 있음)
- **유지**: `src/features/audio/model/audioLayers.ts` (변경 없음)

---

## 영향 테스트

- **신규**: `motifPresets.ts` 단위 테스트 (각 motif가 유효한 preset을 가지는지)
- **변경**: `useAudioSession` 통합 테스트 → AudioContext mock 교체 필요
  - 현재: oscillator.start() 호출 검증
  - 이후: AudioBuffer fetch + decode + source.start() 호출 검증
- **신규**: `AudioLayer.state === "loading"` 전이 테스트 (fetch 중 상태 노출)
- **유지**: E2E 테스트는 audio state transition 기준이므로 큰 변경 없음

---

## 범위 경계 의견

이슈 #16은 "audio mapping 개선"이지만, 실제로 두 가지 작업이 섞여 있다.

1. **audio engine 교체** (oscillator → sample playback): `useAudioSession.ts` 수정
2. **미지원 motif 추가** (window, lamp, desk, sea, wind, ...): `guideTemplates.ts` + 타입 확장

현재 `guideTemplates.ts`에는 4개 motif(campfire, rain, tree, star)만 있고, `domain.ts`의 `Motif` 타입에는 더 많다. **두 작업은 분리해야 한다**:
- PR-A: audio engine만 교체 (기존 4개 motif 범위 내, shared contract 변경 없음)
- PR-B: 새 motif 추가 (shared contract 변경, 먼저 합의 필요)

---

## 임시 우회 가능 여부

오디오 파일이 준비되지 않은 상태에서도 **silent fallback**(gain = 0인 노이즈 버퍼)으로 `loading → playing` 전이를 먼저 테스트 가능하다. 파일 조달과 engine 교체를 분리해서 진행할 수 있다.

---

## 결정 필요 사항

1. **라이브러리**: Web Audio API 직접 구현 vs Tone.js? → **Web Audio API 직접 구현 권장**
2. **오디오 파일 조달**: freesound.org CC0 파일을 사용할지, 직접 제작할지?
3. **motif 범위**: 이번 slice에서 4개(기존) vs PRD 전체 9개 motif?
4. **loading 실패 정책**: fetch 실패 시 silence로 fallback vs error UI 노출?
5. **작업 분리**: PR-A(engine만) + PR-B(motif 추가) 순서로 진행 동의 여부?

---

## 제안하는 다음 액션

1. 위 5가지 결정 사항을 이슈 #16에서 합의한다.
2. 합의 후 `B-AUDIO-ADAPTER` 이슈를 업데이트하고 `Workflow Status = In Progress`로 변경.
3. TDD: `motifPresets.ts` 단위 테스트 먼저 작성 → 구현.
4. `useAudioSession.ts` 교체 시 기존 oscillator 관련 테스트도 같이 교체.
5. audio 파일은 placeholder(silence 또는 CC0 임시 파일)로 시작해서 engine 교체와 분리.

---

## 검증 명령

```bash
npm run test               # motifPresets + useAudioSession 단위 테스트
npm run test:e2e           # audio state transition 시나리오
```

---

## 관련 링크

- 이슈 #16: https://github.com/gabrielwithappy/bgm-canvas/issues/16
- 구현 계획 § 단계 3: `docs/20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- B-AUDIO-ADAPTER seed: `docs/00-governance/github-issue-seeds.md`
- 영향 코드: `src/features/audio/hooks/useAudioSession.ts`

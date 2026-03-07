# 개발자 B 역할 문서

## 문서 정보
- 작성일: 2026-03-07
- 기준 문서: `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 역할: scene 해석, 오디오 엔진, 테스트 인프라, 브라우저 자동화 중심 구현
- 선행 문서: `../README.md`, `../00-governance/codex-collaboration-protocol.md`, `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 관련 문서: `2026-03-07-developer-a-role-charter.md`, `github-issue-seeds.md`
- 수정 트리거: 개발자 B 담당 범위, 오디오 엔진 방향, 테스트 기준, 개발자 A와의 계약 의존성이 바뀔 때

## 1. 문서 목적
- 이 문서는 개발자 B의 장기 역할, 책임 범위, 인터페이스, 완료 기준을 정의한다.
- 상세 작업 체크리스트와 일별 진행상황은 GitHub Issues와 Project에서 관리한다.

## 2. 작업 원칙
- 테스트는 항상 최신 `develop` 반영 후 실행한다.
- 순수 도메인 로직은 반드시 TDD로 개발한다.
- 공용 타입이나 fixture 변경 시 개발자 A에게 즉시 공유한다.
- 로컬 브라우저와 Playwright 모두에서 결과를 검증한다.

## 3. 담당 범위
- Vitest/RTL/Playwright 기반 테스트 인프라
- scene classifier 규칙 엔진
- motif fixture 세트
- audio layer diff 계산
- Tone.js adapter
- 로컬 오디오 asset 로딩
- pause/replay/reset 오디오 제어
- E2E 시나리오 자동화

## 4. 선행 합의 필요 항목
- 공용 타입 파일 위치와 export 규칙
- 초기 지원 motif 목록
- `unknown` 처리 정책
- audio state 전이 규칙
- UI에 넘길 최소 상태 값

## 5. 오디오 라이브러리 선정 및 품질 기준
### 5-1. 후보 비교
#### 후보 A. Tone.js
- 장점: Web Audio API 위에서 동작하며 `Transport`, `Player`, `Loop`, `sync()` 기반의 정밀한 스케줄링이 가능하다.
- 장점: 레이어 누적, fade in/out, 반복 재생, BPM/loop 기준 동기화가 쉬워 BGM 캔버스 요구사항과 맞는다.
- 장점: `Tone.start()`로 브라우저 autoplay unlock 흐름을 표준적으로 처리할 수 있다.
- 장점: 필요 시 effect, filter, gain automation, offline rendering까지 확장 가능하다.
- 단점: 단순 재생만 필요한 경우 howler.js보다 추상화가 무겁다.
- 단점: 라이브러리 개념을 모르면 `Transport`/clock 개념을 팀이 익혀야 한다.

#### 후보 B. howler.js
- 장점: API가 단순하고 Web Audio API 기반 + HTML5 Audio fallback을 제공한다.
- 장점: 범용 오디오 재생, sprite, preload, fade, cross-browser 대응이 쉽다.
- 장점: 배경음 1~2개 재생, 효과음 중심 앱에서는 빠르게 적용 가능하다.
- 단점: 다중 루프 레이어를 같은 타임라인 위에 정밀하게 동기화하는 기능은 Tone.js보다 약하다.
- 단점: 이 프로젝트의 핵심인 motif 누적형 레이어/재시작/undo diff 엔진과는 결합도가 낮다.
- 단점: HTML5 Audio fallback은 호환성에는 유리하지만, 샘플 정확도와 정밀한 scheduling 관점에서는 오히려 설계를 단순화하지 못한다.

#### 후보 C. 순수 Web Audio API
- 장점: 제어권과 성능 최적화 여지가 가장 크다.
- 장점: `AudioBufferSourceNode`, `GainNode` 중심으로 최소 런타임으로 구현할 수 있다.
- 단점: transport, loop 동기화, fade automation, node lifecycle, 테스트 추상화를 모두 직접 만들어야 한다.
- 단점: MVP 단계에서 개발 비용과 유지보수 비용이 가장 크다.

### 5-2. 선택 결정
- 초기 구현은 **Tone.js를 메인 오디오 엔진 라이브러리로 채택**한다.
- 엔진 계층은 `domain diff engine -> Tone adapter` 구조로 분리한다.
- Tone.js는 adapter 내부에만 가두고, 도메인 로직은 순수 TypeScript로 유지한다.
- howler.js는 이번 범위에서는 채택하지 않는다.
- 순수 Web Audio API 또는 `AudioWorklet`은 커스텀 DSP, 실시간 합성, 스트리밍 재생이 필요해질 때만 재검토한다.

선정 이유:
- 이 프로젝트는 “파일 1개 재생”보다 “motif별 루프 레이어를 계속 추가/제거하면서 같은 기준 시점에 맞춰 유지”하는 것이 핵심이다.
- 따라서 범용 플레이어보다 transport/sync 추상화가 있는 라이브러리가 더 적합하다.
- Tone.js는 Web Audio 기반이므로 브라우저 성능 하한선은 충분하고, 정밀한 재생 제어를 빠르게 구현할 수 있다.

### 5-3. 품질 기준
#### 엔진 품질
- motif 변경 시 전체 오디오 graph를 재생성하지 않고, diff 결과에 따라 필요한 layer만 추가/제거한다.
- 삭제는 hard stop 대신 기본 150~400ms fade out으로 처리해 클릭 노이즈와 이질감을 줄인다.
- 추가는 gain ramp 기반 fade in으로 처리한다.
- 모든 loop는 같은 BPM/loop length 기준으로 관리하고 `Transport`에 sync한다.
- asset decode/load는 최초 1회 preload 후 재사용한다.
- `unknown` motif는 무음 또는 매우 가벼운 fallback ambience로 제한해 오검출이 사용자 경험을 망치지 않게 한다.

#### 음원 품질
- source asset은 우선 loop가 자연스럽게 이어지는지가 1순위다.
- 각 stem은 loudness와 peak를 사전에 정리해 여러 layer가 겹쳐도 clipping이 발생하지 않게 한다.
- 초기 자산은 과한 stereo width, 긴 reverb tail, 큰 attack transient를 피한다.
- 배포 포맷은 브라우저 호환성과 용량을 고려해 `ogg` 우선, 필요 시 `wav` 원본을 병행 보관한다.

#### 테스트 품질
- 순수 함수 레벨에서 layer diff 계산을 고정 fixture로 검증한다.
- adapter mock으로 `play/pause/replay/reset` 호출 순서와 상태 전이를 검증한다.
- Playwright에서는 첫 사용자 입력 후 unlock, layer 누적, undo, reset 시나리오를 검증한다.
- 수동 검증에서는 “첫 재생 실패 없음”, “레이어 추가 시 끊김 없음”, “삭제 시 급격한 팝 노이즈 없음”을 확인한다.

### 5-4. 구현 원칙
- Tone.js는 재생 인프라로만 사용하고, motif 해석이나 layer 선택 규칙은 절대 Tone 객체에 섞지 않는다.
- adapter 인터페이스는 mock 가능해야 하며, UI는 Tone.js 타입을 직접 참조하지 않는다.
- 초기 버전은 sample playback 중심으로 구현하고, synth/effect 체인은 최소화한다.
- 성능 병목이 실제로 확인되기 전까지는 `AudioWorklet`로 넘어가지 않는다.

## 6. 핵심 책임
- scene classifier와 fixture를 통해 재현 가능한 해석 기준을 제공한다.
- audio layer diff와 state transition을 순수 TypeScript 도메인 로직으로 유지한다.
- Tone.js adapter와 asset loader를 분리해 테스트 가능성을 확보한다.
- Playwright 기반 브라우저 자동화 시나리오를 제공한다.
- 개발자 A가 소비할 수 있는 상태 값과 인터페이스를 문서/Issue로 명시한다.

## 7. 개발자 A와의 인터페이스
### B가 제공해야 하는 것
- scene 해석 함수 입력/출력 계약
- active audio layer 상태
- audio control API
- fixture와 mock adapter

### A로부터 받아야 하는 것
- 실제 캔버스 stroke 형식
- UI 버튼 이벤트 이름
- 상태 표시 방식

## 8. 완료 기준
- 공용 타입과 fixture가 UI 통합에 바로 사용 가능하다.
- scene classifier가 대표 motif와 `unknown`을 안전하게 처리한다.
- audio layer diff와 state transition이 테스트로 고정된다.
- 실제 브라우저에서 첫 입력 이후 오디오가 정상 시작된다.
- 핵심 사용자 흐름이 Playwright 시나리오로 자동화된다.

## 9. GitHub 운영 규칙
- 상세 구현 작업은 GitHub Issue로 분리한다.
- 진행상황은 GitHub Project의 `Workflow Status`로 관리한다.
- 공용 계약 영향이 있는 변경은 Issue 또는 문서 링크 없이 진행하지 않는다.
- 이 문서는 역할 자체가 바뀔 때만 수정한다.

## 10. GitHub Issue 분해 기준
- `B-TEST-INFRA`: Vitest, RTL, Playwright 기본 셋업
- `B-TYPES-FIXTURES`: 공용 타입, motif fixture, `unknown` fixture
- `B-SCENE-CLASSIFIER`: stroke grouping, motif 분류, confidence
- `B-AUDIO-DIFF`: motif -> layer mapping, add/remove diff, state transition
- `B-TONE-ADAPTER`: unlock, asset load, play/pause/replay/reset
- `B-E2E`: smoke, layer 누적, undo, reset 자동화
- `B-STABILIZATION`: develop 반영, flaky 정리, UI 통합 차이 축소

## 11. 완료 보고 기준
- 어떤 도메인 로직과 테스트를 구현했는지
- 어떤 fixture와 asset mapping을 추가했는지
- Playwright에서 검증한 유즈 케이스가 무엇인지
- 개발자 A가 UI 통합 시 알아야 할 계약 변경이 있는지

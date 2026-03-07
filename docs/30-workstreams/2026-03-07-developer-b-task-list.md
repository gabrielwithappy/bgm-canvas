# 개발자 B 작업 문서

## 문서 정보
- 작성일: 2026-03-07
- 기준 문서: `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 역할: scene 해석, 오디오 엔진, 테스트 인프라, 브라우저 자동화 중심 구현
- 선행 문서: `../README.md`, `../00-governance/codex-collaboration-protocol.md`, `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 관련 문서: `2026-03-07-developer-a-task-list.md`
- 수정 트리거: 개발자 B 담당 범위, 오디오 엔진 방향, 테스트 기준, 개발자 A와의 계약 의존성이 바뀔 때

## 1. 작업 원칙
- 테스트는 항상 최신 `develop` 반영 후 실행한다.
- 순수 도메인 로직은 반드시 TDD로 개발한다.
- 공용 타입이나 fixture 변경 시 개발자 A에게 즉시 공유한다.
- 로컬 브라우저와 Playwright 모두에서 결과를 검증한다.

## 2. 작업 시작 루틴
```bash
git fetch origin
git pull --rebase origin develop
npm install
npm run test
```

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

### 5-5. 참고 근거
- Tone.js 공식 문서는 browser autoplay 정책 대응을 위해 사용자 입력 이후 `Tone.start()` 호출을 요구한다.
- Tone.js 공식 문서는 `Transport`와 `sync()` 기반으로 여러 source를 같은 타임라인에 맞춰 제어하는 방식을 제공한다.
- howler.js 공식 문서는 Web Audio API를 기본으로 사용하고 HTML5 Audio fallback을 제공하지만, 핵심 포지션은 범용 재생 라이브러리다.
- MDN은 `AudioBufferSourceNode`가 타이밍 정확도가 필요한 메모리 기반 오디오 재생에 적합하다고 설명한다.
- MDN은 `AudioWorklet`을 별도 오디오 스레드에서의 저지연 커스텀 처리 용도로 설명하므로 현재 MVP 범위에서는 과도하다.

## 6. 단계별 상세 할 일
### 단계 B-0. 테스트 인프라 구성
- [ ] Vitest 설정을 완료한다.
- [ ] React Testing Library 기본 셋업을 추가한다.
- [ ] Playwright 설정과 로컬 dev server 연동을 만든다.
- [ ] 테스트 유틸과 fixture 디렉터리를 만든다.

TDD:
- [ ] smoke test를 먼저 만들고 설정이 올바른지 검증한다.

완료 기준:
- [ ] `npm run test` 통과
- [ ] `npm run test:e2e` smoke 시나리오 통과

### 단계 B-1. 공용 타입과 fixture 고정
- [ ] `Stroke`, `Motif`, `SceneElement`, `AudioLayer` 타입 파일을 만든다.
- [ ] 대표 motif fixture를 작성한다.
- [ ] `unknown` fixture도 작성한다.

TDD:
- [ ] fixture shape validation 테스트 작성
- [ ] 타입 계약을 사용하는 reducer/unit 테스트 샘플 작성

완료 기준:
- [ ] 개발자 A가 바로 소비할 수 있는 공용 타입이 있다.
- [ ] classifier 테스트에 사용할 fixture가 준비된다.

### 단계 B-2. scene classifier MVP
- [ ] stroke grouping 규칙을 만든다.
- [ ] bounding box, density, orientation 기반 분류기를 구현한다.
- [ ] `campfire`, `rain`, `tree`, `star`, `wind`, `unknown`을 지원한다.
- [ ] confidence 계산을 추가한다.

TDD:
- [ ] 각 motif fixture별 실패 테스트를 먼저 작성한다.
- [ ] `unknown` fallback 테스트를 작성한다.

완료 기준:
- [ ] fixture 기준 motif 분류가 재현 가능하다.
- [ ] 잘못된 입력도 안전하게 fallback 된다.

브라우저 검증:
- [ ] 개발자 A UI와 연결 후 예시 그림 5종 확인

### 단계 B-3. 오디오 엔진과 layer diff
- [ ] motif -> audio asset mapping을 구현한다.
- [ ] 기존 layer 유지 + 새 layer 추가 diff 알고리즘을 만든다.
- [ ] 삭제 시 stop/fade out 규칙을 넣는다.
- [ ] 오디오 상태 전이를 정의한다.

TDD:
- [ ] layer diff 계산 테스트 작성
- [ ] delete 이후 stop 대상 계산 테스트 작성
- [ ] 상태 전이 테스트 작성

완료 기준:
- [ ] motif 추가 시 레이어가 누적된다.
- [ ] motif 삭제 시 해당 레이어만 빠진다.

### 단계 B-4. Tone.js adapter
- [ ] 사용자 입력 이후 `Tone.start()` unlock을 처리한다.
- [ ] 로컬 audio asset을 로딩한다.
- [ ] play/pause/replay/reset adapter 메서드를 만든다.
- [ ] mock adapter와 실제 adapter 인터페이스를 분리한다.

TDD:
- [ ] adapter mock 기반 통합 테스트 작성
- [ ] play/pause/reset 호출 순서 테스트 작성

완료 기준:
- [ ] 브라우저 오디오 정책 때문에 첫 재생이 막히지 않는다.
- [ ] 실제 로컬 오디오 파일이 재생된다.

브라우저 검증:
- [ ] 실제 브라우저에서 첫 그림 이후 오디오가 시작되는지 확인

### 단계 B-5. Playwright E2E 자동화
- [ ] 홈 화면 smoke 시나리오 작성
- [ ] 드로잉 후 playing 상태 확인 시나리오 작성
- [ ] layer 누적 시나리오 작성
- [ ] undo 후 layer 감소 시나리오 작성
- [ ] pause/replay/reset 시나리오 작성

TDD:
- [ ] 실패하는 E2E 시나리오를 먼저 만들고 이후 구현과 함께 통과시킨다.

완료 기준:
- [ ] 핵심 유즈 케이스가 Playwright로 자동화된다.
- [ ] trace 저장과 headed 실행이 가능하다.

### 단계 B-6. 통합 안정화
- [ ] 개발자 A 브랜치 변경을 반영한다.
- [ ] 공용 타입 충돌 여부를 확인한다.
- [ ] fixture와 실제 UI 입력 간 괴리를 줄인다.
- [ ] flaky test를 정리한다.

완료 기준:
- [ ] 최신 `develop` 기준 전체 테스트가 통과한다.
- [ ] 브라우저 자동화와 수동 실행 결과가 크게 다르지 않다.

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

## 8. 통합 전 체크리스트
- [ ] 최신 `develop` 동기화 완료
- [ ] `npm run test` 통과
- [ ] `npm run test:e2e` 통과
- [ ] 개발자 A 변경을 반영한 뒤 fixture mismatch 없음
- [ ] trace 확인이 가능한 실패 로그 환경 유지

## 9. 브라우저 자동 검증 시나리오
### 필수 자동화
1. 홈 화면 로드
2. 선 그리기
3. motif 상태 노출
4. playing 상태 변경
5. 추가 드로잉 후 active layer 증가
6. undo 후 active layer 감소
7. reset 후 빈 상태 복귀

### 수동 보조 검증
1. 브라우저에서 실제 소리가 나는지 확인
2. 첫 입력 전후 audio unlock이 자연스러운지 확인
3. 너무 짧거나 끊기는 오디오가 없는지 확인

## 10. 완료 보고 기준
- 어떤 도메인 로직과 테스트를 구현했는지
- 어떤 fixture와 asset mapping을 추가했는지
- Playwright에서 검증한 유즈 케이스가 무엇인지
- 개발자 A가 UI 통합 시 알아야 할 계약 변경이 있는지

# GitHub Issue 초안

## 문서 정보
- 목적: GitHub Issue와 Project에서 실제 작업을 생성할 때 사용할 초기 작업 분해 기준을 제공한다.
- 선행 문서: `../README.md`, `codex-collaboration-protocol.md`
- 관련 문서: `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 수정 트리거: owner mapping, 구현 단계, 작업 분해 기준이 바뀔 때

## 원칙
- 이 문서는 실제 진행상황 문서가 아니라 Issue 생성용 seed 목록이다.
- 진행상황은 GitHub Project `Workflow Status`로 관리한다.
- 공용 계약 영향이 있는 이슈는 반드시 관련 문서 링크를 포함한다.
- 각 이슈는 `failing test first`, `권장 superpower skill`, `검증 명령`, `완료 조건`을 포함해야 한다.
- 독립된 이슈 2개 이상은 `dispatching-parallel-agents` 대상으로 검토한다.
- guided input 전략이 합의된 이후에는 자유 드로잉 classifier 확장보다 guide 기반 입력과 deterministic mapping 이슈를 우선한다.

## 개발자 A seed
### A-UI-BOOTSTRAP
- 목적: 앱 뼈대, 캔버스 레이아웃, 빈 상태 UI
- 선행 계약/문서: 구현 계획 단계 0, `Stroke` 초기 shape
- 권장 superpower skill: `using-superpowers`, `test-driven-development`
- failing test first: 빈 캔버스와 기본 레이아웃 smoke test
- 완료 조건: 빈 캔버스 렌더, 기본 테스트 통과
- 필수 검증 명령: `npm run test`, `npm run test:e2e`

### A-GUIDE-PALETTE
- 목적: 입력 가능한 prebuilt motif 목록과 선택 UI 제공
- 선행 계약/문서: guided motif 목록, `GuideTemplate` shape
- 권장 superpower skill: `test-driven-development`
- failing test first: guide 목록 렌더, guide 선택 상태 변경
- 완료 조건: 사용자가 입력 가능한 모티프를 바로 이해하고 선택할 수 있음
- 필수 검증 명령: `npm run test`, `npm run test:e2e`

### A-GUIDE-OVERLAY
- 목적: 선택된 guide를 캔버스 위에 overlay 또는 힌트 형태로 표시
- 선행 계약/문서: guide preview path, 입력 상태 UI 계약
- 권장 superpower skill: `test-driven-development`
- failing test first: 선택된 guide overlay 렌더, 현재 입력 motif 표시
- 완료 조건: 사용자가 무엇을 따라 입력해야 하는지 캔버스에서 바로 볼 수 있음
- 필수 검증 명령: `npm run test`

### A-UNDO-RESET
- 목적: undo/reset 상호작용과 비활성화 규칙
- 선행 계약/문서: guided input undo/reset 정책
- 권장 superpower skill: `test-driven-development`
- failing test first: undo 후 마지막 입력 제거, reset 후 전체 초기화
- 완료 조건: undo/reset이 guided scene/audio 상태와 함께 반영
- 필수 검증 명령: `npm run test`

### A-STATE-UI
- 목적: selected guide, motif badge, active layer, audio state UI
- 선행 계약/문서: `SceneElement`, `AudioLayer`, guided input 상태 계약
- 권장 superpower skill: `test-driven-development`
- failing test first: selected guide 노출, motif badge 렌더, active layer count 노출
- 완료 조건: guide/scene/audio 상태가 UI에서 관찰 가능
- 필수 검증 명령: `npm run test`

### A-SESSION-UI
- 목적: pause/replay/reset UI, 온보딩, 접근성
- 선행 계약/문서: session control 이벤트 계약, guided 온보딩 문구
- 권장 superpower skill: `test-driven-development`, `verification-before-completion`
- failing test first: controls 상호작용, 온보딩 문구 노출
- 완료 조건: pause/replay/reset과 접근성 최소 기준 충족
- 필수 검증 명령: `npm run test`, `npm run test:e2e`

### A-MANUAL-QA
- 목적: 학생/성인 수동 시나리오 검증
- 선행 계약/문서: PRD 유즈케이스 1~5
- 권장 superpower skill: `verification-before-completion`
- failing test first: 해당 없음, 수동 시나리오 체크리스트 작성이 선행
- 완료 조건: 핵심 사용자 시나리오 수동 검증 완료
- 필수 검증 명령: headed Playwright 또는 수동 브라우저 검증 로그

## 개발자 B seed
### B-TEST-INFRA
- 목적: Vitest, RTL, Playwright 기본 셋업
- 선행 계약/문서: 구현 계획 단계 0
- 권장 superpower skill: `test-driven-development`
- failing test first: smoke test, e2e smoke scenario
- 완료 조건: 테스트 인프라와 기본 명령 동작
- 필수 검증 명령: `npm run test`, `npm run test:e2e`

### B-TYPES-FIXTURES
- 목적: 공용 타입, guide fixture, motif fixture, `unknown` fixture
- 선행 계약/문서: shared contract
- 권장 superpower skill: `test-driven-development`
- failing test first: fixture shape validation, 타입 계약 테스트
- 완료 조건: UI와 classifier가 공용 타입을 바로 소비 가능
- 필수 검증 명령: `npm run test`

### B-GUIDE-MATCH
- 목적: guide 선택 상태에서 입력 성공/실패를 판정하는 규칙 구현
- 선행 계약/문서: guide success criteria, `GuidedInputState`, `unknown` 정책
- 권장 superpower skill: `test-driven-development`, `dispatching-parallel-agents`
- failing test first: trace progress 계산, match 성공/실패, retry 상태
- 완료 조건: 지원된 guide 입력은 높은 재현성으로 같은 motif를 생성함
- 필수 검증 명령: `npm run test`

### B-SCENE-MAPPING
- 목적: guided input 결과를 scene element로 변환
- 선행 계약/문서: `SceneElement`, `source`, confidence 정책
- 권장 superpower skill: `test-driven-development`
- failing test first: guide match 결과의 scene element 생성, `unknown` fallback
- 완료 조건: guide 입력 결과가 testable한 scene contract로 변환됨
- 필수 검증 명령: `npm run test`

### B-AUDIO-DIFF
- 목적: motif -> layer mapping, add/remove diff, state transition
- 선행 계약/문서: `AudioLayer` shape, 최소 audio state, deterministic preset 정책
- 권장 superpower skill: `test-driven-development`
- failing test first: add/keep/remove diff, fade-out 대상 계산, state transition
- 완료 조건: motif 추가/삭제에 따라 layer 상태가 정확히 계산됨
- 필수 검증 명령: `npm run test`

### B-AUDIO-ADAPTER
- 목적: unlock, preset load, play/pause/replay/reset adapter
- 선행 계약/문서: audio control API, autoplay 정책, motif preset 매핑
- 권장 superpower skill: `test-driven-development`, `verification-before-completion`
- failing test first: unlock, play/pause/reset 호출 순서, preset load
- 완료 조건: 첫 사용자 입력 이후 오디오 시작과 세션 컨트롤 동작
- 필수 검증 명령: `npm run test`, `npm run test:e2e`

### B-E2E
- 목적: guided flow, layer 누적, undo, reset 자동화
- 선행 계약/문서: PRD 유즈케이스 1~5
- 권장 superpower skill: `test-driven-development`, `dispatching-parallel-agents`
- failing test first: guide 선택, 입력 성공, layer 누적, undo, reset Playwright 시나리오
- 완료 조건: 핵심 유즈케이스 자동화
- 필수 검증 명령: `npm run test:e2e -- --headed`, `npm run test:e2e -- --trace on`

### B-STABILIZATION
- 목적: develop 반영, flaky 정리, guided UI 통합 차이 축소
- 선행 계약/문서: 전체 구현 계획
- 권장 superpower skill: `verification-before-completion`, `dispatching-parallel-agents`
- failing test first: flaky 재현 테스트 또는 최소 재현 시나리오
- 완료 조건: 최신 develop 기준 테스트와 브라우저 검증 안정화
- 필수 검증 명령: 전체 test + e2e 재실행

## Shared seed
### SHARED-CONTRACT-TYPES
- 목적: 공용 타입, guide 이벤트, fixture 계약 확정
- 선행 계약/문서: 구현 계획 owner mapping, 공용 계약 항목
- 권장 superpower skill: `test-driven-development`
- failing test first: 타입 shape와 이벤트 payload 검증
- 완료 조건: 타입 변경 시 관련 테스트/문서/issue가 같이 갱신됨
- 필수 검증 명령: `npm run test`

### SHARED-GUIDED-INPUT
- 목적: guided input 기본 정책, success criteria, retry 정책 확정
- 선행 계약/문서: PRD 입력 모델, 구현 계획 단계 1/2
- 권장 superpower skill: `test-driven-development`
- failing test first: success/failure 상태와 UI 노출 상태 검증
- 완료 조건: guides, canvas, scene이 같은 입력 계약을 사용
- 필수 검증 명령: `npm run test`

### SHARED-AUDIO-STATE
- 목적: UI에 노출할 최소 audio state와 state transition 확정
- 선행 계약/문서: PRD acceptance, 오디오 엔진 규칙
- 권장 superpower skill: `test-driven-development`
- failing test first: state transition과 UI 노출 상태 검증
- 완료 조건: UI와 audio adapter가 같은 상태 계약을 사용
- 필수 검증 명령: `npm run test`

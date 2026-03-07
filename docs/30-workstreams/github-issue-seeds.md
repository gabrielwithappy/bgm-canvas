# GitHub Issue 초안

## 문서 정보
- 목적: `30-workstreams` 역할 문서를 GitHub Issue와 Project 운영으로 연결하기 위한 초기 작업 분해 초안
- 선행 문서: `../README.md`, `../00-governance/codex-collaboration-protocol.md`
- 관련 문서: `2026-03-07-developer-a-role-charter.md`, `2026-03-07-developer-b-role-charter.md`
- 수정 트리거: 역할 문서 기준 작업 단위가 달라질 때

## 원칙
- 이 문서는 실제 진행상황 문서가 아니라, GitHub Issue 생성 시 복사해 쓸 초기 seed 목록이다.
- 진행상황은 GitHub Project `Workflow Status`로 관리한다.
- 공용 계약 영향이 있는 이슈는 반드시 관련 문서 링크를 포함한다.

## 개발자 A seed
### A-UI-BOOTSTRAP
- 목적: 앱 뼈대, 캔버스 레이아웃, 빈 상태 UI
- 관련 문서: `2026-03-07-developer-a-role-charter.md`

### A-CANVAS-DRAWING
- 목적: pointer 입력, stroke 렌더링, 검은색 단일 선
- 관련 문서: `2026-03-07-developer-a-role-charter.md`

### A-UNDO-RESET
- 목적: undo/reset/erase 상호작용과 비활성화 규칙
- 관련 문서: `2026-03-07-developer-a-role-charter.md`

### A-STATE-UI
- 목적: motif badge, active layer, audio state UI
- 관련 문서: `2026-03-07-developer-a-role-charter.md`

### A-SESSION-UI
- 목적: pause/replay/reset UI, 온보딩, 접근성
- 관련 문서: `2026-03-07-developer-a-role-charter.md`

### A-MANUAL-QA
- 목적: 학생/성인 수동 시나리오 검증
- 관련 문서: `2026-03-07-developer-a-role-charter.md`

## 개발자 B seed
### B-TEST-INFRA
- 목적: Vitest, RTL, Playwright 기본 셋업
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

### B-TYPES-FIXTURES
- 목적: 공용 타입, motif fixture, `unknown` fixture
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

### B-SCENE-CLASSIFIER
- 목적: stroke grouping, motif 분류, confidence 계산
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

### B-AUDIO-DIFF
- 목적: motif -> layer mapping, add/remove diff, state transition
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

### B-TONE-ADAPTER
- 목적: unlock, asset load, play/pause/replay/reset adapter
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

### B-E2E
- 목적: smoke, layer 누적, undo, reset 자동화
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

### B-STABILIZATION
- 목적: develop 반영, flaky 정리, UI 통합 차이 축소
- 관련 문서: `2026-03-07-developer-b-role-charter.md`

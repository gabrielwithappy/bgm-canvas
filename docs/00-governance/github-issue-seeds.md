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

## 개발자 A seed
### A-UI-BOOTSTRAP
- 목적: 앱 뼈대, 캔버스 레이아웃, 빈 상태 UI

### A-CANVAS-DRAWING
- 목적: pointer 입력, stroke 렌더링, 검은색 단일 선

### A-UNDO-RESET
- 목적: undo/reset/erase 상호작용과 비활성화 규칙

### A-STATE-UI
- 목적: motif badge, active layer, audio state UI

### A-SESSION-UI
- 목적: pause/replay/reset UI, 온보딩, 접근성

### A-MANUAL-QA
- 목적: 학생/성인 수동 시나리오 검증

## 개발자 B seed
### B-TEST-INFRA
- 목적: Vitest, RTL, Playwright 기본 셋업

### B-TYPES-FIXTURES
- 목적: 공용 타입, motif fixture, `unknown` fixture

### B-SCENE-CLASSIFIER
- 목적: stroke grouping, motif 분류, confidence 계산

### B-AUDIO-DIFF
- 목적: motif -> layer mapping, add/remove diff, state transition

### B-TONE-ADAPTER
- 목적: unlock, asset load, play/pause/replay/reset adapter

### B-E2E
- 목적: smoke, layer 누적, undo, reset 자동화

### B-STABILIZATION
- 목적: develop 반영, flaky 정리, UI 통합 차이 축소

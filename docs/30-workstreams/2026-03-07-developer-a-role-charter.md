# 개발자 A 역할 문서

## 문서 정보
- 작성일: 2026-03-07
- 기준 문서: `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 역할: 캔버스 입력, 시각 UI, 온보딩, 사용자 상호작용 중심 구현
- 선행 문서: `../README.md`, `../00-governance/codex-collaboration-protocol.md`, `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 관련 문서: `2026-03-07-developer-b-role-charter.md`, `github-issue-seeds.md`
- 수정 트리거: 개발자 A 담당 범위, 완료 기준, 개발자 B와의 계약 의존성이 바뀔 때

## 1. 문서 목적
- 이 문서는 개발자 A의 장기 역할, 책임 범위, 인터페이스, 완료 기준을 정의한다.
- 상세 작업 체크리스트와 일별 진행상황은 이 문서가 아니라 GitHub Issues와 Project에서 관리한다.

## 2. 작업 원칙
- 작업 시작 전 최신 `develop`을 반영한다.
- 구현 전 테스트를 먼저 작성한다.
- 공용 타입 변경은 개발자 B와 먼저 합의한다.
- 각 작업은 로컬 브라우저에서 직접 확인한다.

## 3. 담당 범위
- Vite/React 앱 기본 UI
- 캔버스 렌더링
- pointer 기반 드로잉 입력
- 검은색 단일 선 UI
- undo/reset/erase 상호작용
- scene/motif 상태 표시 UI
- 재생/일시정지/온보딩 UI
- 수동 브라우저 QA

## 4. 선행 합의 필요 항목
- `Stroke`, `SceneElement`, `AudioLayer` 타입
- `unknown` motif 처리 방식
- undo 시 UI 반영 규칙
- 활성 레이어 표시 형식

## 5. 핵심 책임
- 사용자가 즉시 그림을 시작할 수 있는 캔버스 UI를 제공한다.
- 드로잉, undo, reset, erase 상호작용을 안정적으로 노출한다.
- scene/motif 및 오디오 상태를 사용자가 이해할 수 있는 UI로 표시한다.
- 오디오 엔진 상태를 직접 구현하지 않고, 개발자 B가 제공하는 계약을 UI에 연결한다.
- 브라우저에서 실제 사용자 흐름을 수동 검증하고 UI 이슈를 조기에 발견한다.

## 6. 개발자 B와의 인터페이스
### A가 제공해야 하는 것
- 캔버스에서 생성한 stroke 데이터 구조
- undo/reset 이후 최신 stroke 집합
- 현재 선택/삭제 이벤트

### B로부터 받아야 하는 것
- stroke -> motif 해석 결과
- motif -> active audio layer 상태
- audio control 이벤트 결과

## 7. 완료 기준
- 사용자가 마우스/터치로 검은색 단일 선을 그릴 수 있다.
- undo/reset/erase가 최소 요구 수준으로 동작한다.
- motif 및 active audio layer 상태가 UI에 반영된다.
- 재생/일시정지와 온보딩 UI가 동작한다.
- 로컬 브라우저 기준 핵심 사용자 흐름이 깨지지 않는다.

## 8. GitHub 운영 규칙
- 상세 구현 작업은 GitHub Issue로 분리한다.
- 진행상황은 GitHub Project의 `Workflow Status`로 관리한다.
- 공용 계약 영향이 있는 변경은 Issue 또는 문서 링크 없이 진행하지 않는다.
- 이 문서는 역할 자체가 바뀔 때만 수정한다.

## 9. GitHub Issue 분해 기준
- `A-UI-BOOTSTRAP`: 앱 뼈대, 캔버스 영역, 빈 상태 UI
- `A-CANVAS-DRAWING`: pointer 입력, stroke 렌더링, 검은색 단일 선
- `A-UNDO-RESET`: undo/reset/erase 상호작용
- `A-STATE-UI`: motif badge, active layer, audio state 표시
- `A-SESSION-UI`: pause/replay/reset 버튼, 온보딩, 접근성
- `A-MANUAL-QA`: 학생/성인 시나리오 수동 검증

## 10. 완료 보고 기준
- 어떤 화면/상호작용을 구현했는지
- 어떤 테스트를 추가했는지
- 브라우저에서 무엇을 직접 확인했는지
- 개발자 B가 이어서 통합할 때 알아야 할 계약 변경이 있는지

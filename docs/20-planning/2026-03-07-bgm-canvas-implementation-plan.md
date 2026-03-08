# BGM Canvas 구현 계획

## 문서 정보
- 작성일: 2026-03-07
- 기준 문서: `../10-product/prd.md`
- 목표: 사용자가 미리 제공된 모티프 가이드를 선택하거나 따라 그리면, 해당 모티프에 맞는 BGM/환경음이 누적되는 MVP를 TDD 기반으로 구현한다.
- 선행 문서: `../README.md`, `../00-governance/codex-collaboration-protocol.md`, `../10-product/prd.md`
- 관련 문서: `../00-governance/github-issue-seeds.md`
- 수정 트리거: 기술 스택, 아키텍처, 단계 계획, 공용 계약의 기본 방향이 바뀔 때

## 1. 구현 원칙
- `작게 출시`: 각 단계는 독립적으로 실행 가능하고, 브라우저에서 바로 검증 가능해야 한다.
- `TDD 우선`: 도메인 로직과 입력 판정 규칙은 Vitest로 failing test를 먼저 작성한 뒤 구현한다.
- `계약 우선`: guided motif, 입력 상태, audio layer 상태 같은 공용 계약을 먼저 고정한다.
- `입력 단순화 우선`: 초기 MVP는 자유 드로잉 해석 성능보다, 사용자가 쉽게 성공할 수 있는 입력 구조를 우선한다.
- `결정적 매핑 우선`: 초기 MVP는 uncertain classifier보다, guide 기반 motif -> scene -> audio 매핑을 우선한다.
- `프런트엔드 우선`: MVP는 서버 없는 클라이언트 중심 구조로 시작한다.
- `브라우저 검증 필수`: 각 단계 종료 시 Playwright로 핵심 유즈 케이스를 실제 브라우저에서 검증한다.
- `동기화 후 테스트`: 모든 테스트 실행 전 최신 `develop` 브랜치를 pull 받아 로컬 기준선을 먼저 맞춘다.
- `superpowers 우선`: 구현 시작 전 `using-superpowers`를 확인하고, 구현은 `test-driven-development`와 `subagent-driven-development`를 기본으로 사용한다.
- `병렬 처리 허용`: 2개 이상의 독립 작업 단위가 있을 때는 `dispatching-parallel-agents`를 사용해 병렬 처리하되, shared contract 변경은 병렬 작업에서 분리한다.
- `완료 주장 금지`: 완료나 성공을 주장하기 전 `verification-before-completion` 기준으로 fresh verification evidence를 남긴다.

## 2. 권장 기술 스택
### 애플리케이션
- `React + TypeScript`
- `Vite`
- `HTML Canvas 2D API`
- `Web Audio API` 또는 `Tone.js`
- `plain CSS`

### 테스트
- `Vitest`
- `React Testing Library`
- `Playwright`

### 개발 환경
- `Node.js 20+`
- `npm`
- `로컬 파일 기반 오디오 asset 관리`

## 3. 기술 선택 이유
- `React + TypeScript`: guided input 상태, motif 상태, audio 상태를 명확한 타입 계약으로 분리하기 쉽다.
- `Vite`: 빠른 로컬 실행과 반복 검증에 적합하다.
- `HTML Canvas 2D API`: 따라 그리기 가이드, overlay, 제한된 입력 판정 정도는 무거운 드로잉 라이브러리 없이도 구현 가능하다.
- `Web Audio API` 또는 `Tone.js`: 초기 MVP에서는 motif별 deterministic 반응을 빠르게 구현하는 것이 우선이며, 이후 asset 기반 재생이 필요해지면 Tone.js adapter로 확장할 수 있다.
- `Vitest`: guided input 판정, scene mapping, layer diff 같은 순수 로직 테스트에 적합하다.
- `Playwright`: 실제 사용자가 가이드를 보고 입력하는 흐름을 검증하기 좋다.

## 4. 제안 아키텍처
이 MVP는 `로컬 실행 전용`을 전제로 한다. 별도 API 서버, DB, 인증, 배포 인프라는 두지 않는다.

## 4-1. Owner Mapping
- Erick owner: `canvas`, `guide UI`, `session controls`, 수동 브라우저 QA
- Gabriel owner: `scene mapping`, `audio engine`, `test infrastructure`, 브라우저 자동화
- shared contract: 공용 타입, motif schema, guided input state, audio state, UI에 노출할 최소 상태 값
- owner는 작업 백로그를 뜻하지 않고, 최종 수정 책임과 문의 라우팅 기준을 뜻한다.
- 실제 작업 단위와 진행상황은 GitHub Issues와 Project에서 관리한다.

## 4-2. 개발 리소스 계획
- 현재 기본 리소스는 사람 개발자 2명 + 각 개발자가 사용하는 Codex 조합을 기준으로 한다.
- 반복 구현 리소스는 `superpowers` skill 기반 subagent 및 parallel agent dispatch를 포함한다.
- 추가 개발자 또는 추가 Codex가 투입되면 먼저 owner mapping과 shared contract 경계를 확인한 뒤 작업을 분해한다.

### 현재 기준 리소스
- Erick + Erick의 Codex: canvas, guide UI, session controls, 수동 브라우저 QA
- Gabriel + Gabriel의 Codex: scene mapping, audio engine, test infrastructure, 브라우저 자동화
- Shared: 타입, 이벤트 계약, audio state, fixture shape, motif schema

### 확장 가능한 리소스 축
- UI/interaction 축: guide palette, overlay, session controls
- scene/audio 축: guide match, deterministic mapping, layer diff, adapter
- test/verification 축: Vitest, RTL, Playwright, trace 분석
- integration/polish 축: 브라우저 검증, flaky 정리, 접근성 확인

### 병렬 처리 가능 영역
- 서로 다른 서브시스템을 수정하는 작업
- 서로 다른 테스트 도메인을 수정하는 작업
- smoke/integration/e2e처럼 원인이 분리된 실패 분석
- UI 작업과 scene/audio 작업처럼 shared contract가 이미 고정된 영역

### 병렬 처리 금지 또는 직렬 우선 영역
- shared contract 변경
- guided motif 목록 변경
- guide success/failure 판정 규칙 변경
- 최소 audio state 노출 계약 변경
- scene/audio event 이름과 payload shape 변경

### 새 개발자/새 Codex 온보딩 순서
1. `docs/README.md` 읽기
2. `codex-collaboration-protocol.md` 확인
3. owner mapping과 shared contract 확인
4. `github-issue-seeds.md`에서 적절한 작업 단위 선택
5. 관련 GitHub Issue와 handoff 기록 확인
6. 구현 전 relevant superpower skill 확인

### 리소스 증가 시 운영 원칙
- 새 인원은 shared contract owner가 아닌, 독립 서브시스템 owner부터 맡긴다.
- 새 Codex는 기존 이슈를 병렬 분해할 수 있을 때만 투입한다.
- 병렬 처리 전 `독립 작업인가, shared state가 없는가`를 먼저 판별한다.
- 사람 개발자 수가 늘어나도 공용 계약 변경은 소수 owner가 승인한다.

### 프런트엔드 계층
- `app`: 라우트, 레이아웃, 최상위 상태 조립
- `features/guides`: 모티프 가이드 목록, 선택 상태, overlay 렌더링
- `features/canvas`: 입력 수집, trace 진행 상태, undo/reset
- `features/scene`: guided input을 scene element로 변환하는 규칙
- `features/audio`: scene element를 사운드 레이어로 변환하고 재생하는 엔진
- `features/session`: replay, pause, reset, 현재 세션 상태 표시
- `shared`: 타입, 유틸, 테스트 헬퍼

### 핵심 도메인 계약
```ts
type Motif =
  | "campfire"
  | "rain"
  | "wind"
  | "tree"
  | "star"
  | "sea"
  | "window"
  | "lamp"
  | "desk"
  | "unknown"

type GuideTemplate = {
  id: string
  motif: Motif
  label: string
  previewPath: Array<{ x: number; y: number }>
}

type GuidedInputState = {
  selectedGuideId: string | null
  status: "idle" | "tracing" | "matched" | "failed"
  progress: number
}

type SceneElement = {
  id: string
  motif: Motif
  source: "guide-match" | "guide-select"
  confidence: number
}

type AudioLayer = {
  elementId: string
  motif: Motif
  state: "idle" | "loading" | "playing" | "stopped"
}
```

### 모듈 경계
- `guides`는 사용 가능한 입력 모티프와 overlay를 제공한다.
- `canvas`는 사용자의 실제 선 입력과 trace 진행 상태를 관리한다.
- `scene`은 guided input 결과를 scene element로 확정한다.
- `audio`는 scene element 집합을 받아 layer diff를 계산하고 재생한다.
- `session`은 undo/reset/pause/replay 시 `scene`과 `audio`를 동기화한다.

이 계약을 먼저 고정하면 개발자 2명이 충돌 없이 병렬 작업할 수 있다.

## 5. TDD 개발 규칙
### 단위 테스트 우선 순서
1. 순수 함수 테스트 작성
2. 구현
3. 리팩터링
4. 컴포넌트 테스트 작성
5. 브라우저 E2E 테스트 추가

### 필수 실행 규칙
- 각 단계는 최소 1개 이상의 failing test를 먼저 만든 뒤 구현을 시작한다.
- 독립된 작업이 2개 이상이면 `dispatching-parallel-agents`로 병렬 처리할 수 있다.
- 병렬 처리 대상은 서로 다른 파일/서브시스템/테스트 도메인이어야 하며, shared contract 변경은 직렬로 처리한다.
- 각 단계 완료 전에는 검증 명령을 다시 실행하고 결과를 Issue 또는 PR에 남긴다.

### TDD 적용 대상
- guide 선택 reducer
- trace progress 계산
- guide match 판정 규칙
- motif -> scene element 변환
- layer diff 계산
- undo/reset reducer
- 오디오 상태 전이

### 테스트 피라미드
- `단위 테스트`: 도메인 함수와 reducer
- `통합 테스트`: React 컴포넌트와 audio adapter 경계
- `E2E 테스트`: guide 선택, 입력 성공, 사운드 시작, 수정, 초기화

### 협업 테스트 규칙
1. 테스트 전 `git fetch origin` 수행
2. 최신 `origin/develop` 기준 변경 사항 확인
3. 현재 작업 브랜치에서 최신 `develop`을 pull 또는 rebase 반영
4. 의존성 변경이 있으면 패키지 재설치
5. 그 다음 단위/통합/E2E 테스트 실행

목적:
- 두 개발자가 병렬 작업 중일 때 오래된 기준선에서 테스트가 통과하는 착시를 막는다.
- 공용 타입, fixture, 이벤트 계약 변경을 조기에 감지한다.

## 6. 단계별 구현 계획
각 단계는 `완료 조건`, `검증 방법`, `병렬 작업`이 명확해야 한다.

### 6-0. Current Execution Slice
- 기준 시점: 2026-03-08
- 현재 착수 범위: `입력 모델 전환 준비`
- 이번 실행의 목표:
  - MVP 입력 전략을 자유 드로잉 해석 중심에서 guided input 중심으로 공식화
  - PRD, 구현 계획, issue seed를 새 입력 모델에 맞게 정렬
  - 현재 프로토타입의 자유 stroke classifier는 유지하되, 다음 구현 slice의 기본 방향을 guide 기반으로 전환
- 이번 실행에서 의도적으로 미루는 항목:
  - 다중 stroke 객체 인식의 본격 확장
  - 완전 자유 드로잉 품질 개선
  - 고급 audio polish
- handoff 메모:
  - 다음 Codex는 guided motif, input success criteria, deterministic audio mapping을 shared contract 시작점으로 사용한다.
  - 기존 `src/features/scene/model/classifyScene.ts`는 임시 프로토타입으로 보고, 장기 기준선으로 간주하지 않는다.

### 단계 0. 프로젝트 부트스트랩
목표:
- React + TypeScript + Vite 프로젝트 생성
- 테스트 러너와 기본 폴더 구조 확정
- 공용 타입과 스크립트 정의
- 로컬 전용 실행 환경 확정

선행 계약:
- 공용 타입 파일 위치
- 테스트 디렉터리 구조

TDD:
- failing smoke test를 먼저 작성한다.
- 설정 파일은 smoke test가 실패하는 이유를 해소하는 최소 변경만 한다.

작업:
- Vite React TS 템플릿 초기화
- Vitest, RTL, Playwright 설정
- `src/features`, `src/shared`, `tests/e2e` 구조 생성
- 공용 타입 파일과 fixture 작성
- 로컬 오디오 asset 폴더 구조 생성

병렬 처리:
- Erick: 앱 셸, 레이아웃, 빈 캔버스 렌더
- Gabriel: Vitest/RTL/Playwright 설정

검증 명령:
- `npm run test`
- `npm run test:e2e`

완료 조건:
- 앱이 빈 캔버스를 띄운다.
- `npm run test`, `npm run test:e2e`가 빈 상태로 통과한다.
- `npm run dev`만으로 로컬 브라우저에서 바로 실행된다.

### 단계 1. Guided Input UI 구현
목표:
- 사용 가능한 대표 모티프를 UI에 표시한다.
- 사용자가 모티프를 선택하거나 따라 그릴 수 있게 한다.
- 현재 입력 대상이 무엇인지 명확히 보이게 한다.

선행 계약:
- `Motif` 목록
- `GuideTemplate` shape
- 선택 상태와 입력 상태 UI 계약

TDD:
- guide 목록 렌더 failing test
- guide 선택 상태 변경 failing test
- 선택된 guide overlay 렌더 failing test

작업:
- guide palette UI 추가
- 선택된 guide 상태 저장
- canvas overlay 또는 hint path 렌더
- 현재 입력 중인 motif 표시

병렬 처리:
- Erick: palette, overlay, session UI
- Gabriel: 상태 계약, 테스트 infra, fixture

검증 명령:
- `npm run test`
- `npm run test:e2e`

완료 조건:
- 사용자가 입력 가능한 대표 모티프를 바로 이해할 수 있다.
- 선택된 guide가 캔버스에 시각적으로 드러난다.
- 기본 유즈 케이스가 브라우저에서 재현된다.

### 단계 2. Guided Match 엔진 구현
목표:
- 사용자의 입력이 선택된 guide와 충분히 맞는지 판정한다.
- 성공 시 deterministic하게 scene element를 생성한다.
- 실패 시 사용자에게 다시 시도 가능한 상태를 제공한다.

선행 계약:
- `GuidedInputState` shape
- match 성공/실패 기준
- `SceneElement.source` 정책

TDD:
- trace progress 계산 failing test
- 충분한 입력 시 match 성공 failing test
- 부족한 입력 시 실패 또는 retry 상태 failing test

작업:
- 입력 path 정규화
- guide template와의 단순 비교 규칙 작성
- 성공 시 scene element 생성
- 실패 시 상태 rollback 또는 retry 처리

병렬 처리:
- Erick: 시각 피드백, retry UX
- Gabriel: match 판정 함수, fixture, 테스트

검증 명령:
- `npm run test`
- 필요 시 특정 suite 실행

완료 조건:
- 지원된 guide 입력은 높은 재현성으로 같은 motif를 만든다.
- 사용자는 현재 입력이 성공에 가까운지 알 수 있다.
- 임의 오인식보다 실패/재시도가 더 흔한 시스템이 된다.

### 단계 3. Deterministic Audio Mapping 구현
목표:
- 확정된 motif를 안정적으로 오디오 레이어에 매핑한다.
- scene element 추가 시 레이어가 누적된다.
- pause/replay/reset이 세션 단위로 동작한다.

선행 계약:
- `AudioLayer` shape
- motif -> audio preset 매핑 규칙
- layer add/keep/remove 정책

TDD:
- motif 추가 시 layer 추가 failing test
- reset 시 layer 제거 failing test
- pause/replay 상태 전이 failing test

작업:
- motif별 preset 정의
- layer diff 계산
- session controls 정리
- 현재 프로토타입 오디오 구현과 guided flow 연결

병렬 처리:
- Erick: 상태 UI, 컨트롤 UX
- Gabriel: layer diff, audio adapter, 테스트

검증 명령:
- `npm run test`
- `npm run test:e2e`

완료 조건:
- 사용자가 3개 이상의 motif를 추가하면 레이어가 누적된다.
- pause/replay/reset이 안정적으로 동작한다.
- 인식 불확실성 대신 결정적인 반응을 제공한다.

### 단계 4. 세션 수정 흐름과 재시도 UX
목표:
- 잘못된 입력을 쉽게 취소하고 다시 시도할 수 있게 한다.
- reset/undo/retry가 scene/audio 상태와 정확히 동기화되게 한다.

선행 계약:
- undo/reset 이벤트 계약
- 실패한 guided input 처리 정책

TDD:
- undo 후 마지막 scene/audio 제거 failing test
- reset 후 전체 세션 초기화 failing test
- 실패한 입력 재시도 failing test

작업:
- undo/reset reducer 정리
- 실패 상태 UI와 retry 액션 추가
- 제거된 scene/audio layer 정리 로직 보강

검증 명령:
- `npm run test`
- `npm run test:e2e`

완료 조건:
- 사용자가 잘못된 입력을 바로 바로잡을 수 있다.
- scene/audio 상태가 눈에 보이게 동기화된다.

### 단계 5. Guided MVP 경험 완성
목표:
- 온보딩, 접근성, 상태 노출을 마무리한다.
- MVP guided flow를 처음 사용자도 이해할 수 있게 한다.

선행 계약:
- 온보딩 문구
- guide 성공/실패 피드백 정책

TDD:
- 온보딩 문구 노출 failing test
- 접근성 라벨 및 controls 상태 failing test

작업:
- 온보딩 문구 추가
- 현재 선택된 motif, 활성 layer, 오디오 상태 표시
- pause/replay/reset 최종 정리

검증 명령:
- `npm run test`
- `npm run test:e2e`

완료 조건:
- guided input MVP가 코드, UI, 브라우저 흐름 기준으로 이해 가능하다.
- 처음 방문한 사용자도 무엇을 해야 할지 바로 이해한다.

### 단계 6. 브라우저 실사용 검증
목표:
- guided input 기반 핵심 유즈 케이스를 실제 브라우저에서 검증한다.
- 문서와 구현의 차이를 최종 점검한다.

선행 계약:
- PRD acceptance
- guided motif 목록과 audio mapping

TDD:
- 3-layer accumulation E2E failing test
- replay/reset guided flow E2E failing test

작업:
- Playwright 시나리오 확장
- headed/manual QA 기록
- 남은 자유 드로잉 확장 리스크 분리

검증 명령:
- `npm run test`
- `npm run test:e2e -- --headed`

완료 조건:
- guided input MVP가 PRD acceptance와 맞는다.
- 자유 드로잉 확장은 후속 백로그로 명확히 분리된다.

## 7. 2인 병렬 개발 구조
### 개발자 A 소유 영역
- guide palette UI
- canvas overlay 및 trace 시각화
- session controls와 상태 UI
- 수동 브라우저 QA

### 개발자 B 소유 영역
- guide match 엔진
- deterministic scene/audio mapping
- 테스트 인프라와 자동 브라우저 검증
- audio adapter

### 공통 계약 파일
- `src/shared/types/domain.ts`
- guided motif 목록과 fixture
- 최소 audio state 노출 계약

### 병렬 작업 규칙
1. guided motif 목록과 success criteria는 먼저 합의한다.
2. UI와 match 엔진은 shared contract 확정 후 병렬로 진행한다.
3. audio mapping은 scene contract가 고정된 뒤에 병렬화한다.
4. 자유 드로잉 실험은 guided MVP와 분리된 이슈로만 진행한다.

## 8. 테스트 케이스
### 단위 테스트
1. guide 선택 reducer
2. trace progress 계산
3. guide match 성공/실패 판정
4. scene element 생성
5. layer add/keep/remove diff
6. audio state transition

### 통합 테스트
1. guide 선택 후 overlay 노출
2. guided input 성공 후 scene badge 생성
3. guided input 성공 후 audio layer count 증가
4. undo/reset 후 상태 패널 동기화

### E2E 테스트
1. 첫 guide 선택과 입력 성공
2. 3개 motif 누적 후 layer 3개 이상 표시
3. pause/replay/reset 동작
4. 실패한 입력 재시도

## 9. 브라우저 직접 검증 시나리오
### 시나리오 A: 학생 사용자
1. 첫 화면에서 입력 가능한 모티프를 바로 이해한다.
2. 캠프파이어 guide를 선택하고 따라 그린다.
3. 소리가 재생되는 것을 확인한다.
4. 별과 나무를 추가해 레이어가 누적되는지 확인한다.
5. reset 후 새 장면을 시작한다.

### 시나리오 B: 성인 사용자
1. 비, 창문, 조명 같은 차분한 모티프를 선택한다.
2. guided input으로 장면을 빠르게 구성한다.
3. replay와 pause를 반복해도 상태가 깨지지 않는지 확인한다.
4. 작업용 배경음처럼 인식되는지 수동 평가한다.

## 10. Definition of Done
- 관련 GitHub Issue와 Project card가 최신 상태다.
- guided input 전략이 문서와 코드에 일치한다.
- `npm run test`와 `npm run test:e2e`가 최신 기준선에서 통과한다.
- 남은 자유 드로잉 확장 리스크가 issue 또는 handoff에 남아 있다.
- 다음 Codex가 이어받을 시작점이 명확하다.

## 11. 권장 일정
### 1주차
- guided input 계약 확정
- guide palette와 overlay 구현

### 2주차
- guide match 엔진 구현
- scene mapping과 fixture 정리

### 3주차
- deterministic audio mapping
- session controls 정리

### 4주차
- E2E 확장
- manual QA 및 handoff 정리

## 12. 실행 명령 초안
- 개발 서버: `npm run dev`
- 단위 테스트: `npm run test`
- E2E: `npm run test:e2e`
- 특정 suite 예시:
  - `npm run test -- tests/unit`
  - `npm run test:e2e -- --headed`

## 13. 참고 자료
- `../10-product/prd.md`
- `../00-governance/codex-collaboration-protocol.md`
- `../00-governance/github-issue-seeds.md`

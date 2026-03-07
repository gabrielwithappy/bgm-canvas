# BGM Canvas 구현 계획

## 문서 정보
- 작성일: 2026-03-07
- 기준 문서: `../10-product/prd.md`
- 목표: 검은색 단일 선 드로잉으로 장면을 만들고, 해당 장면에 맞는 BGM/환경음이 누적되는 MVP를 TDD 기반으로 구현한다.
- 선행 문서: `../README.md`, `../00-governance/codex-collaboration-protocol.md`, `../10-product/prd.md`
- 관련 문서: `../00-governance/github-issue-seeds.md`
- 수정 트리거: 기술 스택, 아키텍처, 단계 계획, 공용 계약의 기본 방향이 바뀔 때

## 1. 구현 원칙
- `작게 출시`: 각 단계는 독립적으로 실행 가능하고, 브라우저에서 바로 검증 가능해야 한다.
- `TDD 우선`: 도메인 로직은 Vitest로 실패하는 테스트를 먼저 작성한 뒤 구현한다.
- `계약 우선`: 두 개발자가 병렬 작업할 수 있도록 공용 타입과 이벤트 계약을 먼저 고정한다.
- `프런트엔드 우선`: MVP는 서버 없는 클라이언트 중심 구조로 시작한다.
- `브라우저 검증 필수`: 각 단계 종료 시 Playwright로 핵심 유즈 케이스를 실제 브라우저에서 검증한다.
- `동기화 후 테스트`: 모든 테스트 실행 전 최신 `develop` 브랜치를 pull 받아 로컬 기준선을 먼저 맞춘다.

## 2. 권장 기술 스택
### 애플리케이션
- `React + TypeScript`
- `Vite`
- `HTML Canvas 2D API`
- `Tone.js`
- `CSS Modules` 또는 `plain CSS`

### 테스트
- `Vitest`
- `React Testing Library`
- `Playwright`

### 개발 환경
- `Node.js 20+`
- `npm`
- `로컬 파일 기반 오디오 asset 관리`

## 3. 기술 선택 이유
- `React + TypeScript`: UI 상태와 오디오 상태를 명확한 타입 계약으로 분리하기 쉽다.
- `Vite`: 서버 렌더링, 배포 파이프라인, 백엔드 없이도 가장 빠르게 로컬 개발 서버를 띄울 수 있다. 이 프로젝트는 실제 배포보다 로컬 실행과 반복 검증이 목적이므로 Vite를 선택한다. 이 판단은 공식 문서를 바탕으로 한 추론이다.
- `HTML Canvas 2D API`: PRD가 `검은색 단일 선`과 `최소 입력`에 집중하므로 무거운 드로잉 라이브러리 없이도 요구사항을 충족할 수 있다.
- `Tone.js`: 사용자 입력 이후 오디오를 시작해야 하는 브라우저 제약을 다루기 쉽고, `Player`, `Loop`, `Transport`로 BGM/환경음 레이어를 제어할 수 있다.
- `Vitest`: Vite 기반 앱과 설정을 공유하며 빠르게 도메인 테스트를 돌릴 수 있다.
- `Playwright`: TypeScript를 바로 지원하고, 병렬 실행, trace, headed 실행으로 유즈 케이스 검증에 적합하다.

## 4. 제안 아키텍처
이 MVP는 `로컬 실행 전용`을 전제로 한다. 별도 API 서버, DB, 인증, 배포 인프라는 두지 않는다.

## 4-1. Owner Mapping
- 개발자 A owner: `canvas`, `UI rendering`, `session controls`, 수동 브라우저 QA
- 개발자 B owner: `scene classifier`, `audio engine`, `test infrastructure`, 브라우저 자동화
- shared contract: 공용 타입, motif schema, audio state, UI에 노출할 최소 상태 값
- owner는 작업 백로그를 뜻하지 않고, 최종 수정 책임과 문의 라우팅 기준을 뜻한다.
- 실제 작업 단위와 진행상황은 GitHub Issues와 Project에서 관리한다.

### 프런트엔드 계층
- `app`: 라우트, 레이아웃, 최상위 상태 조립
- `features/canvas`: 드로잉, undo, erase, stroke 관리
- `features/scene`: stroke를 motif로 해석하는 규칙 엔진
- `features/audio`: motif를 사운드 레이어로 변환하고 재생하는 엔진
- `features/session`: reset, replay, UI 상태 표시
- `shared`: 타입, 유틸, 테스트 헬퍼

### 핵심 도메인 계약
```ts
type Stroke = {
  id: string
  points: Array<{ x: number; y: number }>
  createdAt: number
}

type Motif = "campfire" | "rain" | "wind" | "tree" | "star" | "sea" | "unknown"

type SceneElement = {
  id: string
  strokeIds: string[]
  motif: Motif
  confidence: number
}

type AudioLayer = {
  elementId: string
  motif: Motif
  state: "idle" | "loading" | "playing" | "stopped"
}
```

### 모듈 경계
- `canvas`는 stroke를 만든다.
- `scene`은 stroke를 motif로 해석한다.
- `audio`는 motif 집합을 받아 layer diff를 계산하고 재생한다.
- `session`은 undo/reset 시 `scene`과 `audio`를 동기화한다.

이 계약을 먼저 고정하면 개발자 2명이 충돌 없이 병렬 작업할 수 있다.

## 5. TDD 개발 규칙
### 단위 테스트 우선 순서
1. 순수 함수 테스트 작성
2. 구현
3. 리팩터링
4. 컴포넌트 테스트 작성
5. 브라우저 E2E 테스트 추가

### TDD 적용 대상
- stroke 정규화
- motif 분류 규칙
- layer diff 계산
- undo/reset reducer
- 오디오 상태 전이

### 테스트 피라미드
- `단위 테스트`: 도메인 함수와 reducer
- `통합 테스트`: React 컴포넌트와 Tone.js adapter 경계
- `E2E 테스트`: 실제 드로잉, 사운드 시작, 수정, 초기화

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

### 단계 0. 프로젝트 부트스트랩
목표:
- React + TypeScript + Vite 프로젝트 생성
- 테스트 러너와 기본 폴더 구조 확정
- 공용 타입과 스크립트 정의
- 로컬 전용 실행 환경 확정

작업:
- Vite React TS 템플릿 초기화
- Vitest, RTL, Playwright 설정
- `src/features`, `src/shared`, `tests/e2e` 구조 생성
- 공용 타입 파일과 fixture 작성
- 로컬 오디오 asset 폴더 구조 생성

완료 조건:
- 앱이 빈 캔버스를 띄운다.
- `npm run test`, `npm run test:e2e`가 빈 상태로 통과한다.
- `npm run dev`만으로 로컬 브라우저에서 바로 실행된다.

검증:
- 최신 `develop` 동기화 후 `npm run test`
- `npm run dev`로 브라우저에서 앱 실행
- Playwright smoke test: 홈 화면 로드, 캔버스 표시

병렬 작업:
- 개발자 A: Vite/React 앱, 캔버스 뼈대
- 개발자 B: Vitest/Playwright 설정, 테스트 헬퍼

### 단계 1. 단색 드로잉 캔버스 구현
목표:
- 검은색 단일 선 드로잉
- stroke 저장
- undo/reset UI

작업:
- pointer 이벤트 기반 stroke 수집
- canvas 렌더링
- undo/reset reducer 구현
- 검은색 단일 브러시 고정

완료 조건:
- 사용자가 마우스/터치로 선을 그릴 수 있다.
- undo/reset이 동작한다.
- 색상 팔레트가 없다.

검증:
- 최신 `develop` 동기화 후 `npm run test`
- 단위 테스트: reducer, stroke serializer
- 컴포넌트 테스트: 드로잉 후 stroke 수 증가
- Playwright: 드래그로 선 생성, undo로 제거, reset으로 초기화

병렬 작업:
- 개발자 A: 캔버스 입력/렌더링
- 개발자 B: undo/reset reducer, 테스트 fixture

### 단계 2. 장면 해석 엔진 MVP
목표:
- 자유 스케치를 완전 인식하려 하지 않고, 대표 motif 규칙 엔진을 만든다.
- 초기 지원 motif: `campfire`, `rain`, `tree`, `star`, `wind`

작업:
- stroke 묶음 규칙 설계
- bounding box, point density, line orientation 같은 휴리스틱 작성
- `unknown` fallback 추가
- motif confidence 계산

완료 조건:
- 테스트 fixture 기준 대표 motif 분류가 재현 가능하다.
- 애매한 입력은 `unknown` 또는 일반 ambience로 안전하게 처리된다.

검증:
- 최신 `develop` 동기화 후 `npm run test`
- 단위 테스트: motif classifier fixture 세트
- 통합 테스트: stroke 입력 후 scene element 생성
- 브라우저 수동 검증: 예시 드로잉 5종을 그려 motif badge 확인

병렬 작업:
- 개발자 A: stroke grouping UI, 디버그 overlay
- 개발자 B: classifier 규칙 엔진과 fixture 세트

### 단계 3. 오디오 레이어 엔진 구현
목표:
- motif별 사운드 레이어 재생
- 새 요소 추가 시 기존 사운드를 유지한 채 레이어 누적

작업:
- Tone.js adapter 작성
- motif -> audio asset mapping
- layer diff 알고리즘 구현
- 사용자 첫 입력 이후 `Tone.start()` 처리

완료 조건:
- 첫 motif가 재생된다.
- 둘째 motif가 들어오면 첫 레이어를 유지한 채 추가된다.
- reset 시 모든 레이어가 중지된다.

검증:
- 최신 `develop` 동기화 후 `npm run test`
- 단위 테스트: layer diff 계산
- 통합 테스트: adapter mock 기반 start/stop 호출 검증
- Playwright: 사용자 입력 후 오디오 시작 버튼/상태 표시 확인

병렬 작업:
- 개발자 A: 오디오 상태 UI, 현재 활성 레이어 표시
- 개발자 B: Tone.js adapter, asset loader, layer diff

### 단계 4. 수정 흐름과 오디오 동기화
목표:
- 잘못 그린 요소를 undo 또는 erase로 수정
- 삭제된 요소의 사운드 레이어도 함께 제거

작업:
- 요소 단위 선택 삭제 또는 최근 stroke undo
- scene 재계산
- audio layer 제거 시 fade out 처리

완료 조건:
- 사용자가 실수한 요소를 수정할 수 있다.
- 삭제된 요소에 연결된 사운드가 자연스럽게 사라진다.

검증:
- 최신 `develop` 동기화 후 `npm run test`
- 단위 테스트: 삭제 후 scene/audio sync
- 통합 테스트: undo 시 layer 제거 이벤트 발생
- Playwright: 잘못 그린 후 undo, 새로 그리기, 사운드 변경 확인

병렬 작업:
- 개발자 A: erase/undo UI와 캔버스 상호작용
- 개발자 B: sync reducer, fade out 정책

### 단계 5. 세션 경험 완성
목표:
- 현재 사운드 상태 확인
- replay/pause/reset
- 간단한 온보딩

작업:
- 현재 활성 motif 목록 UI
- 재생/일시정지
- 첫 진입 안내 문구
- 접근성 점검

완료 조건:
- 학생과 성인이 설명 없이 시작 가능하다.
- 세션을 멈추고 다시 들을 수 있다.

검증:
- 최신 `develop` 동기화 후 `npm run test`
- 컴포넌트 테스트: controls 상호작용
- Playwright: pause/replay/reset 전체 흐름
- Axe 또는 Playwright 접근성 기본 점검

병렬 작업:
- 개발자 A: 온보딩/컨트롤 UI
- 개발자 B: transport 제어, 접근성 테스트 설정

### 단계 6. 브라우저 실사용 검증
목표:
- PRD 핵심 유즈 케이스를 실제 브라우저에서 재현

작업:
- headed Playwright 시나리오 작성
- trace/screenshot 저장
- 수동 QA 체크리스트 실행

완료 조건:
- 핵심 유즈 케이스 5종이 자동화되거나 수동 체크리스트로 통과한다.
- 실패 시 trace로 원인 확인 가능하다.

검증:
- 최신 `develop` 동기화 후 `npm run test:e2e -- --headed`
- `npm run test:e2e -- --headed`
- `npm run test:e2e -- --trace on`
- 실제 브라우저에서 캔버스 드로잉과 오디오 응답 확인

병렬 작업:
- 개발자 A: 수동 QA와 UI 버그 수정
- 개발자 B: Playwright 유지보수와 trace 분석

## 7. 2인 병렬 개발 구조
### 개발자 A 소유 영역
- 캔버스 입력
- 시각 UI
- 온보딩과 컨트롤
- 디버그 overlay

### 개발자 B 소유 영역
- scene 해석 규칙
- 오디오 엔진
- 테스트 인프라
- 브라우저 자동화

### 공통 계약 파일
- `src/shared/types/scene.ts`
- `src/shared/types/audio.ts`
- `src/shared/contracts/events.ts`

### 병렬 작업 규칙
- 공용 타입 변경은 PR 분리
- 각 단계 시작 전에 fixture와 계약을 먼저 합의
- 통합은 단계 끝에서만 수행
- 각자 기능 브랜치에서 작업하되, 테스트 실행 전마다 최신 `develop`을 반영한다.
- 공용 계약 파일을 건드린 날에는 상대 개발자도 `develop` 동기화 후 전체 테스트를 다시 실행한다.

## 8. 테스트 케이스
### 단위 테스트
1. stroke가 입력되면 point 목록과 bounding box가 계산된다.
2. undo reducer는 마지막 stroke만 제거한다.
3. reset reducer는 stroke, scene, audio 상태를 모두 초기화한다.
4. classifier는 campfire fixture를 `campfire`로 분류한다.
5. classifier는 애매한 fixture를 `unknown`으로 분류한다.
6. layer diff는 새 motif만 추가하고 기존 motif는 유지한다.
7. 요소 삭제 시 해당 audio layer만 stop 대상으로 계산된다.

### 통합 테스트
1. 캔버스 드로잉 후 scene panel에 motif badge가 나타난다.
2. 첫 사용자 입력 후 audio engine unlock이 수행된다.
3. 두 번째 motif 추가 시 active layer 수가 증가한다.
4. undo 클릭 시 active layer 수가 감소한다.
5. reset 클릭 시 캔버스와 active layer 표시가 모두 비워진다.

### E2E 테스트
1. 홈 화면 진입 시 검은색 단일 선 캔버스만 보이고 색상 팔레트는 없다.
2. 캠프파이어 형태를 그리면 3초 이내에 사운드 상태가 `playing`으로 바뀐다.
3. 별과 나무를 추가하면 layer count가 증가한다.
4. 잘못 그린 선을 undo 하면 layer count가 감소한다.
5. pause 후 replay 하면 다시 `playing` 상태가 된다.
6. reset 후 새 장면을 그리면 이전 세션 사운드가 남아 있지 않다.

## 9. 브라우저 직접 검증 시나리오
### 시나리오 A: 학생 사용자
1. 앱 접속
2. 캠프파이어를 그림
3. 별을 추가
4. undo 한 번 실행
5. 다시 별을 그림
6. pause/replay 확인

성공 기준:
- 즉시 그릴 수 있다.
- 사운드가 누적된다.
- 실수 수정이 쉽다.

### 시나리오 B: 성인 사용자
1. 앱 접속
2. 비, 창문, 책상을 순서대로 그림
3. 현재 활성 사운드 목록 확인
4. reset 후 새로운 장면 생성

성공 기준:
- 장면이 빠르게 구성된다.
- 작업용/집중용 분위기가 형성된다.
- 세션 전환이 자연스럽다.

## 10. Definition of Done
- 핵심 유즈 케이스 5종이 통과한다.
- TDD로 작성된 단위 테스트가 핵심 도메인을 커버한다.
- Playwright E2E가 로컬 환경에서 재현 가능하다.
- 모든 테스트 결과는 최신 `develop` 동기화 이후 기준으로 확인되었다.
- 브라우저에서 실제 드로잉과 오디오 반응을 확인했다.
- 학생/성인 사용자가 모두 `설정 없이 바로 시작 가능`한 흐름을 만족한다.
- 배포 없이 로컬 개발 서버만으로 전체 기능을 검증할 수 있다.

## 11. 권장 일정
### 1주차
- 단계 0, 1

### 2주차
- 단계 2, 3

### 3주차
- 단계 4, 5

### 4주차
- 단계 6, 버그 수정, polish

## 12. 실행 명령 초안
```bash
git fetch origin
git pull --rebase origin develop
npm install
npm run dev
npm run test
npm run test:watch
npm run test:e2e
npm run test:e2e -- --headed
npm run test:e2e -- --trace on
```

브랜치 전략 메모:
- 기능 개발은 각자 작업 브랜치에서 진행한다.
- 테스트 실행 직전에는 항상 최신 `develop`을 먼저 반영한다.
- 충돌이 발생하면 해결 후 전체 테스트를 다시 실행한다.

로컬 환경 메모:
- 배포 환경 설정은 하지 않는다.
- `.env`가 필요하다면 로컬 전용 최소 값만 사용한다.
- 오디오 파일은 저장소 내부 `public` 또는 `src/assets`에서 직접 불러온다.

## 13. 참고 자료
- React: [Creating a React App](https://react.dev/learn/start-a-new-react-project)
- React: [Build a React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- Vite: [Getting Started](https://vite.dev/guide/)
- Vitest: [Getting Started](https://vitest.dev/guide/)
- Playwright: [TypeScript](https://playwright.dev/docs/test-typescript)
- Playwright: [Running and debugging tests](https://playwright.dev/docs/running-tests)
- Tone.js: [Tone.js docs](https://tonejs.github.io/)
- Tone.js: [Player](https://tonejs.github.io/docs/14.5.3/Player)
- Tone.js: [Loop](https://tonejs.github.io/docs/14.7.77/Loop)
- MDN: [Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

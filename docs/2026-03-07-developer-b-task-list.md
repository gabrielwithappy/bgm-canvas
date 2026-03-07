# 개발자 B 작업 문서

## 문서 정보
- 작성일: 2026-03-07
- 기준 문서: [구현 계획](/Users/erickwon/workspace/personal/bgm-canvas/docs/2026-03-07-bgm-canvas-implementation-plan.md)
- 역할: scene 해석, 오디오 엔진, 테스트 인프라, 브라우저 자동화 중심 구현

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

## 5. 단계별 상세 할 일
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

## 6. 개발자 A와의 인터페이스
### B가 제공해야 하는 것
- scene 해석 함수 입력/출력 계약
- active audio layer 상태
- audio control API
- fixture와 mock adapter

### A로부터 받아야 하는 것
- 실제 캔버스 stroke 형식
- UI 버튼 이벤트 이름
- 상태 표시 방식

## 7. 통합 전 체크리스트
- [ ] 최신 `develop` 동기화 완료
- [ ] `npm run test` 통과
- [ ] `npm run test:e2e` 통과
- [ ] 개발자 A 변경을 반영한 뒤 fixture mismatch 없음
- [ ] trace 확인이 가능한 실패 로그 환경 유지

## 8. 브라우저 자동 검증 시나리오
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

## 9. 완료 보고 기준
- 어떤 도메인 로직과 테스트를 구현했는지
- 어떤 fixture와 asset mapping을 추가했는지
- Playwright에서 검증한 유즈 케이스가 무엇인지
- 개발자 A가 UI 통합 시 알아야 할 계약 변경이 있는지

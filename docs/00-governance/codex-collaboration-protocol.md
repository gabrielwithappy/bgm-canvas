# Codex 협업 규약

## 문서 정보
- 작성일: 2026-03-07
- 대상: 이 저장소에서 병렬 작업하는 사람 개발자가 각각 사용하는 Codex
- 목적: 2명 이상이 GitHub 기반으로 병렬 개발할 때, Codex 간 충돌과 계약 불일치를 줄이기 위한 운영 규칙을 정의한다.
- 선행 문서: `src/docs/README.md`
- 관련 문서: `document-map.md`, `../10-product/prd.md`, `../20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 수정 트리거: 협업 방식, GitHub Project 운영 규칙, 문서 우선순위, handoff 절차가 바뀔 때

## GitHub Project 정보
- owner: `gabrielwithappy`
- repository: `gabrielwithappy/bgm-canvas`
- project title: `BGM Canvas Collaboration Board`
- project number: `3`
- project url: `https://github.com/users/gabrielwithappy/projects/3`
- 협업 기본 상태 필드: `Workflow Status`
- `Workflow Status` 옵션: `Todo`, `In Progress`, `Blocked`, `Review`, `Done`
- 참고: GitHub 기본 `Status` 필드(`Todo`, `In Progress`, `Done`)도 남아 있지만, 이 프로젝트 협업에서는 `Workflow Status`를 우선 사용한다.

## 용어 정의
- 이 문서에서 `docs`는 GitHub 기능이 아니라, **프로젝트 저장소 내부의 문서 폴더**를 뜻한다.
- 현재 이 프로젝트에서 해당 폴더는 `src/docs/` 이다.
- 따라서 `docs에 남긴다`, `docs로 승격한다`는 표현은 모두 저장소 안의 `src/docs/` 문서 파일을 갱신한다는 의미다.

## 1. 기본 원칙
- 이 문서는 사람 개발자 간 감성적 합의문이 아니라, 각 Codex가 작업 중 따라야 하는 실행 규약이다.
- 모든 Codex는 로컬 추론보다 저장소 안의 문서화된 계약을 우선한다.
- 공용 타입, 이벤트 이름, 상태 전이, fixture shape은 “구두 합의”로 취급하지 않고 반드시 문서나 코드에 남긴다.
- 병렬 작업의 핵심은 속도가 아니라 충돌 최소화다. 각 Codex는 자신의 범위를 넘는 변경을 기본적으로 피한다.
- 구현보다 계약이 우선이다. 계약이 불명확하면 새 코드를 늘리기보다 먼저 문서와 이슈를 갱신한다.

## 2. 역할 정의
### 사람 개발자
- 담당 기능 우선순위와 최종 의사결정을 가진다.
- Codex가 만든 문서, 이슈, PR 설명을 검토하고 승인한다.
- Codex 간 충돌이 발생했을 때 최종 방향을 정한다.

### 각 개발자의 Codex
- 자신의 담당 범위 안에서 코드, 테스트, 문서를 작성한다.
- 합의가 필요한 사항을 먼저 식별하고 기록한다.
- 다른 개발자의 Codex가 소비할 수 있는 형태로 결과를 남긴다.
- 승인되지 않은 공용 계약 변경을 단독으로 확정하지 않는다.

## 3. Codex가 따라야 할 우선순위
우선순위가 충돌하면 아래 순서를 따른다.

1. 저장소의 최신 코드와 테스트
2. `src/docs/` 안의 구현 계획 및 작업 문서
3. 명시적으로 합의된 이슈/PR 설명
4. 각 개발자의 로컬 메모 또는 대화
5. Codex의 일반적 추론

## 4. GitHub 커뮤니케이션 채널 규칙
### GitHub Projects
- 용도: 상태 추적
- 기록 대상: 담당자, 진행 상태, blocked 여부, 선행 의존성
- 금지: 타입 계약, API 시그니처, 상태 전이 규칙의 본문 저장
- 현재 사용 프로젝트: `BGM Canvas Collaboration Board` (`gabrielwithappy` project `#3`)

### GitHub Issues
- 용도: 합의가 필요한 기술 의사결정 기록
- 기록 대상: 공용 타입, 계약 변경, 범위 조정, blocker
- 원칙: 다른 Codex에게 전달할 핵심 내용은 최소 1개의 Issue 또는 문서 링크로 남긴다.

### Pull Request
- 용도: 실제 변경 설명과 검토
- 기록 대상: 무엇을 바꿨는지, 계약 영향이 있는지, 어떤 테스트를 돌렸는지
- 원칙: PR 본문에는 관련 문서/이슈 링크를 반드시 포함한다.

### `src/docs/`
- 용도: 오래 유지할 계약 문서
- 기록 대상: 구현 계획, 역할 분담, 공용 타입, 협업 규약, 변경 이력
- 의미: GitHub Docs나 외부 위키가 아니라, 현재 프로젝트 저장소 내부 문서 폴더를 말한다.
- 원칙: 2회 이상 반복 설명이 필요한 내용은 Issue 댓글이 아니라 문서로 승격한다.

## 5. 공용 계약 항목
아래 항목은 “공용 계약”으로 간주한다.

- 공용 타입: `Stroke`, `Motif`, `SceneElement`, `AudioLayer`
- 상태 전이: drawing, classified, loading, playing, paused, stopped 등의 정의
- UI 이벤트 이름과 payload shape
- fixture 포맷과 테스트 데이터 위치
- 오디오 adapter 인터페이스
- `unknown` 처리 정책
- layer diff 규칙

이 항목을 바꾸는 Codex는 다음 3가지를 동시에 갱신해야 한다.

1. 관련 코드
2. 관련 테스트
3. 관련 문서 또는 Issue

## 6. 브랜치와 작업 단위 규칙
- 각 사람 개발자는 자신의 작업 브랜치를 가진다.
- 각 Codex는 기본적으로 “자기 브랜치 안의 자기 범위”만 수정한다.
- 한 PR은 하나의 목적만 가져야 한다.
- 문서 변경과 대규모 리팩터링을 한 PR에 섞지 않는다.
- 공용 계약 변경은 기능 구현 PR에 묻어 넣지 말고, 제목과 본문에서 분리해 드러낸다.

권장 예시:
- `feat/canvas-input`
- `feat/audio-layer-engine`
- `docs/codex-collaboration-protocol`
- `test/audio-layer-diff`

## 7. 작업 시작 전 Codex 체크리스트
각 Codex는 구현 전에 아래를 확인한다.

1. 최신 `develop` 또는 기준 브랜치를 반영했는가
2. 자신의 담당 범위 문서를 읽었는가
3. 공용 계약에 영향이 있는가
4. 영향이 있다면 먼저 문서 또는 Issue를 갱신했는가
5. 테스트 기준과 완료 조건이 문서에 명시되어 있는가

하나라도 아니면, 바로 구현을 확장하지 않는다.

## 8. 작업 중 전달 규칙
다른 개발자의 Codex에게 전달할 내용은 아래 형식을 우선 사용한다.

### 전달해야 하는 상황
- 공용 타입 변경
- 함수/컴포넌트 인터페이스 변경
- fixture 구조 변경
- 브랜치 병합 전 선반영이 필요한 사항
- blocker 발생
- 테스트 실패 원인이 상대 범위와 연결된 경우

### 전달 템플릿
```md
## 전달 제목
- 종류: contract-change | blocker | dependency | proposal | handoff
- 관련 브랜치:
- 관련 문서:
- 관련 이슈/PR:

## 변경/요청 내용
- 무엇이 바뀌었는지
- 왜 바뀌었는지
- 상대 Codex가 확인해야 하는 지점

## 영향 범위
- 코드 영향:
- 테스트 영향:
- 문서 영향:

## 필요한 액션
- [ ] 확인
- [ ] 반영
- [ ] 의견 회신
```

## 9. 개발 진행상황 sync 규칙
개발 진행상황 sync는 “짧고 자주”가 원칙이며, 상세 기술 토론과 분리한다.

### sync 채널
- 기본 채널은 `GitHub Projects`다.
- 카드 하나는 하나의 작업 단위만 나타낸다.
- 현재 협업 기본 상태 필드는 `Workflow Status`다.
- `Workflow Status` 값은 `Todo`, `In Progress`, `Blocked`, `Review`, `Done`을 사용한다.
- GitHub 기본 `Status` 필드는 보조적으로 남겨둘 수 있지만, Codex 간 sync 기준은 `Workflow Status`로 통일한다.

### 각 Codex가 카드에 남겨야 할 최소 정보
- 현재 상태
- 현재 브랜치 또는 PR 링크
- blocker 유무
- 관련 Issue 링크
- 다음 액션 1개

예시:
```md
status: doing
branch: feat/audio-layer-engine
blocker: waiting for SceneElement contract
issue: #12
next: adapter mock interface finalize
```

### sync 주기
- 작업 시작 시 1회
- blocker 발생 시 즉시
- 공용 계약 변경 직후
- PR 생성 시
- 작업 종료 시

### 금지 사항
- Projects 카드 설명에 장문의 기술 합의를 누적하지 않는다.
- 상태 갱신 없이 PR만 올리고 끝내지 않는다.
- blocker를 로컬 대화로만 공유하고 기록하지 않는다.

## 10. Codex discussion 운영 절차
Codex 사이 discussion은 채팅처럼 실시간으로 이어가는 것이 아니라, GitHub Issue 기반의 비동기 토론으로 운영한다.

### discussion을 열어야 하는 상황
- 공용 타입을 변경해야 할 때
- 상태 전이 규칙이 충돌할 때
- A와 B가 서로 다른 구현 가정을 갖고 있을 때
- 상대 범위 작업이 선행되어야 할 때
- 임시 우회 구현을 넣기 전에 합의가 필요할 때

### discussion 기본 흐름
1. 문제를 식별한 Codex가 Issue를 만든다.
2. Issue 본문에 배경, 현재 가정, 문제, 제안안, 결정 필요 사항을 적는다.
3. Projects 카드에 해당 Issue 링크를 연결하고 상태를 `blocked` 또는 `doing`으로 갱신한다.
4. 상대 Codex는 Issue 코멘트로 입장, 영향 범위, 선호안, 조건을 남긴다.
5. 사람 개발자가 최종 방향을 정하거나, 이미 명확한 경우 문서/PR로 확정한다.
6. 결론이 재사용될 가치가 있으면 `src/docs/` 문서에 반영한다.

### discussion 응답 규칙
- “찬성/반대”만 쓰지 말고 이유와 영향 범위를 같이 쓴다.
- 상대 구현을 막는 blocker라면, 응답에서 임시 우회 가능 여부도 같이 적는다.
- 결론이 나면 누가 문서/코드/테스트를 갱신할지 명시한다.

### discussion 코멘트 템플릿
```md
## review
- 입장: agree | disagree | conditional
- 근거:
- 영향 코드:
- 영향 테스트:
- 임시 우회 가능 여부:
- 제안하는 다음 액션:
```

## 11. Codex handoff 규칙
discussion과 별도로, 한 Codex가 다른 Codex에게 “이제 네가 이어서 해야 하는 정보”를 넘길 때는 handoff 형식을 사용한다.

### handoff가 필요한 상황
- 자기 작업이 끝났고 상대가 바로 이어서 작업할 수 있을 때
- 공용 계약은 확정됐지만 상대 반영이 아직 남았을 때
- 브랜치 병합 전 선반영이 필요할 때
- 테스트 깨짐 원인과 해결 포인트를 전달할 때

### handoff 채널
- 기본은 관련 Issue 코멘트 또는 PR 본문
- 장기적으로 참조해야 하면 `src/docs/` 문서 링크를 같이 남긴다.

### handoff 템플릿
```md
## handoff
- 종류: contract-change | blocker-release | dependency-ready | test-warning
- 대상:
- 관련 브랜치:
- 관련 이슈/PR:
- 관련 문서:

## 전달 내용
- 완료한 것:
- 확정된 계약:
- 아직 안 된 것:
- 상대가 바로 해야 할 일:

## 검증 정보
- 실행한 테스트:
- 확인 못 한 리스크:
```

## 12. Issue 작성 규약
Codex가 합의가 필요한 내용을 올릴 때는 아래 템플릿을 따른다.

```md
## 배경

## 문제

## 제안

## 대안

## 영향 범위
- 코드:
- 테스트:
- 문서:

## 결정 필요 사항
```

작성 원칙:
- “무엇이 문제인지”를 먼저 쓰고 “내가 선호하는 해결책”은 그 다음에 쓴다.
- 코드 링크 또는 문서 링크를 1개 이상 포함한다.
- 상대 Codex가 대답할 수 있게 결정 질문을 명시한다.

## 13. PR 본문 규약
모든 PR은 아래 정보를 포함한다.

- 변경 목적
- 관련 이슈/문서
- 공용 계약 영향 여부
- 테스트 실행 결과
- 상대 개발자가 확인할 포인트

권장 체크리스트:
```md
- [ ] 공용 타입 변경 없음
- [ ] 공용 타입 변경 있음: 관련 문서/이슈 갱신 완료
- [ ] 단위 테스트 통과
- [ ] 통합 또는 E2E 확인
- [ ] 다른 개발자 범위에 영향 주는 변경 설명 추가
```

## 14. 채널 연결 규칙
Projects, Issues, PR, 문서는 서로 분리해서 쓰되 반드시 링크로 연결한다.

### 연결 원칙
- Project 카드에는 관련 Issue 또는 PR 링크가 있어야 한다.
- Issue에는 관련 문서 또는 코드 위치가 있어야 한다.
- PR에는 관련 Issue와 문서 링크가 있어야 한다.
- 문서에서 중요한 계약을 정의하면 관련 작업 문서나 PR에서 해당 문서를 참조한다.

### 최소 연결 세트
1. 진행상황 추적: Project -> Issue 또는 PR
2. 논의: Issue -> 문서 또는 코드
3. 구현 반영: PR -> Issue + 문서
4. 장기 보존: 문서 -> 관련 작업 문서

이 연결이 없으면 나중에 Codex가 문맥을 복원하기 어려워진다.

## 15. 문서 갱신 규칙
- 반복적으로 참조되는 결정은 `src/docs/`에 승격한다.
- 일회성 진행 상황은 Project나 PR 코멘트에 남긴다.
- 작업 문서와 구현 계획이 충돌하면, 즉시 충돌 사실을 별도 항목으로 기록한다.
- 날짜가 포함된 문서명은 유지하되, 후속 합의가 누적되면 별도 “living document”를 추가할 수 있다.

## 16. 충돌 방지 규칙
- 다른 Codex의 작업 파일을 대량 포맷팅하지 않는다.
- 승인 없이 공용 타입 파일을 재배치하지 않는다.
- 실패하는 테스트를 우회하기 위해 mock 범위를 임의 확대하지 않는다.
- 상대 범위 코드를 수정해야 한다면, 최소 수정 + 이유 기록 원칙을 따른다.
- “지금 고치면 편하다”는 이유만으로 아키텍처 변경을 확장하지 않는다.

## 17. 충돌 발생 시 처리 절차
1. 어떤 계약이 충돌하는지 식별한다.
2. 코드보다 문서와 테스트 기준을 먼저 비교한다.
3. 기존 문서가 없으면 Issue로 결정 요청을 만든다.
4. 사람 개발자가 결정하기 전까지는 임시 우회 구현을 최소화한다.
5. 결정 후 문서, 코드, 테스트를 같은 세트로 정리한다.

## 18. 완료 보고 규약
Codex는 작업 완료 시 아래를 남긴다.

- 무엇을 구현했는가
- 어떤 계약을 추가/변경했는가
- 어떤 테스트로 검증했는가
- 상대 Codex가 이어서 작업할 수 있는 상태인가
- 남은 리스크 또는 미확정 항목은 무엇인가

## 19. 이 프로젝트에 대한 즉시 적용 규칙
현재 BGM Canvas에서는 아래 항목을 최우선 공용 계약으로 본다.

- canvas stroke 데이터 구조
- scene classifier 입력/출력 타입
- motif 목록과 `unknown` 정책
- audio layer diff 규칙
- Tone adapter 인터페이스
- UI에 노출할 최소 오디오 상태 값

위 항목 중 하나라도 변경되면, 관련 작업 문서와 함께 이 문서를 참조하는 링크를 남긴다.

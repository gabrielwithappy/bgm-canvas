# AGENTS.md Template

이 파일은 새 프로젝트를 시작할 때 `AGENTS.md`의 시작점으로 사용한다.
프로젝트에 맞게 구체적인 내용을 채우고, 필요 없는 섹션은 제거한다.

---

## Startup Order

1. 프로젝트 루트의 `MEMORY.md`를 읽고 현재 상태를 파악한다. 없으면 Memory 섹션의 템플릿으로 생성한다.
2. `README.md`로 프로젝트 구조와 목표를 확인한다.
3. 아래 "Source Of Truth" 섹션에서 핵심 문서 경로를 확인하고 순서대로 읽는다.
4. 협업 규약 문서를 읽고 규약을 따른다.
5. 구현 계획 문서를 읽고 현재 단계와 owner mapping을 확인한다.

---

## Source Of Truth

각 항목에 실제 문서 경로를 채운다. 문서가 없으면 현재 진행 중인 최신 Issue를 따른다.

- 협업 규약: `<path>`
- 제품 요구사항: `<path>`
- 구현 계획: `<path>`

이 파일과 문서가 충돌하면 협업 규약 문서를 우선한다.

---

## Skills

프로젝트에서 사용하는 skill 목록과 트리거를 여기에 기록한다.
skill이 없으면 이 섹션을 삭제한다.

```md
- `<skill-name>`: <언제 사용하는지 트리거 조건>. 파일: `<skill 파일 경로>`
```

---

## Memory

세션 시작 시 `MEMORY.md`를 읽는다. 파일이 없으면 아래 템플릿으로 agent가 직접 생성한다.
세션 종료 시 `MEMORY.md` 상단에 새 항목을 추가한다.

```md
## YYYY-MM-DD | Agent-Name
- 완료:
- 현재 상태:
- 다음:
- 사람 결정 필요:
```

- 항목은 짧게 유지한다. 상세 내용은 이슈나 커밋에 있다.
- 사람 결정이 필요한 항목은 GitHub Issue도 함께 생성하고 링크를 남긴다.
- 파일이 길어지면 오래된 항목을 `MEMORY-archive.md`로 옮긴다.

---

## Hard Gates Before Coding

- 코드 수정 전에 remote 상태를 먼저 확인한다.
- 관련 Issue가 없으면 만들고, 있으면 연결한다. Issue 없이 구현을 시작하지 않는다.
- 공용 타입, 이벤트 계약, 상태 인터페이스(shared contract)를 변경하려면 문서 또는 Issue를 먼저 갱신하고 나서 구현한다.

---

## Delivery Rules

- 큰 덩어리로 구현하지 않는다.
- shared contract 변경과 기능 구현을 한 번에 섞지 않는다.
- 작은 작업 단위마다 테스트와 handoff 정보를 남긴다.
- 다른 agent가 이어받을 수 있게 다음 작업 위치와 남은 리스크를 Issue에 남긴다.
- 테스트 통과는 완료가 아니다. 사람이 판단해야 하는 항목(감각적 품질, 사용자 경험 등)은 Issue에 수동 검증 항목으로 명시한다.

---

## Collaboration

### Owner Mapping
- 각 서브시스템마다 owner를 지정한다.
- owner는 작업 백로그가 아니라 최종 수정 책임과 문의 라우팅 기준이다.
- 실제 작업 단위와 진행상황은 Issue에서 관리한다.

### Shared Contract 규칙
- 공용 타입, 이벤트 계약, 상태 인터페이스는 먼저 합의하고 고정한다.
- shared contract 변경은 병렬 작업에서 분리해 직렬로 처리한다.
- contract가 고정된 뒤에 각 owner가 병렬로 구현한다.

### 사람 결정 채널
- 범위 판단, 방향 결정, 감각적 품질 평가는 사람이 결정한다.
- 사람 결정이 필요한 항목은 GitHub Issue에 mention과 함께 남긴다.
- agent 간 상태 공유는 `MEMORY.md`로, 사람과의 합의는 Issue로 채널을 분리한다.

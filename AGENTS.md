# BGM Canvas Agent Context

이 파일은 `src/bgm-canvas`에서 작업을 시작하는 Codex용 기본 컨텍스트다.
세부 계약과 장기 기준선은 `docs/` 문서를 source of truth로 유지하되, 시작 절차와 필수 게이트는 이 파일에서 먼저 강제한다.

## Startup Order
1. `README.md`로 프로젝트 개요를 확인한다.
2. `docs/README.md`로 문서 읽기 순서를 확인한다.
3. `docs/00-governance/codex-collaboration-protocol.md`를 읽고 협업 규약을 따른다.
4. `docs/20-planning/2026-03-07-bgm-canvas-implementation-plan.md`를 읽고 현재 구현 단계와 owner mapping을 확인한다.

## Hard Gates Before Coding
- 코드 수정 전에 GitHub remote 상태를 먼저 확인한다.
- 코드 수정 전에 관련 GitHub Issue 또는 GitHub Project item을 반드시 만들거나 연결한다.
- GitHub Project `BGM Canvas Collaboration Board`에서 현재 작업 card의 `Workflow Status`를 먼저 갱신한다.
- Project item이나 Issue가 없으면 구현을 시작하지 않는다.
- shared contract 변경이면 문서 또는 Issue를 먼저 갱신하고 나서 구현한다.

## GitHub Project Rules
- owner: `gabrielwithappy`
- repo: `gabrielwithappy/bgm-canvas`
- project: `BGM Canvas Collaboration Board` (#3)
- primary field: `Workflow Status`
- allowed values: `Todo`, `In Progress`, `Blocked`, `Review`, `Done`

작업 시작 시 최소 기록:

```md
branch: <current-branch>
owner: <person/codex>
issue: <issue-url-or-number>
next: <single next action>
```

작업 종료 시:
- 관련 Issue와 Project item을 최신화한다.
- 가능하면 `Status`와 `Workflow Status`를 함께 맞춘다.

## Delivery Rules
- 큰 덩어리로 구현하지 않는다.
- 공용 계약 변경과 기능 구현을 한 번에 크게 섞지 않는다.
- 작은 작업 단위마다 테스트와 handoff 정보를 남긴다.
- 다른 Codex가 이어받을 수 있게 다음 작업 위치와 남은 리스크를 문서 또는 Issue에 남긴다.

## Source Of Truth
- 협업 규약: `docs/00-governance/codex-collaboration-protocol.md`
- 작업 분해 seed: `docs/00-governance/github-issue-seeds.md`
- 제품 요구사항: `docs/10-product/prd.md`
- 구현 계획: `docs/20-planning/2026-03-07-bgm-canvas-implementation-plan.md`

이 파일과 `docs/` 문서가 충돌하면 `docs/00-governance/` 문서를 우선한다.

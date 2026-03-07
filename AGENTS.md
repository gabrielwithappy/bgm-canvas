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

## Local Skills
이 프로젝트는 `agent-starter`의 superpowers 스킬 묶음을 Codex용 로컬 스킬로 복사해 `./.codex/skills/superpowers/`에 저장한다.
작업이 아래 트리거와 맞으면 해당 `SKILL.md`를 먼저 읽고 지침을 따른다.

- `using-superpowers`: 대화를 시작하거나 어떤 스킬을 먼저 써야 할지 판단할 때. 파일: `./.codex/skills/superpowers/using-superpowers/SKILL.md`
- `brainstorming`: 구현 전에 접근 방식 비교나 설계 대안 정리가 필요할 때. 파일: `./.codex/skills/superpowers/brainstorming/SKILL.md`
- `writing-plans`: 구현 계획이나 작업 분해 문서를 새로 쓸 때. 파일: `./.codex/skills/superpowers/writing-plans/SKILL.md`
- `executing-plans`: 이미 확정된 계획을 순서대로 실행할 때. 파일: `./.codex/skills/superpowers/executing-plans/SKILL.md`
- `test-driven-development`: 기능 추가, 버그 수정, 리팩터링 전에 테스트를 먼저 써야 할 때. 파일: `./.codex/skills/superpowers/test-driven-development/SKILL.md`
- `systematic-debugging`: 재현이 어렵거나 원인이 불명확한 버그를 디버깅할 때. 파일: `./.codex/skills/superpowers/systematic-debugging/SKILL.md`
- `verification-before-completion`: 완료, 수정, 통과를 주장하기 전에 검증 근거를 확인할 때. 파일: `./.codex/skills/superpowers/verification-before-completion/SKILL.md`
- `dispatching-parallel-agents`: 독립적인 조사나 읽기 작업을 병렬로 분리할 때. 파일: `./.codex/skills/superpowers/dispatching-parallel-agents/SKILL.md`
- `subagent-driven-development`: 큰 구현 계획을 작업 단위로 나눠 구현과 리뷰를 반복할 때. 파일: `./.codex/skills/superpowers/subagent-driven-development/SKILL.md`
- `requesting-code-review`: 구현 후 리뷰 요청 프롬프트나 체크리스트가 필요할 때. 파일: `./.codex/skills/superpowers/requesting-code-review/SKILL.md`
- `receiving-code-review`: 코드 리뷰 결과를 처리하고 후속 수정을 정리할 때. 파일: `./.codex/skills/superpowers/receiving-code-review/SKILL.md`
- `finishing-a-development-branch`: 브랜치 마감, 정리, 최종 확인이 필요할 때. 파일: `./.codex/skills/superpowers/finishing-a-development-branch/SKILL.md`
- `using-git-worktrees`: worktree 기반 병렬 작업이 필요할 때. 파일: `./.codex/skills/superpowers/using-git-worktrees/SKILL.md`
- `writing-skills`: 이 프로젝트의 로컬 스킬을 새로 만들거나 수정할 때. 파일: `./.codex/skills/superpowers/writing-skills/SKILL.md`

이 파일과 `docs/` 문서가 충돌하면 `docs/00-governance/` 문서를 우선한다.

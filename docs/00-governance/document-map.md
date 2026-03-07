# 문서 맵

## 목적
- `src/bgm-canvas/docs/`의 문서 역할, 읽기 순서, 우선순위를 고정해서 Codex가 문맥을 빠르게 복원할 수 있게 한다.

## 읽기 순서
1. [codex-collaboration-protocol.md](./codex-collaboration-protocol.md)
2. [github-issue-seeds.md](./github-issue-seeds.md)
3. [../10-product/prd.md](../10-product/prd.md)
4. [../20-planning/2026-03-07-bgm-canvas-implementation-plan.md](../20-planning/2026-03-07-bgm-canvas-implementation-plan.md)

## 문서 역할
- `codex-collaboration-protocol.md`: Codex 운영 규약, GitHub Project/Issue/PR 사용 규칙, superpowers와 병렬 처리 규칙
- `github-issue-seeds.md`: 실행 가능한 GitHub Issue 템플릿, TDD/검증/병렬 분해 기준
- `prd.md`: 제품 목표, 사용자, MVP 범위, product-level acceptance
- `2026-03-07-bgm-canvas-implementation-plan.md`: 기술 스택, 구조, 단계별 구현 계획, owner mapping, implementation-level tests

## 우선순위
문서 간 충돌 시 아래 순서를 따른다.

1. `00-governance/`
2. `10-product/`
3. `20-planning/`

## 새 문서 추가 규칙
- 협업 규칙 문서: `00-governance/`
- GitHub 운영 seed 문서: `00-governance/`
- 제품 요구사항 문서: `10-product/`
- 구현 계획 또는 ADR 성격 문서: `20-planning/`
- 더 이상 기준으로 쓰지 않는 문서: `90-archive/`

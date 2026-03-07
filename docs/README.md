# Docs Guide

## 목적
- `src/docs/` 안의 문서를 Codex와 사람이 같은 순서로 읽고, 같은 문서를 기준으로 수정하게 하기 위한 진입 문서다.

## Codex Reading Order
1. `00-governance/codex-collaboration-protocol.md`
2. `00-governance/document-map.md`
3. `00-governance/github-issue-seeds.md`
4. `10-product/prd.md`
5. `20-planning/2026-03-07-bgm-canvas-implementation-plan.md`

## Folder Roles
- `00-governance/`: 협업 규약, 문서 맵, 읽기 순서, 문서 우선순위
- `10-product/`: PRD, 제품 목표, 범위, 비목표
- `20-planning/`: 구현 계획, 기술 선택, 아키텍처, 단계 계획
- `90-archive/`: 더 이상 기준 문서로 쓰지 않는 보관 문서

## Source Of Truth
- 협업 방식과 채널 규칙: `00-governance/codex-collaboration-protocol.md`
- 문서 구조와 읽기 우선순위: `00-governance/document-map.md`
- GitHub Issue 초안과 작업 분해 기준: `00-governance/github-issue-seeds.md`
- 제품 요구사항: `10-product/prd.md`
- 기술 방향과 아키텍처: `20-planning/2026-03-07-bgm-canvas-implementation-plan.md`

## 문서 수정 규칙
- 협업 방식이 바뀌면 `00-governance/`를 먼저 수정한다.
- 제품 목표나 범위가 바뀌면 `10-product/`를 먼저 수정한다.
- 기술 선택이나 단계 계획이 바뀌면 `20-planning/`을 먼저 수정한다.
- GitHub Issue 분해 기준이 바뀌면 `00-governance/github-issue-seeds.md`를 수정한다.
- 반복 참조되는 새 규칙이 생기면 먼저 적절한 폴더를 정한 뒤 문서를 추가한다.

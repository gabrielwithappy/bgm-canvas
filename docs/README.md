# Docs Guide

## 목적
- `src/docs/` 안의 문서를 Codex와 사람이 같은 순서로 읽고, 같은 문서를 기준으로 수정하게 하기 위한 진입 문서다.

## Codex Reading Order
1. `00-governance/codex-collaboration-protocol.md`
2. `00-governance/document-map.md`
3. `10-product/prd.md`
4. `20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
5. `30-workstreams/2026-03-07-developer-a-role-charter.md`
6. `30-workstreams/2026-03-07-developer-b-role-charter.md`

## Folder Roles
- `00-governance/`: 협업 규약, 문서 맵, 읽기 순서, 문서 우선순위
- `10-product/`: PRD, 제품 목표, 범위, 비목표
- `20-planning/`: 구현 계획, 기술 선택, 아키텍처, 단계 계획
- `30-workstreams/`: 개발자별 작업 문서와 병렬 작업 범위
- `90-archive/`: 더 이상 기준 문서로 쓰지 않는 보관 문서

## Source Of Truth
- 협업 방식과 채널 규칙: `00-governance/codex-collaboration-protocol.md`
- 문서 구조와 읽기 우선순위: `00-governance/document-map.md`
- 제품 요구사항: `10-product/prd.md`
- 기술 방향과 아키텍처: `20-planning/2026-03-07-bgm-canvas-implementation-plan.md`
- 담당자별 실행 항목: `30-workstreams/*.md`

## 문서 수정 규칙
- 협업 방식이 바뀌면 `00-governance/`를 먼저 수정한다.
- 제품 목표나 범위가 바뀌면 `10-product/`를 먼저 수정한다.
- 기술 선택이나 단계 계획이 바뀌면 `20-planning/`을 먼저 수정한다.
- 담당 범위나 체크리스트가 바뀌면 `30-workstreams/`를 수정한다.
- 반복 참조되는 새 규칙이 생기면 먼저 적절한 폴더를 정한 뒤 문서를 추가한다.

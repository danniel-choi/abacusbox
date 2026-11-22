# AI Preview 사전 검증

- 생성 시각: 2026-11-22T08:41:46.086Z
- 기준 ref: HEAD
- 상태: READY

## 변경 파일

- .github/dependabot.yml
- .github/workflows/ai-quality.yml
- docs/ai-auto-upgrade.md
- docs/ai-data-contract.md
- docs/ai-preflight.md
- docs/ai-seo-check.md
- docs/ai-site-audit.md
- package.json

## 보호 경로 변경

없음

## 운영 원칙

- 보호 경로가 변경되면 사람의 검토 후에만 Preview 또는 운영 배포를 진행합니다.
- 환경변수와 Secret 파일은 커밋하지 않습니다.
- 이 검사는 배포 권한을 부여하거나 외부 계정 설정을 변경하지 않습니다.

## 권장 검증 순서

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm run ai:audit`
5. `npm run ai:seo-check`
6. `git diff --check`

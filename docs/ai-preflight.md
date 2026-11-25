# AI Preview 사전 검증

- 생성 시각: 2026-11-25T14:30:05.970Z
- 기준 ref: HEAD~1
- 상태: READY
- 보호 경로 자동 배포 승인: 비활성화

## 변경 파일

- .github/workflows/google-measurement.yml
- docs/ai-agent-credentials.md
- docs/analytics-baseline-2026-11-25.md
- package.json
- scripts/ai-google-data-snapshot.mjs
- scripts/ai-submit-sitemap.mjs

## 보호 경로 변경

없음

## 운영 원칙

- 보호 경로가 변경되면 기본적으로 사람의 검토가 필요하며, 명시적인 자동 배포 승인 플래그가 있을 때만 CI가 계속 진행합니다.
- 환경변수와 Secret 파일은 커밋하지 않습니다.
- 이 검사는 배포 권한을 부여하거나 외부 계정 설정을 변경하지 않습니다.

## 권장 검증 순서

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm run ai:audit`
5. `npm run ai:seo-check`
6. `git diff --check`

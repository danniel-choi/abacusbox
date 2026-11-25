# AI Preview 사전 검증

- 생성 시각: 2026-11-25T04:29:44.949Z
- 기준 ref: HEAD~1
- 상태: READY
- 보호 경로 자동 배포 승인: 활성화

## 변경 파일

- .github/workflows/ai-quality.yml
- app/blog/[slug]/page.tsx
- components/AdminAccessClient.tsx
- components/AdminAutomationClient.tsx
- components/AdminModerationClient.tsx
- components/CalculatorClient.tsx
- components/InquiryBoardClient.tsx
- docs/ai-data-contract.md
- docs/ai-preflight.md
- docs/ai-seo-check.md
- docs/ai-site-audit.md
- docs/revenue-5m-plan.md
- functions/_lib/posts.js
- functions/api/admin/session.js
- functions/api/blog-image/[slug].js
- functions/api/contact/[slug].js
- functions/api/contact/index.js
- functions/blog/[slug].js
- lib/calculators.ts
- lib/i18n.ts
- migrations/0017_contact_visibility.sql
- migrations/0018_preserve_existing_inquiry_privacy.sql
- scripts/ai-preflight.mjs

## 보호 경로 변경

- functions/api/admin/session.js
- functions/api/contact/[slug].js
- functions/api/contact/index.js
- lib/calculators.ts
- migrations/0017_contact_visibility.sql
- migrations/0018_preserve_existing_inquiry_privacy.sql

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

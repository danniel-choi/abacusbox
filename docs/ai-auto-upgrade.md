# 자동 업그레이드 운영 정책

## 자동으로 실행되는 작업

- `main` 푸시와 매일 정기 실행 시 읽기 전용 사이트 감사
- GA4 이벤트 데이터 계약 검사
- TypeScript, lint, 정적 build 검사
- 계산기 HTML의 title, description, canonical, H1, robots 검사
- 보호 경로 변경 여부와 Preview 사전 검증
- Dependabot의 주간 npm 의존성 업데이트 PR 생성
- 품질 검사 통과 후 Cloudflare Pages 운영 배포
- GitHub Repository Variables에 저장된 GA4·AdSense 공개 설정을 운영 build에 반영
- GitHub Secrets에 저장된 Cloudflare 배포 인증값을 배포 단계에서만 사용

## 자동으로 변경하지 않는 작업

- Google API 서비스 계정 키·Cloudflare API 토큰·관리자 토큰의 생성 또는 값 변경
- 인증 권한 부여·회수, 도메인·DNS·Cloudflare 계정 설정 변경
- 사용자 데이터 삭제, 관리자 세션·권한 변경

계산 공식이나 광고 코드가 `main`에 반영되면 동일한 품질 검증을 통과한 뒤 자동 배포됩니다. 검증이 실패하면 운영 사이트는 변경되지 않습니다. 자동화가 외부 계정의 Secret 값을 생성하거나 변경하지는 않으며, 필요한 값은 저장소·환경의 Secret/Variable에 미리 등록해야 합니다.

## 필요한 GitHub 설정

Repository 또는 `production` Environment에 다음 값을 등록합니다.

### Secrets

- `CLOUDFLARE_API_TOKEN`: Pages 배포 권한이 있는 Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID

### Variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT`
- `NEXT_PUBLIC_ADSENSE_TOP_SLOT`
- `NEXT_PUBLIC_ADSENSE_CALCULATOR_SLOT`
- `NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT`
- `NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT`

## Google 측정 자동화

`.github/workflows/google-measurement.yml`이 매일 읽기 전용 Search Console·GA4·AdSense 스냅샷을 시도한다. `GOOGLE_SERVICE_ACCOUNT_JSON`, `GA4_PROPERTY_ID`, `SEARCH_CONSOLE_SITE_URL`이 GitHub production environment에 없으면 실패하지 않고 측정 대기 상태로 종료한다. 수집된 결과는 30일 보관 artifact로만 저장하며 소스 코드나 로그에 인증값을 기록하지 않는다.

공개 측정 ID와 광고 슬롯은 Variables에 넣고, 서비스 계정 JSON·API 토큰은 반드시 Secrets에 넣습니다.

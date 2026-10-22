# AbacusBox 애드센스·SEO 감사

작성일: 2026-10-23
대상: https://www.abacusbox.com/

## 1. 확인 범위

이번 감사는 저장소 코드, 빌드 산출물, 정적 라우팅, 공개 설정을 기준으로 수행했다. Google Search Console과 AdSense 계정의 실제 수치, Chrome DevTools 기반 Core Web Vitals는 이 작업환경에서 직접 확인하지 못했다.

## 2. 현재 프로젝트 구조

- 프레임워크: Next.js 16.3.1 App Router
- UI: React 19.1, TypeScript, Tailwind CSS 3.4
- 빌드: `next build --webpack`, `output: "export"`
- 호스팅: Cloudflare Pages
- 서버 기능: Pages Functions
- 데이터베이스: Cloudflare D1 바인딩과 migrations
- 주요 코드 영역: `app/`, `components/`, `lib/`, `functions/`, `migrations/`
- 광고: Google AdSense 자동 로더 + 명시적 디스플레이 광고 슬롯
- 분석: GA4 `G-YR4TQPTLNL`, D1 기반 자체 방문자 통계 API

## 3. 라우팅 및 콘텐츠 규모

최근 성공 빌드 기준:

- 계산기 정적 페이지: 189개
- 블로그 정적 페이지: 41개
- 주제 허브: 11개
- 전체 정적 라우트: 260개
- `out/` 빌드 산출물: 약 48MB

주요 공개 경로:

- `/calculators/[slug]`
- `/blog/[slug]`
- `/tax`, `/labor`, `/loan`, `/stock`, `/health`, `/daily`, `/life`, `/game`, `/saju`, `/business`, `/math`
- `/resources`, `/about`, `/editorial-policy`, `/privacy`, `/terms`, `/contact`

## 4. 현재 SEO 구현

- 공통 `metadataBase`와 `www.abacusbox.com` 기준 canonical
- 홈페이지와 주요 정적 페이지 canonical
- 계산기별 고유 title, description, keywords, canonical
- 블로그별 고유 title, description, canonical
- `robots.txt`에서 `/sitemap.xml`을 지정
- `sitemap.xml`에 계산기, 블로그, 허브, 주요 정적 페이지 포함
- 홈페이지 `WebSite` JSON-LD
- 계산기 `WebApplication`, `FAQPage`, `BreadcrumbList` JSON-LD
- 허브 `CollectionPage`, `ItemList`, `BreadcrumbList` JSON-LD
- 공개 핵심 페이지에 코드상 `noindex` 없음
- 관리자·게시물 작성 등 일부 운영 페이지는 `noindex`

## 5. 발견한 개선 항목

### 높은 우선순위

1. Search Console 실제 색인 상태 미확인
   - `색인 생성됨`, `발견됨-현재 색인 생성되지 않음`, 중복 canonical, soft 404를 구분해야 한다.
   - 사이트맵 제출 상태와 최근 Googlebot 크롤링 시점도 확인해야 한다.

2. 카테고리 허브의 Open Graph 메타데이터 보강 필요
   - 일부 허브 페이지는 title/description/canonical은 있으나 페이지별 `og:url`, `og:title`, `og:description`이 공통 레이아웃 값으로 상속될 가능성이 있다.
   - 검색 자체보다 공유 미리보기와 페이지 주제 신호를 약화시킬 수 있다.

3. 핵심 계산기 콘텐츠 품질을 3~5개부터 검증할 필요
   - 계산기 수가 많으므로 전 페이지 동시 수정 대신 최저임금, 실수령액, 퇴직금, 연말정산, 대출 DSR 등을 우선 후보로 둔다.
   - 각 페이지의 공식, 기준일, 입력 가정, 검산 예시, 예외 조건, FAQ, 공식 출처를 실제 로직과 대조해야 한다.

### 중간 우선순위

4. 계산기 클라이언트 번들 점검
   - `CalculatorClient.tsx`가 `three`를 정적으로 import하고 여러 계산기 UI와 로직을 한 클라이언트 번들에서 처리한다.
   - 실제 네트워크·번들 크기와 페이지별 실행 비용을 측정한 후, 필요한 계산기만 동적 로딩하는 방향을 검토한다.

5. 광고 슬롯별 성과 분리
   - 현재 기본 슬롯은 `8858811048`이며, 개별 환경변수가 없으면 top/calculator/inArticle/bottom이 같은 슬롯으로 fallback한다.
   - 실제 RPM·노출·정책 상태를 확인하기 전 광고 배치를 더 늘리거나 수익을 추정하지 않는다.

6. 사이트맵 최신일자 관리
   - `app/sitemap.ts`는 일부 URL에 빌드 시점 `new Date()`를 사용한다.
   - 실제 콘텐츠가 바뀌지 않았는데 모든 URL이 갱신된 것처럼 보이지 않도록 콘텐츠 수정일 기반으로 정리하는 것을 검토한다.

## 6. 광고 구현 점검 결과

- AdSense 스크립트는 `AdSenseLoader`에서 ID를 검사한 뒤 한 번 삽입한다.
- 명시적 광고는 홈페이지, 허브, 계산기, 블로그에 배치되어 있다.
- 광고 영역은 `ad-slot`과 placement 라벨로 콘텐츠와 구분된다.
- 자동 광고 설정 자체는 AdSense 계정에서 직접 확인해야 한다.
- 광고 클릭 유도나 계산 버튼처럼 보이게 하는 구현은 확인하지 않았다.
- 실제 모바일 광고 표시, CLS, RPM, 광고 요청 성공률은 계정/브라우저 측정이 필요하다.

## 7. 모바일·접근성·성능

코드상 모바일 레이아웃은 Tailwind breakpoint, 모바일 메뉴, 반응형 입력 UI를 사용한다. 계산기 입력에는 React Hook Form과 label 구조가 사용되지만, 전체 페이지의 키보드 순서·스크린리더·대비를 자동 감사하지는 못했다.

Chrome DevTools MCP(`navigate_page`, `performance_start_trace`, `take_snapshot`)가 현재 연결되어 있지 않아 다음 수치는 미검증이다.

- LCP, INP, CLS
- FCP, TBT, Speed Index
- 실제 네트워크 요청과 캐시 헤더
- 브라우저 콘솔 오류
- 광고 삽입에 따른 layout shift

## 8. 외부에서 반드시 확인할 데이터

- Search Console 최근 3개월: 클릭수, 노출수, CTR, 평균순위
- Search Console 페이지 색인 상태와 제외 이유
- Search Console 상위 검색어와 페이지
- AdSense 페이지별 예상 수입, 페이지 RPM, 광고 노출수
- GA4 랜딩 페이지, 유입 채널, 참여율
- 모바일·데스크톱 실제 Core Web Vitals

## 9. 임시 우선순위

1. Search Console 데이터 확보
2. 주요 허브 OG 메타데이터 보강
3. 핵심 계산기 3~5개 콘텐츠와 계산 검증
4. 계산기 클라이언트 번들 및 광고 CLS 측정
5. 데이터 기반으로 신규 계산기 1~2개만 선정


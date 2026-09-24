# 계산의정석

금융 및 노무 계산기를 정적 생성 페이지로 제공하는 Next.js App Router 프로젝트입니다.

## 기능

- 노무: 실업급여, 퇴직금, 주휴수당, 4대 보험 실수령액
- 금융: DSR/LTV 대출 한도, 예금·적금 실수령액, IRP·연금저축 절세액
- 각 상세 페이지: 상단 인터랙티브 계산기, 결과 표, 반응형 막대 그래프, URL 공유, 결과 이미지 다운로드
- 블로그: 제도 해설, 비교 글, 운영 업데이트 목록 및 상세 페이지
- 커뮤니티: 질문답변, 사례공유, 공지형 게시판 목록 및 상세 페이지
- 블로그/커뮤니티 화면은 Pages 배포 시 `/api/*` D1 데이터를 우선 사용하고, 로컬/비상 시 정적 fallback 데이터를 표시
- 커뮤니티 상세는 댓글 조회/등록과 좋아요 토글을 `Pages Functions + D1`으로 처리
- 관리자 API 추가: 댓글 승인/거절 목록 조회, 게시글 목록 조회
- 커뮤니티 목록은 `board`, `sort` 쿼리 파라미터 기반 필터/정렬 지원
- 관리자 화면 추가: `/admin/moderation` 에서 토큰 입력 후 댓글 승인과 게시글 점검 가능
- D1 스키마가 아직 비어 있으면 읽기 API는 bundled fallback 콘텐츠로 응답하고, 쓰기/관리 API는 명시적으로 503을 반환
- SEO: 페이지별 metadata, canonical, FAQ JSON-LD, WebApplication JSON-LD, sitemap, robots
- Cloudflare Pages + D1 준비: `wrangler.toml`, `migrations/`, `functions/api/*`, `_routes.json`
- 애드센스 기본 요건: 소개, 문의, 개인정보처리방침 페이지 포함
- 디자인: Pretendard JP 기반 타이포그래피, 네이비/그린 브랜드 시스템, 계산의정석 SVG 로고

## 실행

```bash
npm install
npm run dev
```

현재 로컬 확인 서버는 `http://localhost:3001`에서 실행 중입니다.

## Cloudflare Pages + D1 배포 구조

- 정적 페이지: 홈, 계산기, 블로그, 소개 페이지는 Next.js static export로 `out/`에 생성
- 동적 기능: `functions/api/*`에서 Pages Functions로 실행
- DB: Cloudflare D1 바인딩 `CONTENT_DB`
- 라우팅: [public/_routes.json](./public/_routes.json) 으로 `/api/*`만 Functions 실행

### 필수 설정

1. `wrangler.toml`의 `database_id`를 실제 D1 ID로 교체
2. `wrangler.toml`의 `preview_database_id`를 실제 preview D1 ID로 교체
3. Pages 프로젝트의 D1 binding 이름을 `CONTENT_DB`로 맞춤
4. 관리자 쓰기 API를 쓸 경우 `ADMIN_API_TOKEN` 환경변수 추가 (`.dev.vars` 또는 Dashboard secret)

### 권장 명령

```bash
npx wrangler d1 create calcrule-prod
npx wrangler d1 create calcrule-preview
npm run d1:migrate:remote
npm run build
npm run cf:preview
```

상세 절차는 [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md)를 참고하세요.

### API 개요

- `GET /api/blog`
- `GET /api/blog/:slug`
- `GET /api/community`
- `GET /api/community/:slug`
- `GET /api/comments/:postId`
- `POST /api/comments/:postId`
- `POST /api/reactions/toggle`
- `POST /api/admin/posts`
- `POST /api/admin/publish`
- `GET /api/admin/content`
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:id`

## 검증

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

`next build`는 Next 16.3.1의 Turbopack CSS 처리에서 로컬 포트 바인딩 오류가 발생해 `next build --webpack`으로 고정했습니다.

## 기준 데이터

2026년 기준 최저임금, 국민연금 기준소득월액, 건강보험료율, 장기요양보험료율을 반영했습니다. 법령과 고시가 바뀌면 [lib/constants.ts](./lib/constants.ts)를 먼저 갱신하세요.

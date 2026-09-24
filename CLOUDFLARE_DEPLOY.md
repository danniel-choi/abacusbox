# Cloudflare Pages + D1 배포 절차

이 프로젝트는 다음 구조를 기준으로 배포합니다.

- 정적 페이지: Next.js `output: "export"` → `out/`
- 동적 API: `functions/api/*`
- DB: Cloudflare D1 (`CONTENT_DB`)

## 1. Wrangler 로그인

```bash
npx wrangler login
```

## 2. D1 데이터베이스 생성

```bash
npx wrangler d1 create calcrule-prod
npx wrangler d1 create calcrule-preview
```

생성 후 출력되는 `database_id`를 [wrangler.toml](./wrangler.toml)에 반영합니다.

- `database_id` → production DB ID
- `preview_database_id` → preview DB ID

## 3. 로컬 개발용 비밀값 준비

`.dev.vars.example`을 복사해서 `.dev.vars`를 만듭니다.

```bash
cp .dev.vars.example .dev.vars
```

예시:

```bash
ADMIN_API_TOKEN="very-strong-admin-token"
```

## 4. 마이그레이션 적용

로컬 테스트용:

```bash
npm run d1:migrate:local
```

원격 preview / production:

```bash
npx wrangler d1 migrations apply calcrule-preview --remote
npm run d1:migrate:remote
```

주의:

- `calcrule-preview`는 preview DB 이름 기준 예시입니다.
- production은 현재 script가 `calcrule-prod` 기준입니다.

## 5. 정적 빌드

```bash
npm run build
```

정상 완료 시 `out/` 폴더가 생성됩니다.

## 6. Pages 로컬 프리뷰

Cloudflare 문서 기준으로 Pages Functions와 바인딩은 Wrangler 설정 파일을 source of truth로 사용할 수 있습니다.

```bash
npm run cf:preview
```

기본적으로:

- 정적 파일은 `out/`
- Functions는 `functions/`
- D1 binding은 `wrangler.toml`
- secret은 `.dev.vars`

을 기준으로 로컬 프리뷰가 동작합니다.

## 7. Pages 프로젝트 생성 또는 연결

Cloudflare Dashboard 또는 Wrangler 기준으로 Pages 프로젝트를 연결합니다.

중요:

- `wrangler.toml`을 source of truth로 쓸 경우, Dashboard 설정과 파일 설정이 어긋나지 않게 유지해야 합니다.
- 기존 Pages 프로젝트가 있으면 Cloudflare가 권장하는 `pages download config` 흐름으로 현재 설정을 먼저 동기화하는 편이 안전합니다.

참고 명령:

```bash
npx wrangler pages download config <PROJECT_NAME>
```

## 8. Pages 배포

정적 출력 디렉터리는 이미 `pages_build_output_dir = "out"`로 지정되어 있습니다.

배포 전 확인:

- `wrangler.toml`의 DB ID 반영
- `.dev.vars` 또는 Dashboard secret 설정
- D1 migrations 적용 완료
- `npm run build` 성공

## 9. 배포 후 확인 체크리스트

- `/blog`
- `/community`
- `/community/post?slug=...`
- `/admin/moderation`
- `/api/blog`
- `/api/community`

다음 동작도 꼭 확인합니다.

- 댓글 등록
- 댓글 승인
- 좋아요 토글
- 게시글 목록 admin 조회

## 공식 참고 문서

- Pages Wrangler configuration
- Pages bindings
- D1 migrations apply
- D1 migrations reference
- Local development bindings support

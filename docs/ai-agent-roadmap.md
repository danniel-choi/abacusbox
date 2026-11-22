# AI 에이전트 운영 로드맵

## 1단계: 읽기 전용 감사

`npm run ai:audit`로 저장소 구조, SEO 소스, 사이트맵, robots, 홈페이지 내부 링크와 빌드 산출물을 점검합니다. 외부 검색·분석·광고 데이터는 API 권한이 없으면 수집하지 않습니다.

## 2단계: 외부 데이터 연결

- Search Console API: 클릭, 노출, CTR, 평균 순위, 색인 제외 사유
- GA4 Data API: 랜딩 페이지, 참여, 계산 시작·완료 이벤트
- AdSense API: 페이지 RPM, 노출, 예상 수입

각 API의 서비스 계정·OAuth 권한과 비밀값은 환경변수 또는 Secret에만 저장합니다.

## 3단계: 승인 기반 코드 개선

AI는 개선안을 Git 브랜치와 보고서로 만들고, 다음 검증을 통과해야 Preview 배포합니다.

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- 계산기 정상값·경계값 회귀 테스트
- sitemap·robots·canonical 검사

## 4단계: 운영 배포

세금·급여·대출 공식, 법률 기준, 광고 설정, 인증·데이터 삭제는 자동 배포 금지 목록으로 유지합니다. 사람이 승인한 Preview만 Cloudflare Pages 운영 환경으로 배포합니다.

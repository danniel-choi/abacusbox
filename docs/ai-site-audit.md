# AI 사이트 감사 보고서

- 생성 시각: 2026-11-22T04:42:54.348Z
- 감사 방식: 로컬 소스·빌드 산출물 기반 읽기 전용 점검
- 외부 데이터: https://www.abacusbox.com 응답 점검 포함
- 결과: 9 PASS / 0 FAIL / 0 MANUAL

## 점검 결과

| 상태 | 항목 | 확인 내용 |
| --- | --- | --- |
| PASS | 검증 명령 | build·typecheck·lint 스크립트 존재 여부 |
| PASS | 정적 sitemap 소스 | app/sitemap.ts 확인 |
| PASS | 정적 sitemap 날짜 | lastmod 자동 생성 없음 |
| PASS | 동적 sitemap 날짜 | 동적 lastmod 출력 없음 |
| PASS | robots sitemap 연결 | robots.ts의 sitemap 경로 확인 |
| PASS | 기본 robots 정책 | layout.tsx index/follow 확인 |
| PASS | 홈페이지 H1 | app/page.tsx의 H1 존재 여부 |
| PASS | 홈페이지 내부 링크 | 계산기·웹툴 링크 확인 |
| PASS | 빌드 sitemap 결과 | out/sitemap.xml 확인 |

## 외부 URL 점검

| 상태 | 항목 | 결과 |
| --- | --- | --- |
| MANUAL | 홈페이지 응답 | 접속 확인 실패로 수동 확인 필요: fetch failed |
| MANUAL | robots.txt 응답 | 접속 확인 실패로 수동 확인 필요: fetch failed |
| MANUAL | sitemap.xml 응답 | 접속 확인 실패로 수동 확인 필요: fetch failed |

## AI 에이전트 다음 작업 후보

1. Search Console API 권한 연결 후 색인 제외 URL과 검색 CTR을 실제 데이터로 수집합니다.
2. Analytics·AdSense API 권한 연결 후 랜딩 페이지, 계산 완료, 페이지 RPM을 분리합니다.
3. 영향 범위가 작은 title·description·내부 링크 개선안을 Git 브랜치로 생성합니다.
4. 계산 공식·법률 기준·광고 설정은 자동 배포 금지 목록으로 유지합니다.
5. typecheck·lint·build와 계산 회귀 테스트를 통과한 변경만 Preview 배포합니다.

## 안전 정책

- 이 보고서는 코드를 수정하거나 외부 계정 설정을 변경하지 않습니다.
- 외부 검색·수익 수치가 없으면 추정값을 생성하지 않습니다.
- 운영 배포는 사람이 승인한 변경 또는 명시적인 배포 작업만 허용합니다.

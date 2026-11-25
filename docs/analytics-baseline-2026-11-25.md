# AbacusBox 측정 기준선

확인일: 2026-11-25  
조회 범위: 2026-10-28 ~ 2026-11-24  
조회 방식: 연결된 Google API의 읽기 전용 집계 조회

## 확인된 실제 데이터

### Search Console

- 노출: 31회
- 클릭: 4회
- 확인된 페이지 행: 2개
- `https://www.abacusbox.com/` 노출 30회·클릭 4회
- `http://www.abacusbox.com/` 노출 1회·클릭 0회
- 등록된 사이트맵: `https://www.abacusbox.com/sitemap.xml`
- 사이트맵 마지막 다운로드: 2026-11-22
- 사이트맵 오류: 0개
- 사이트맵 경고: 0개

현재 검색 데이터는 홈페이지에 집중되어 있고 계산기·블로그의 검색 유입은 확인되지 않았다. 이를 검색 수요가 없다고 단정하지 않고, 색인·검색 노출이 아직 충분히 형성되지 않은 상태로 본다.

### GA4

- 세션: 44
- 활성 사용자: 39
- 페이지뷰: 351
- 가장 많은 공개 랜딩 페이지: `/calculators/lineage-classic-lucky-character` — 세션 15, 활성 사용자 14, 페이지뷰 112
- 홈페이지: 세션 5, 페이지뷰 46
- `/calculators/sunrise-sunset-calculator`: 세션 2, 페이지뷰 8
- 관리자 페이지가 세션 1에서 페이지뷰 55를 차지해 공개 서비스 지표를 오염시키는 문제가 확인됐다.

관리자 경로는 공개 성과 분석에서 제외하도록 GA4 로딩과 이벤트 전송을 수정했다. 배포 후 관리자 페이지의 페이지뷰가 새로 집계되지 않는지 확인한다.

### URL 검사 표본

- 홈페이지: 색인 생성됨, robots 허용, 페이지 가져오기 성공
- `loan-interest`: 크롤링 가능하지만 Google이 표준 태그가 포함된 대체 페이지로 표시했고, 검사 시점의 Google canonical은 apex 도메인으로 나타남
- `bmi`: 크롤링됨 — 현재 색인되지 않음
- `loan-prepayment-before-refinance`: Google에 아직 알려지지 않은 URL
- `loan-amortization`: Google에 아직 알려지지 않은 URL

운영 HTML의 현재 canonical은 `https://www.abacusbox.com/...`로 확인되므로, `loan-interest`의 apex canonical 표시는 이전 크롤링 결과 또는 호스트 변형 신호로 보고 재검사를 진행한다. apex 요청이 www로 308 리디렉션되는지도 배포 후 재확인한다.

## 호스트 통합 배포 확인

2026-11-25 배포 후 직접 확인한 결과:

- `https://abacusbox.com/calculators/loan-interest` → `308` 및 `https://www.abacusbox.com/...`로 이동
- `https://www.abacusbox.com/calculators/loan-interest` → `200`
- 비로그인 `https://www.abacusbox.com/admin/moderation` → `302` 및 관리자 로그인 화면으로 이동

배포 직후 URL 검사에서는 Google이 기존 apex 표준 URL을 아직 유지하고 있었다. 이는 새 리디렉션을 Google이 다시 크롤링하기 전의 상태이므로, 7~14일 후 URL 검사를 다시 확인해야 한다.

### AdSense

AdSense API 호출 자체는 성공했지만 계정 목록 응답은 0개였다. 이는 광고 수익이 0원이라는 뜻이 아니며, 서비스 계정에 AdSense 계정 조회 권한이 없거나 API 계정 식별자·연결 계정이 일치하지 않을 가능성을 먼저 확인해야 한다. 수익·RPM은 이 응답만으로 기록하지 않는다.

## 우선순위

1. 공개 지표에서 관리자 경로 제거
2. 핵심 계산기 5개와 실제 GA4 유입 상위 계산기의 색인 상태 재검사
3. apex/www 호스트 신호를 재검사하고 sitemap·canonical을 한 호스트로 유지
4. Search Console에서 계산기·블로그의 노출이 생기는지 7~14일 관찰
5. AdSense 계정 권한을 확인한 뒤 페이지 RPM과 예상 수입을 별도로 수집

## 데이터 사용 원칙

이 문서의 수치는 확인한 API 응답의 기준선이며 목표나 예측이 아니다. 검색어, 개인 식별 정보, 서비스 계정 비밀값은 저장하지 않는다.


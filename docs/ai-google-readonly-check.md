# Google API 읽기 전용 연결 점검

## 최근 점검 결과 (2026-11-27)

- 서비스 계정 JSON 형식: 통과
- Search Console: `PASS` — 대상 속성 확인
- GA4 Data API: `PASS` — 최근 7일 리포트 응답 확인
- AdSense Management API: `PASS` — API 응답 확인, 계정 목록 0개
- 지정 AdSense 계정 조회: `REVIEW` — 설정된 계정 ID 조회가 HTTP 404로 확인됨
- 데이터 원문 저장·출력: 없음

## 의미

Search Console과 GA4는 읽기 권한이 정상 확인되어 검색 실적·랜딩·이벤트 스냅샷을 자동 수집할 수 있습니다. AdSense API도 호출은 성공했지만 계정 목록이 0개이고 설정된 계정 ID 조회가 HTTP 404이므로 수익·RPM이 0원이라는 뜻은 아닙니다. AdSense 계정 ID 형식·대상 계정·서비스 계정 연결 및 보고서 접근 권한을 별도로 확인해야 합니다.

계정 접근이 확인되면 자동 스냅샷은 최근 28일의 페이지 조회수, 노출수, 클릭수, 예상 수입, 페이지 RPM을 함께 요청하도록 준비되어 있습니다. 접근 전까지 해당 값은 `미확인`으로 유지합니다.

Search Console 사이트맵 제출 같은 쓰기 작업은 읽기 권한과 별개이며, 현재 별도 제출 요청에서는 HTTP 403이 확인됐습니다. 따라서 이 점검 결과만으로 사이트맵 제출이나 색인 요청이 성공했다고 해석하지 않습니다.

## 재점검 명령

```bash
AI_ALLOW_EXTERNAL_READ=1 npm run ai:google-readonly-check
```

재점검에서 Search Console·GA4가 `PASS`이므로 검색 실적과 GA4 랜딩·전환 데이터를 별도 보고서로 수집하고 있습니다. AdSense 수익 데이터는 계정 목록이 확인된 뒤에만 수집·기록합니다.

# Google API 읽기 전용 연결 점검

## 최근 점검 결과

- 서비스 계정 JSON 형식: 통과
- Search Console: `HTTP 403`
- GA4 Data API: `HTTP 403`
- AdSense Management API: `HTTP 403`
- 데이터 원문 저장·출력: 없음

## 의미

OAuth 토큰 발급은 진행됐지만, 서비스 계정에 각 Google 서비스의 속성·계정 권한이 아직 없거나 API가 활성화되지 않은 상태입니다. 이는 인증 JSON의 형식 오류가 아닙니다.

## 재점검 명령

```bash
AI_ALLOW_EXTERNAL_READ=1 npm run ai:google-readonly-check
```

권한 설정 후 재점검에서 403이 사라지면 다음 단계로 Search Console 검색 실적, GA4 랜딩·전환, AdSense 수익 데이터를 별도 보고서로 수집할 수 있습니다.

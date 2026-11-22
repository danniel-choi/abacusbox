# AI 외부 계정 형식 검사

- 생성 시각: 2026-11-22T07:21:44.131Z
- 준비된 항목: 4/4
- 상태: WAITING_FOR_SECRETS
- 보안: Secret 원문과 서비스 계정 값은 출력하지 않음

| 항목 | 상태 | 확인 결과 |
| --- | --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | VALID | 필수 구조 확인됨 |
| `SEARCH_CONSOLE_SITE_URL` | VALID | abacusbox.com HTTPS 속성 확인됨 |
| `GA4_PROPERTY_ID` | VALID | 숫자 Property ID 확인됨 |
| `ADSENSE_ACCOUNT_ID` | VALID | 계정 ID 형식 확인됨 |

실제 Google API 호출은 네 가지 값이 모두 유효하고, 해당 서비스 계정에 Search Console·GA4·AdSense 조회 권한을 부여한 뒤 별도 승인하여 실행합니다.

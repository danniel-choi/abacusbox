# AI 외부 데이터 연결 준비

현재 저장소에는 Google API 인증정보가 연결되어 있지 않습니다. 실제 검색·방문·광고 데이터를 수집하려면 다음 값을 Cloudflare Secret 또는 로컬 환경변수로 준비해야 합니다.

| 환경변수 | 용도 | 비고 |
| --- | --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google API 인증 | JSON 원문을 코드·Git에 저장하지 않음 |
| `SEARCH_CONSOLE_SITE_URL` | Search Console 속성 | `https://www.abacusbox.com/` |
| `GA4_PROPERTY_ID` | GA4 Data API | 측정 ID `G-...`가 아니라 숫자 Property ID |
| `ADSENSE_ACCOUNT_ID` | AdSense Management API | 계정의 `pub-...` 식별자와 API 요구 형식 확인 |

연결 전 필요한 권한:

1. Search Console 속성에 서비스 계정 이메일을 사용자로 추가
2. GA4 속성에 서비스 계정 이메일을 조회자 이상으로 추가
3. AdSense API 사용 권한과 계정 접근 권한 확인
4. 비밀값은 `.env.local`, Cloudflare Secret 또는 CI Secret에만 저장
5. 보고서에는 원본 토큰·서비스 계정 JSON·개인정보를 기록하지 않음

## 상태 확인

```bash
npm run ai:integration-status
```

이 명령은 값 자체를 출력하지 않고 환경변수의 준비 여부만 표시합니다. 값이 모두 준비되기 전에는 외부 API 수집기를 실행하지 않습니다.

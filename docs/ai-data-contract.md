# 분석 데이터 계약 점검

- 생성 시각: 2026-11-25T04:29:21.051Z
- 상태: PASS
- 외부 API 호출: 수행하지 않음

## GA4 이벤트

| 이벤트 | 소스 계측 | 허용 매개변수 |
| --- | --- | --- |
| `calculator_start` | 확인됨 | calculator_slug, completion_method, share_method |
| `calculator_complete` | 확인됨 | calculator_slug, completion_method, share_method |
| `share_click` | 확인됨 | calculator_slug, completion_method, share_method |

## 개인정보 보호 검사

- 계산 입력값과 결과값: GA4 전송 금지
- 급여, 생년월일, 이메일, 전화번호: GA4 전송 금지
- 허용 이벤트 매개변수: 계산기 식별자와 동작 방식만 사용
- 현재 발견된 금지 매개변수: 없음

## 외부 데이터 연결 상태

실제 Search Console·GA4 Data API·AdSense API 수집은 인증값이 준비된 뒤 별도 승인하여 실행합니다. 인증값은 이 보고서에 기록하지 않습니다.

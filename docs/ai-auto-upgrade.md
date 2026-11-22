# 자동 업그레이드 운영 정책

## 자동으로 실행되는 작업

- `main` 푸시와 매일 정기 실행 시 읽기 전용 사이트 감사
- GA4 이벤트 데이터 계약 검사
- TypeScript, lint, 정적 build 검사
- 계산기 HTML의 title, description, canonical, H1, robots 검사
- 보호 경로 변경 여부와 Preview 사전 검증
- Dependabot의 주간 npm 의존성 업데이트 PR 생성

## 자동 배포하지 않는 작업

- 계산 공식, 세금·급여·대출·보험 기준값 수정
- 광고 배치·광고 단위 변경
- 관리자 인증, 세션, 데이터 삭제·게시 로직 변경
- Google API 권한과 Secret 변경
- 자동 커밋, 자동 병합, 운영 배포

검증이 실패하면 GitHub Actions 결과만 남기고 운영 사이트는 변경하지 않습니다. 실제 코드 개선은 검토 가능한 PR과 검증 통과 후에만 반영합니다.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditPath = path.join(root, "docs", "ai-site-audit.md");
const outputPath = path.join(root, "docs", "ai-change-plan.md");

const read = (filePath) => (fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "");
const audit = read(auditPath);
const sourceFiles = [
  "components/CalculatorClient.tsx",
  "components/GoogleAnalytics.tsx",
  "components/AdSenseAd.tsx",
  "app/page.tsx",
  "app/calculators/[slug]/page.tsx",
];
const source = sourceFiles.map((file) => read(path.join(root, file))).join("\n");
const hasCalculatorEvents = /calculator_(start|complete)|share_click/.test(source);
const auditMatch = audit.match(/결과:\s*(\d+) PASS \/ (\d+) FAIL \/ (\d+) MANUAL/);
const auditSummary = auditMatch
  ? `${auditMatch[1]} PASS / ${auditMatch[2]} FAIL / ${auditMatch[3]} MANUAL`
  : "감사 요약을 확인할 수 없음";

const plan = `# AI 에이전트 승인 기반 변경 계획

- 생성 시각: ${new Date().toISOString()}
- 기준 감사: [ai-site-audit.md](./ai-site-audit.md)
- 현재 감사 결과: ${auditSummary}
- 외부 데이터: Search Console·GA4·AdSense 인증값이 없으므로 검색·수익 수치를 사용하지 않음
- 실행 원칙: 이 문서는 변경 제안서이며, 승인 전에는 운영 코드와 운영 환경을 변경하지 않음

## 현재 확인된 사실

- GA4 기본 태그가 \`components/GoogleAnalytics.tsx\`에 존재함
- 광고 노출 이벤트 \`ad_slot_view\`가 존재함
- 계산 시작·완료·공유 이벤트: ${hasCalculatorEvents ? "확인됨" : "현재 소스에서 확인되지 않음"}

## 자동 변경 허용 범위

다음 범위의 변경만 별도 승인 없이 Preview용 제안으로 만들 수 있습니다.

- 페이지별 title, description, canonical, Open Graph 문구
- 깨진 내부 링크와 관련 계산기 링크 보완
- label, aria 속성, 키보드 접근성, 모바일 문구와 간격 개선
- 문서·감사·검증 스크립트 추가
- 중복 없는 GA4 이벤트 계측 추가안 작성

## 자동 변경 금지 범위

다음 항목은 사람이 변경 내용을 확인하고 별도로 승인해야 합니다.

- \`lib/calculators.ts\`, 세금·급여·대출·보험 등 계산 공식과 기준값
- \`functions/_lib/scheduler.js\`, 자동 게시·예약·콘텐츠 생성 로직
- \`functions/api/admin/**\`, 인증·관리자 권한·세션
- \`functions/api/**\`의 데이터 삭제, 게시, 댓글·문의 저장 로직
- \`components/AdSenseAd.tsx\`, 광고 단위·배치·클릭을 유도할 수 있는 UI
- 마이그레이션, D1 데이터, 환경변수·Secret, 도메인·DNS·Cloudflare 설정
- 사용자 개인정보 수집 또는 추적 목적의 새 데이터 필드

## 다음 제안 작업

### P1 — 전환 이벤트 계측 검토

계산기 시작, 계산 완료, 공유 클릭을 실제 사용자 동작 지점에 한 번씩만 연결합니다. 이벤트 이름·매개변수·개인정보 포함 여부를 먼저 명세하고, 계산 결과나 입력값 전체를 GA4로 전송하지 않습니다.

### P1 — 핵심 페이지 SEO 점검

계산기 상세 페이지의 고유 title, description, canonical, H1과 관련 계산기 내부 링크를 정적 검사합니다. 검색량이나 순위는 Search Console 연결 전까지 추정하지 않습니다.

### P2 — Preview 검증 자동화

\`typecheck → lint → build → sitemap/robots 검사\` 순서를 실행하고, 보호 경로 변경 여부와 diff를 검사한 뒤 Preview 배포 후보로 표시합니다.

## 필수 검증 명령

\`\`\`bash
npm run typecheck
npm run lint
npm run build
npm run ai:audit
git diff --check
\`\`\`

## 외부 계정이 필요한 작업

다음 단계에서 실제 데이터를 읽으려면 [ai-agent-credentials.md](./ai-agent-credentials.md)의 환경변수를 Cloudflare Secret 또는 로컬 비추적 환경변수로 설정해야 합니다. 인증값을 소스 코드나 채팅에 입력하지 않습니다.
`;

fs.writeFileSync(outputPath, plan);
console.log(`AI 변경 계획 생성: ${path.relative(root, outputPath)}`);
console.log(`계산 전환 이벤트: ${hasCalculatorEvents ? "확인됨" : "추가 검토 필요"}`);

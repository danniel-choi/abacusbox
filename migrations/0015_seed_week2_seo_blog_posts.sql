INSERT OR IGNORE INTO authors (slug, name, role, bio)
VALUES ('operations', '계산의정석 운영팀', 'admin', '계산기와 연결되는 실전 가이드를 검수하고 발행합니다.');

INSERT OR IGNORE INTO posts (type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured)
VALUES
('blog', 'guide', 'net-salary-actual-take-home-guide-20261109', '연봉 실수령액 계산기 결과가 급여명세서와 다른 이유', '연봉 실수령액 계산 결과와 실제 월급이 달라지는 비과세·부양가족·원천징수 차이를 정리했습니다.', '연봉 실수령액은 연봉을 12개월로 나눈 금액과 항상 같지 않습니다. 비과세 급여, 국민연금·건강보험·고용보험, 소득세와 지방소득세가 순서대로 반영되기 때문입니다.\n\n계산기를 사용할 때는 먼저 연봉이 퇴직금 포함인지 별도인지 확인해야 합니다. 퇴직금 포함 연봉은 월 급여를 단순히 연봉 ÷ 12로 계산하면 실제 급여와 차이가 날 수 있습니다.\n\n식대처럼 비과세로 처리되는 금액은 세금과 일부 보험료의 기준에서 제외될 수 있습니다. 같은 총지급액이라도 과세급여와 비과세급여의 구성이 다르면 실수령액도 달라집니다.\n\n계산의정석 연봉 실수령액 계산기에서 입력 기준, 비과세, 부양가족, 퇴직금 포함 여부를 바꿔가며 비교한 뒤 실제 급여명세서와 대조하세요.', 'published', (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1), '2026-11-09T09:00:00.000Z', 0),
('blog', 'guide', 'loan-interest-monthly-payment-guide-20261109', '대출 이자 계산기에서 월 상환액과 총이자를 함께 봐야 하는 이유', '대출금액과 금리만 비교하지 않고 상환방식·기간·총이자까지 함께 확인하는 방법입니다.', '대출 이자 계산기에서 가장 먼저 보이는 값은 월 상환액이지만, 월 납입액이 낮다고 전체 비용까지 낮은 것은 아닙니다. 대출기간이 길어지면 매월 부담은 줄어도 총이자는 늘어날 수 있습니다.\n\n원리금균등상환은 매월 비슷한 금액을 내기 때문에 예산 관리가 쉽고, 원금균등상환은 초반 납입액이 높을 수 있지만 원금이 더 빠르게 줄어 총이자가 낮아질 수 있습니다.\n\n계산의정석 대출 이자 계산기에서 월 상환액과 총이자를 확인한 뒤 대출 DSR·LTV 계산기와 함께 사용해 상환 가능성과 총비용을 나누어 판단하세요.', 'published', (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1), '2026-11-09T08:50:00.000Z', 0),
('blog', 'guide', 'severance-average-wage-guide-20261109', '퇴직금 계산기에서 평균임금과 계속근로기간을 확인하는 방법', '퇴직금 계산의 핵심인 평균임금, 계속근로기간, 상여금·수당 반영 여부를 정리했습니다.', '퇴직금은 마지막 월급 한 달치를 그대로 계산하는 방식이 아닙니다. 퇴직 전 임금과 계속근로기간을 기준으로 평균임금을 산정하는 구조이므로 입사일과 퇴사일이 핵심입니다.\n\n정기 상여금이나 수당은 평균임금 반영 여부를 따로 확인해야 합니다. 계산기 결과는 예상액을 점검하는 참고값이며, 실제 정산에서는 근로계약서와 급여명세서, 취업규칙을 함께 확인하세요.\n\n계산의정석 퇴직금 계산기에서 기간과 임금 조건을 입력한 뒤 실수령액 계산기와 함께 퇴직 시점의 현금흐름을 비교해 보세요.', 'published', (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1), '2026-11-09T08:40:00.000Z', 0),
('blog', 'guide', 'weekly-holiday-pay-eligibility-guide-20261109', '주휴수당 계산기 전에 근로시간과 개근 여부를 확인하세요', '주휴수당을 계산할 때 주 소정근로시간, 개근, 스케줄 변경을 먼저 확인해야 하는 이유입니다.', '주휴수당은 시급에 일정 금액을 더하는 단순 계산만으로 판단하기 어렵습니다. 주 소정근로시간, 소정근로일 개근 여부, 근로계약상 스케줄을 함께 봐야 합니다.\n\n아르바이트는 주별 근무일과 시간이 바뀌는 경우가 많으므로 근로계약서와 실제 근무기록을 함께 확인해야 합니다.\n\n계산의정석 주휴수당 계산기에서 시급과 주 근로시간을 입력한 뒤 최저임금 계산기로 환산 시급도 함께 확인하세요.', 'published', (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1), '2026-11-09T08:30:00.000Z', 0),
('blog', 'guide', 'minimum-wage-monthly-pay-guide-20261109', '최저임금 계산기에서 월급을 시급으로 환산하는 방법', '월급과 주 소정근로시간을 기준으로 환산 시급을 확인할 때 주의할 기준을 정리했습니다.', '월급이 최저임금 이상인지 확인하려면 월급 총액만 보는 것이 아니라 최저임금 산입 범위와 월 환산 기준을 함께 봐야 합니다.\n\n기본급과 정기적으로 지급되는 수당을 나누고 식대·교통비처럼 별도 기준이 적용될 수 있는 항목을 확인하세요. 근로시간은 주 소정근로시간과 유급주휴시간을 어떤 기준으로 월 환산하는지에 따라 결과가 달라질 수 있습니다.\n\n계산의정석 최저임금 계산기는 환산 시급을 빠르게 비교하는 도구입니다. 실제 임금 판단 전에는 근로계약서와 급여명세서, 해당 연도의 공식 기준을 확인하세요.', 'published', (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1), '2026-11-09T08:20:00.000Z', 0),
('blog', 'guide', 'samjae-calculator-solar-lunar-guide-20261109', '삼재 계산기에서 양력·음력과 출생일을 정확히 입력하는 방법', '삼재 계산기를 사용할 때 띠 기준 연도와 양력·음력 생년월일을 확인하는 순서를 안내합니다.', '삼재 계산기는 태어난 해의 띠와 확인 연도를 기준으로 삼재 여부를 살펴보는 재미용 도구입니다. 출생일의 양력·음력 기준을 실제 기록과 맞추고, 음력이라면 평달과 윤달 여부도 확인하세요.\n\n삼재의 시작과 끝을 해석하는 방식은 체계에 따라 다를 수 있습니다. 계산 결과는 운명을 확정하는 판단이 아니라 전통적인 분류를 가볍게 확인하는 참고값으로 보세요.\n\n계산의정석 삼재 계산기에서는 생년월일을 한 번에 선택하고 양력·음력 기준을 구분해 입력할 수 있습니다.', 'published', (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1), '2026-11-09T08:10:00.000Z', 0);

INSERT OR IGNORE INTO tags (slug, name) VALUES
  ('실수령액', '실수령액'), ('급여명세서', '급여명세서'), ('대출이자', '대출이자'),
  ('상환방식', '상환방식'), ('퇴직금', '퇴직금'), ('평균임금', '평균임금'),
  ('주휴수당', '주휴수당'), ('최저임금', '최저임금'), ('삼재', '삼재'), ('양력음력', '양력음력');

INSERT OR IGNORE INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p JOIN tags t
WHERE (p.slug = 'net-salary-actual-take-home-guide-20261109' AND t.slug IN ('실수령액', '급여명세서'))
   OR (p.slug = 'loan-interest-monthly-payment-guide-20261109' AND t.slug IN ('대출이자', '상환방식'))
   OR (p.slug = 'severance-average-wage-guide-20261109' AND t.slug IN ('퇴직금', '평균임금'))
   OR (p.slug = 'weekly-holiday-pay-eligibility-guide-20261109' AND t.slug IN ('주휴수당'))
   OR (p.slug = 'minimum-wage-monthly-pay-guide-20261109' AND t.slug IN ('최저임금'))
   OR (p.slug = 'samjae-calculator-solar-lunar-guide-20261109' AND t.slug IN ('삼재', '양력음력'));

INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'net-salary' FROM posts WHERE slug = 'net-salary-actual-take-home-guide-20261109';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'loan-interest' FROM posts WHERE slug = 'loan-interest-monthly-payment-guide-20261109';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'severance' FROM posts WHERE slug = 'severance-average-wage-guide-20261109';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'weekly-holiday' FROM posts WHERE slug = 'weekly-holiday-pay-eligibility-guide-20261109';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'minimum-wage' FROM posts WHERE slug = 'minimum-wage-monthly-pay-guide-20261109';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'samjae-calculator' FROM posts WHERE slug = 'samjae-calculator-solar-lunar-guide-20261109';

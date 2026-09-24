INSERT OR IGNORE INTO posts (
  type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
)
VALUES
  (
    'blog', 'guide', 'irp-tax-credit-strategy-2026',
    'IRP와 연금저축, 세액공제 한도를 어떻게 나눠 넣는 게 유리할까',
    '총급여 구간과 납입 여력에 따라 IRP와 연금저축의 배분 전략을 실무적으로 정리했습니다.',
    '연금계좌 절세는 단순히 한도만 채운다고 끝나지 않습니다.\n\n총급여 구간, 기존 연금저축 납입액, 연말 현금흐름을 같이 봐야 실제 체감 효과가 달라집니다.\n\n계산룰의 연금 절세 계산기는 예상 공제액을 빠르게 확인하는 용도에 맞고, 실제 납입 결정 전에는 올해 총급여와 이미 납입한 금액을 기준으로 최종 점검하는 편이 안전합니다.',
    'published',
    (SELECT id FROM authors WHERE slug = 'editor-finance'),
    '2026-08-20T09:00:00.000Z',
    1
  ),
  (
    'blog', 'guide', 'weekly-holiday-pay-part-time-guide',
    '아르바이트 주휴수당, 실제로 어디까지 받을 수 있나',
    '근무일수와 소정근로시간이 애매한 아르바이트 사례를 기준으로 주휴수당 판단 흐름을 정리했습니다.',
    '주휴수당은 주 15시간 이상이라는 한 줄 기준으로만 이해하면 놓치는 부분이 많습니다.\n\n소정근로일 개근 여부와 주간 스케줄 변동도 같이 봐야 합니다.\n\n계산기로 대략적인 주휴수당 규모를 확인한 뒤에는, 급여 산정 단위가 주 기준인지 월 기준인지와 근무표 변경 이력을 같이 확인하는 편이 실무적으로 맞습니다.',
    'published',
    (SELECT id FROM authors WHERE slug = 'editor-labor'),
    '2026-08-20T06:00:00.000Z',
    1
  ),
  (
    'blog', 'guide', 'severance-common-mistakes-2026',
    '퇴직금 계산할 때 가장 자주 틀리는 4가지',
    '평균임금, 계속근로기간, 상여 반영 방식처럼 퇴직금 계산에서 반복적으로 틀리는 지점을 정리했습니다.',
    '퇴직금 계산에서 가장 흔한 오해는 월급 한 달치를 그대로 기준으로 잡는 것입니다.\n\n실제로는 평균임금과 계속근로기간이 함께 작동합니다.\n\n계산기로 추정한 뒤에는 입사일·퇴사일, 무급휴직 여부, 정기 상여 지급 규칙을 다시 점검해야 실제 지급액과 오차를 줄일 수 있습니다.',
    'published',
    (SELECT id FROM authors WHERE slug = 'editor-labor'),
    '2026-08-19T09:00:00.000Z',
    1
  ),
  (
    'blog', 'guide', 'net-salary-payslip-checklist',
    '실수령액 계산기와 급여명세서를 같이 볼 때 체크할 항목',
    '4대 보험, 소득세, 비과세 항목까지 급여명세서 비교에서 꼭 봐야 할 항목을 묶어 정리했습니다.',
    '실수령액 계산기는 빠르게 감을 잡기 좋지만, 실제 급여명세서와 1원 단위까지 맞추는 도구는 아닙니다.\n\n소득세, 지방소득세, 비과세 식대, 부양가족 수, 국민연금 상한 적용 여부처럼 작은 차이가 체감 실수령액을 크게 바꿀 수 있습니다.\n\n비교할 때는 총지급액과 공제총액만 보지 말고, 과세 대상 급여와 비과세 항목이 어떻게 분리됐는지까지 봐야 원인을 정확히 찾을 수 있습니다.',
    'published',
    (SELECT id FROM authors WHERE slug = 'editor-labor'),
    '2026-08-16T09:00:00.000Z',
    0
  );

INSERT OR IGNORE INTO tags (slug, name)
VALUES
  ('irp', 'IRP'),
  ('연금저축', '연금저축'),
  ('세액공제', '세액공제'),
  ('주휴수당', '주휴수당'),
  ('아르바이트', '아르바이트'),
  ('근로시간', '근로시간'),
  ('평균임금', '평균임금'),
  ('상여금', '상여금'),
  ('실수령액', '실수령액'),
  ('급여명세서', '급여명세서'),
  ('4대보험', '4대보험');

INSERT OR IGNORE INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t
ON (
  (p.slug = 'irp-tax-credit-strategy-2026' AND t.slug IN ('irp', '연금저축', '세액공제')) OR
  (p.slug = 'weekly-holiday-pay-part-time-guide' AND t.slug IN ('주휴수당', '아르바이트', '근로시간')) OR
  (p.slug = 'severance-common-mistakes-2026' AND t.slug IN ('퇴직금', '평균임금', '상여금')) OR
  (p.slug = 'net-salary-payslip-checklist' AND t.slug IN ('실수령액', '급여명세서', '4대보험'))
);

INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'pension-tax' FROM posts WHERE slug = 'irp-tax-credit-strategy-2026'
UNION ALL
SELECT id, 'weekly-holiday' FROM posts WHERE slug = 'weekly-holiday-pay-part-time-guide'
UNION ALL
SELECT id, 'severance' FROM posts WHERE slug = 'severance-common-mistakes-2026'
UNION ALL
SELECT id, 'net-salary' FROM posts WHERE slug = 'net-salary-payslip-checklist';

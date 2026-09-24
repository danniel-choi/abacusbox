INSERT INTO authors (slug, name, role, bio)
VALUES
  ('operations', '계산룰 운영팀', 'admin', '계산룰 콘텐츠와 커뮤니티 운영을 담당합니다.'),
  ('editor-finance', '금융 에디터', 'editor', '대출, 저축, 절세 가이드를 작성합니다.'),
  ('editor-labor', '노무 에디터', 'editor', '실업급여, 퇴직금, 급여 계산 가이드를 작성합니다.');

INSERT INTO posts (
  type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
)
VALUES
  (
    'blog', 'guide', 'unemployment-guide-2026',
    '2026 실업급여 계산 전에 먼저 확인해야 할 5가지',
    '평균임금, 가입기간, 이직 사유처럼 계산 결과보다 먼저 봐야 할 기준을 정리했습니다.',
    '실업급여는 단순히 평균임금만 넣어서 끝나는 계산이 아닙니다.\n\n이직 사유, 피보험 단위기간, 연령, 구직활동 인정 여부가 함께 작동합니다.\n\n계산룰의 실업급여 계산기는 상한액과 하한액을 반영하지만 실제 지급 여부는 별도 심사를 거칩니다.',
    'published', 3, '2026-08-18T00:00:00.000Z', 1
  ),
  (
    'blog', 'guide', 'dsr-ltv-practical-difference',
    'DSR과 LTV, 실제 대출 한도에서는 무엇이 더 먼저 막을까',
    '같은 집값과 소득이어도 어떤 규제가 먼저 한도를 막는지 실전 관점에서 설명합니다.',
    'LTV는 담보가치 기준이고 DSR은 상환능력 기준입니다.\n\n둘은 같은 듯 보이지만 실제 심사에서는 다른 제약으로 작동합니다.\n\n월 상환액과 연 상환액을 같이 봐야 의사결정에 도움이 됩니다.',
    'published', 2, '2026-08-15T00:00:00.000Z', 1
  ),
  (
    'community', 'qna', 'severance-includes-bonus',
    '퇴직금 계산에 상여금이 포함되는지 헷갈릴 때',
    '정기 상여와 비정기 상여의 처리 차이를 실제 질문 형태로 정리한 글입니다.',
    '퇴직금 계산에서 상여금 포함 여부는 지급 주기와 정기성에 따라 달라집니다.\n\n복잡한 임금구조라면 단순 월급 기준 계산기 결과만 믿지 말고 임금명세서와 지급 규정을 같이 확인해야 합니다.',
    'published', 1, '2026-08-19T00:00:00.000Z', 0
  ),
  (
    'notice', 'notice', 'content-community-open',
    '블로그·커뮤니티 섹션을 새로 열었습니다',
    '운영 공지와 함께 앞으로 어떤 글과 사례를 쌓아갈지 안내합니다.',
    '계산룰은 계산 결과에 더해 설명, 사례, 질문을 연결하는 구조로 확장하고 있습니다.\n\n초기에는 운영팀이 정리한 글 중심으로 시작하고, 이후에는 자주 묻는 질문과 사례를 더 체계적으로 분류할 예정입니다.',
    'published', 1, '2026-08-20T00:00:00.000Z', 1
  );

INSERT INTO tags (slug, name)
VALUES
  ('실업급여', '실업급여'),
  ('고용보험', '고용보험'),
  ('dsr', 'DSR'),
  ('ltv', 'LTV'),
  ('퇴직금', '퇴직금'),
  ('운영공지', '운영공지');

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t
ON (
  (p.slug = 'unemployment-guide-2026' AND t.slug IN ('실업급여', '고용보험')) OR
  (p.slug = 'dsr-ltv-practical-difference' AND t.slug IN ('dsr', 'ltv')) OR
  (p.slug = 'severance-includes-bonus' AND t.slug IN ('퇴직금')) OR
  (p.slug = 'content-community-open' AND t.slug IN ('운영공지'))
);

INSERT INTO post_calculators (post_id, calculator_slug)
SELECT id, 'unemployment' FROM posts WHERE slug = 'unemployment-guide-2026'
UNION ALL
SELECT id, 'loan-dsr' FROM posts WHERE slug = 'dsr-ltv-practical-difference'
UNION ALL
SELECT id, 'severance' FROM posts WHERE slug = 'severance-includes-bonus';

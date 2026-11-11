INSERT OR IGNORE INTO authors (slug, name, role, bio)
VALUES ('operations', '계산의정석 운영팀', 'admin', '계산기와 연결되는 실전 가이드를 검수하고 발행합니다.');

INSERT OR IGNORE INTO posts (
  type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
)
VALUES (
  'blog',
  'guide',
  'calculator-answer-viral-guide-20261111',
  '계산기 뚜드리면 답 나온다? 오늘 바로 숫자로 확인해봤습니다',
  '감으로만 고민하던 월급, 대출, 빚, 확률을 계산기에 넣어보면 어떤 답이 나오는지 직접 비교해봤습니다.',
  '계산기 뚜드리면 답 나온다는 말이 괜히 나온 게 아닙니다. 감으로는 비슷해 보이던 두 선택지가 숫자로 바뀌는 순간, 무엇이 더 부담스럽고 무엇을 먼저 확인해야 하는지 보이기 시작합니다.\n\n월급이 올랐는데 통장에 남는 돈은 왜 비슷한지 궁금하다면 연봉 실수령액 계산기에 세전 금액과 비과세 금액을 넣어보세요. 연봉이라는 큰 숫자가 4대보험과 세금을 거친 뒤 얼마로 바뀌는지 확인할 수 있습니다.\n\n대출은 금리와 기간, 상환방식을 바꾸면 월 납입액과 총이자가 달라집니다. 월 10만원 차이도 5년 전체로 보면 커질 수 있어 대출 이자 계산기로 먼저 비교하는 편이 안전합니다.\n\n빚 때문에 막막할 때도 감면액을 미리 확정할 수는 없지만, 세후 월소득과 필수지출을 넣어 상환 여력을 가늠해볼 수 있습니다. 빚 탕감 계산기는 상담 전에 채무·소득·지출 자료를 정리하는 출발점입니다.\n\n계산 결과를 친구와 공유해 할인율, 여행 예산, 성과급 세전·세후 금액을 비교해보세요. 다만 세금·대출·채무·노무 결과는 입력 기준과 공식 제도에 따라 달라질 수 있으므로 최종 판단은 원자료와 공식 안내를 기준으로 해야 합니다.\n\n오늘 고민하는 숫자가 있다면 머릿속으로만 굴리지 말고 직접 입력해보세요. 답을 대신 결정해주지는 않아도, 다음 질문을 더 정확하게 만들어주는 것만으로 계산기는 충분히 쓸모가 있습니다.',
  'published',
  (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1),
  '2026-11-11T09:00:00.000Z',
  1
);

INSERT OR IGNORE INTO tags (slug, name) VALUES
  ('계산기', '계산기'),
  ('숫자로확인', '숫자로 확인'),
  ('생활꿀팁', '생활꿀팁'),
  ('공유', '공유');

INSERT OR IGNORE INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t ON t.slug IN ('계산기', '숫자로확인', '생활꿀팁', '공유')
WHERE p.slug = 'calculator-answer-viral-guide-20261111';

INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'percent' FROM posts WHERE slug = 'calculator-answer-viral-guide-20261111';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'net-salary' FROM posts WHERE slug = 'calculator-answer-viral-guide-20261111';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'loan-interest' FROM posts WHERE slug = 'calculator-answer-viral-guide-20261111';
INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'debt-relief-calculator' FROM posts WHERE slug = 'calculator-answer-viral-guide-20261111';

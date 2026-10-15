INSERT OR IGNORE INTO authors (slug, name, role, bio)
VALUES ('operations', '계산의정석 운영팀', 'admin', '계산기와 연결되는 실전 가이드를 검수하고 발행합니다.');

DELETE FROM post_tags
WHERE post_id IN (
  SELECT id FROM posts
  WHERE slug IN ('game-gacha-probability-budget-guide-20261013', 'saju-manse-ryeok-birth-input-guide-20261013')
);

DELETE FROM post_calculators
WHERE post_id IN (
  SELECT id FROM posts
  WHERE slug IN ('game-gacha-probability-budget-guide-20261013', 'saju-manse-ryeok-birth-input-guide-20261013')
);

DELETE FROM posts
WHERE slug IN ('game-gacha-probability-budget-guide-20261013', 'saju-manse-ryeok-birth-input-guide-20261013');

INSERT INTO posts (
  type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
)
VALUES (
  'blog',
  'guide',
  'game-gacha-probability-budget-guide-20261013',
  '게임 뽑기 확률 계산 전 예산과 기대값을 같이 보는 법',
  '가챠, 랜덤박스, 이벤트 뽑기를 할 때 성공 확률만 보지 않고 기대 성공 횟수와 예산 상한을 함께 정리하는 방법입니다.',
  '# 게임 뽑기 확률 계산 전 예산과 기대값을 같이 보는 법

게임 뽑기나 가챠 이벤트는 1회 성공 확률이 작게 보일수록 감으로 판단하기 어렵습니다. 1회 확률이 2%라면 50번 안에 무조건 나온다는 뜻이 아니라, 50번을 시도했을 때 최소 1회 성공할 가능성이 어느 정도인지 따로 계산해야 합니다.

먼저 확인할 값은 1회 성공 확률, 시도 횟수, 1회 비용입니다. 이 세 가지가 정리되면 최소 1회 성공 확률, 기대 성공 횟수, 총 예상 비용을 한 번에 볼 수 있습니다. 같은 3% 확률이라도 10회와 100회는 체감이 완전히 다릅니다.

예산을 정할 때는 목표 횟수를 먼저 정하기보다 멈출 금액을 먼저 정하는 편이 안전합니다. 예를 들어 1회 비용이 1,200원이고 이번 이벤트에 36,000원까지만 쓰기로 했다면 최대 시도 횟수는 30회입니다. 그다음 30회 안에 목표 보상을 얻을 가능성을 계산하면 됩니다.

기대값은 확정 보상이 아닙니다. 기대 성공 횟수가 1.5회로 나오더라도 실제 결과는 0회일 수 있고, 반대로 여러 번 나올 수도 있습니다. 그래서 뽑기 확률 계산기는 결과를 보장하는 도구가 아니라, 내가 감수할 변동 폭을 미리 보는 도구에 가깝습니다.

게임사가 천장, 보너스 보상, 누적 보상, 픽업 보정 같은 규칙을 제공한다면 단순 독립 확률과 결과가 달라질 수 있습니다. 이 경우에는 기본 확률 계산으로 대략적인 범위를 본 뒤, 이벤트 공지의 보정 조건을 따로 확인해야 합니다.

계산의정석 뽑기 확률 계산기에서는 성공 확률과 뽑기 횟수를 바꿔가며 최소 1회 성공 확률과 예상 비용을 비교할 수 있습니다. 이벤트 시작 전 목표 보상, 최대 예산, 멈출 기준을 같이 적어두면 충동 지출을 줄이는 데 도움이 됩니다.',
  'published',
  (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1),
  '2026-10-13T02:55:00.000Z',
  0
);

INSERT INTO posts (
  type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
)
VALUES (
  'blog',
  'guide',
  'saju-manse-ryeok-birth-input-guide-20261013',
  '만세력 계산기에서 생년월일과 양력 음력을 입력할 때 확인할 것',
  '만세력 계산 전 양력·음력 구분, 윤달 여부, 출생시각 입력이 결과 해석에 어떤 차이를 만드는지 정리했습니다.',
  '# 만세력 계산기에서 생년월일과 양력 음력을 입력할 때 확인할 것

만세력 계산은 생년월일을 넣는 단순한 절차처럼 보이지만, 실제로는 날짜 기준을 어떻게 잡는지가 중요합니다. 같은 생일이라도 양력인지 음력인지, 음력이라면 평달인지 윤달인지에 따라 기준 날짜가 달라질 수 있습니다.

가장 먼저 확인할 것은 출생신고서나 가족 기록에 적힌 날짜가 양력인지 음력인지입니다. 예전 기록은 음력 생일을 생활 기준으로 쓰는 경우가 많아, 양력 생년월일로 바로 입력하면 생각한 사주와 다르게 나올 수 있습니다.

음력 생일을 입력할 때는 윤달 여부도 함께 봐야 합니다. 윤달은 해마다 있는 것이 아니고, 같은 음력 월이라도 평달과 윤달이 구분됩니다. 기록에 윤달이라고 적혀 있다면 만세력 계산기에서도 윤달 조건을 맞춰 입력하는 것이 좋습니다.

출생시각은 시주를 볼 때 필요합니다. 정확한 시간이 없다면 시각을 모름으로 두고 연주, 월주, 일주 중심으로 먼저 보는 편이 안전합니다. 대략적인 시간만 기억하는 경우에는 두 시간 경계에 걸리는지 확인해야 합니다.

입춘 전후 출생자는 사주 기준 연도가 일반 달력 연도와 달라질 수 있습니다. 특히 1월 말부터 2월 초 사이 출생자는 띠나 연주를 볼 때 단순 출생연도만 보지 말고 입춘 기준을 함께 확인해야 합니다.

계산의정석 만세력 계산기에서는 생년월일을 한 번에 선택하고 양력·음력 구분을 넣어 연주, 월주, 일주, 시주를 확인할 수 있습니다. 결과는 자기 이해를 돕는 참고 자료로 보고, 중요한 상담이나 해석에는 원자료와 기준일을 함께 확인하는 것이 좋습니다.',
  'published',
  (SELECT id FROM authors WHERE slug = 'operations' LIMIT 1),
  '2026-10-13T02:56:00.000Z',
  0
);

INSERT OR IGNORE INTO tags (slug, name) VALUES ('game', '게임');
INSERT OR IGNORE INTO tags (slug, name) VALUES ('gacha-probability', '뽑기확률');
INSERT OR IGNORE INTO tags (slug, name) VALUES ('game-budget', '게임예산');
INSERT OR IGNORE INTO tags (slug, name) VALUES ('saju', '사주');
INSERT OR IGNORE INTO tags (slug, name) VALUES ('manse-ryeok', '만세력');
INSERT OR IGNORE INTO tags (slug, name) VALUES ('lunar-solar', '양력음력');

INSERT OR IGNORE INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t ON t.slug IN ('game', 'gacha-probability', 'game-budget')
WHERE p.slug = 'game-gacha-probability-budget-guide-20261013';

INSERT OR IGNORE INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t ON t.slug IN ('saju', 'manse-ryeok', 'lunar-solar')
WHERE p.slug = 'saju-manse-ryeok-birth-input-guide-20261013';

INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'draw-probability'
FROM posts
WHERE slug = 'game-gacha-probability-budget-guide-20261013';

INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
SELECT id, 'manse-ryeok'
FROM posts
WHERE slug = 'saju-manse-ryeok-birth-input-guide-20261013';

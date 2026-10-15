UPDATE authors
SET name = '계산의정석 운영팀',
    bio = COALESCE(bio, '계산기와 연결되는 실전 가이드를 검수하고 발행합니다.')
WHERE slug = 'operations';

export const SUPPORTED_LOCALES = ["ko", "en", "ja"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_STORAGE_KEY = "calcrule:locale";

export const localeLabels: Record<Locale, { native: string; short: string; htmlLang: string }> = {
  ko: { native: "한국어", short: "KO", htmlLang: "ko" },
  en: { native: "English", short: "EN", htmlLang: "en" },
  ja: { native: "日本語", short: "JA", htmlLang: "ja" }
};

const ko = {
  "nav.calculators": "계산기",
  "nav.tax": "세금",
  "nav.stock": "주식",
  "nav.health": "건강",
  "nav.daily": "일상",
  "nav.game": "게임",
  "nav.saju": "사주",
  "nav.blog": "블로그",
  "language.label": "언어",
  "search.label": "검색",
  "search.placeholder": "계산기 검색",
  "search.submit": "이동",
  "menu.open": "메뉴 열기",
  "menu.close": "메뉴 닫기",
  "footer.brand": "계산의정석 · 계산의 정석",
  "footer.description":
    "노무, 금융, 세금, 건강, 일상 도구, 생활 계산을 빠르게 비교하고 공식 기준과 해설을 함께 확인하는 계산기 디렉토리입니다. 계산 결과는 참고용 추정치이며, 실제 법률·세무·금융 판단은 관할 기관 또는 전문가 확인이 필요합니다.",
  "footer.contact": "운영 문의: 사이트 문의 게시판을 통해 접수합니다.",
  "footer.info": "사이트 정보",
  "footer.about": "소개",
  "footer.blog": "블로그",
  "footer.resources": "참고 링크",
  "footer.policy": "운영 원칙",
  "footer.privacy": "개인정보처리방침",
  "footer.terms": "이용약관",
  "footer.contactLink": "문의",
  "footer.sitemap": "사이트맵",
  "calculator.inputEyebrow": "입력값",
  "calculator.inputTitle": "조건을 입력하세요",
  "calculator.autoCalculate": "자동 계산",
  "calculator.resetDefaults": "기본값 복원",
  "calculator.calculationDate": "계산 날짜",
  "calculator.birthDate": "생년월일",
  "calculator.solar": "양력",
  "calculator.lunar": "음력",
  "calculator.leap": "윤달",
  "calculator.commonMonth": "평달",
  "calculator.dateBasis": "날짜 기준",
  "calculator.birthDateBasis": "생년월일 기준",
  "calculator.lunarType": "음력 구분",
  "calculator.birthTime": "출생시각",
  "calculator.timeUnknown": "시간 모름",
  "calculator.dateHelp": "일출·일몰을 계산할 날짜를 한 번에 선택하면 결과가 바로 다시 계산됩니다.",
  "calculator.birthDateHelp": "{basis} 생년월일을 한 번에 선택하면 결과가 바로 다시 계산됩니다.",
  "calculator.slider": "{label} 슬라이더",
  "calculator.inputSummary": "입력 요약",
  "calculator.autoSaved": "마지막 입력값은 이 기기에서 자동 저장됩니다.",
  "calculator.viewResult": "결과 보기",
  "calculator.resultEyebrow": "계산 결과",
  "calculator.tarotTitle": "타로 카드 보기",
  "calculator.tarotDescription": "계산된 메이저 아르카나 조합을 카드 형태로 확인합니다.",
  "calculator.tarotCount": "{count}장 조합",
  "calculator.tarotPersonality": "성격 카드",
  "calculator.tarotSoul": "영혼 카드",
  "calculator.tarotBridge": "연결 카드",
  "calculator.chartTitle": "비교 차트",
  "calculator.chartDescription": "핵심 수치를 한 번에 비교합니다.",
  "calculator.checkpointsTitle": "해석 포인트",
  "calculator.nextActionEyebrow": "다음 액션",
  "calculator.nextActionTitle": "계산 결과로 바로 이어서 할 일",
  "calculator.customRecommendation": "맞춤 추천",
  "calculator.preConsultation": "상담 전 정리",
  "calculator.saveResult": "결과 저장",
  "calculator.relatedTitle": "다음에 이어서 볼 계산기",
  "calculator.disclaimer":
    "계산 결과는 입력값과 현재 반영 기준에 따른 추정치입니다. 실제 심사·지급·대출 승인 결과는 기관 판단에 따라 달라질 수 있습니다.",
  "directory.eyebrow": "계산기 디렉토리",
  "directory.compactTitle": "원하는 계산기를 빠르게 찾으세요.",
  "directory.title": "전체 계산기를 카테고리별로 찾을 수 있습니다.",
  "directory.description": "검색어, 분야, 그룹 기준으로 계산기를 좁혀서 바로 들어갈 수 있습니다.",
  "directory.viewAll": "전체 계산기 보기 ↗",
  "directory.searchPlaceholder": "예: 실업급여, 취득세, 환율, 부가세",
  "directory.openFilter": "필터 열기",
  "directory.sort": "정렬",
  "directory.default": "기본",
  "directory.all": "전체",
  "directory.allCategory": "전체 분야",
  "directory.allGroup": "전체 그룹",
  "directory.recommended": "추천순",
  "directory.name": "이름순",
  "directory.group": "그룹순",
  "directory.reset": "필터 초기화",
  "directory.featured": "운영 추천 계산기",
  "directory.recent": "최근 추가된 계산기",
  "directory.more": "나머지 계산기 더 보기",
  "directory.filter": "필터",
  "directory.filterDescription": "분야, 그룹, 정렬 기준을 조정합니다.",
  "directory.close": "닫기",
  "directory.clear": "초기화",
  "directory.apply": "적용",
  "directory.calculate": "계산하기",
  "directory.countCalculators": "개"
  ,"home.directoryEyebrow": "빠른 진입"
  ,"home.indicatorEyebrow": "오늘의 지표"
  ,"home.indicatorTitle": "주요 환율과 금 시세를 한눈에 확인하세요."
  ,"home.indicatorDescription": "빠른생활도구에서 제공하는 오늘의 지표를 메인 화면에서 바로 확인하고, 최신 값은 원문 페이지에서 이어서 볼 수 있습니다."
  ,"home.indicatorCta": "오늘의 지표 보기 ↗"
  ,"home.indicatorRate": "주요 환율"
  ,"home.indicatorRateText": "오늘 기준 환율 확인"
  ,"home.indicatorGold": "금 시세"
  ,"home.indicatorGoldText": "오늘의 금 가격 확인"
  ,"home.indicatorLive": "실시간 업데이트"
  ,"home.indicatorLiveText": "빠른생활도구에서 최신 값 제공"
  ,"home.indicatorDelayed": "업데이트 지연"
  ,"home.indicatorLoading": "불러오는 중..."
  ,"home.indicatorUnavailable": "확인할 수 없음"
  ,"home.indicatorSource": "환율: ExchangeRate-API · 금: gold-api.com · 값은 외부 API 기준 참고용입니다."
  ,"home.directoryTitle": "분야별 계산기 바로가기"
  ,"home.viewAll": "전체 보기 ↗"
  ,"home.shareEyebrow": "공유하기 좋은 계산기"
  ,"home.shareTitle": "내 결과를 카드로 저장하고 바로 공유하세요."
  ,"home.resultCard": "결과 카드"
  ,"home.shareExample": "공유 예시"
  ,"home.guideEyebrow": "주제별 가이드"
  ,"home.guideTitle": "계산기와 해설을 분야별로 묶었습니다."
  ,"home.popular": "많이 찾는 계산기"
  ,"home.recent": "새로 추가된 계산기"
  ,"home.flowEyebrow": "이용 흐름"
  ,"home.flowTitle": "필요한 계산에서 기준 확인까지 한 흐름으로 이어집니다."
  ,"home.findCalculator": "계산기 찾기"
  ,"home.allCalculators": "전체 계산기 보기"
  ,"home.viewResources": "참고 사이트 보기"
  ,"home.live": "LIVE"
  ,"home.basedOn": "기준연도"
  ,"home.heroBadge": "{year}년 기준 {count}개 계산기·수학 도구 디렉토리"
  ,"home.calculatorCount": "운영 계산기"
  ,"home.groupCount": "계산기 그룹"
  ,"home.standardYear": "반영 기준연도"
  ,"home.trustEyebrow": "신뢰 기준"
  ,"home.trustTitle": "공식 기준을 바탕으로 구성했습니다."
  ,"home.blogEyebrow": "블로그"
  ,"home.blogTitle": "계산과 연결되는 해설 콘텐츠"
  ,"home.siteGuide": "사이트 안내"
  ,"home.siteGuideTitle": "계산 도구와 해설 콘텐츠를 함께 제공합니다."
  ,"home.checkSources": "법률·세무·금융 참고 사이트 보기"
  ,"home.processFind": "계산기 찾기"
  ,"home.processCalculate": "바로 계산"
  ,"home.processReview": "근거까지 검토"
  ,"home.processFindText": "검색어, 분야, 그룹 기준으로 필요한 계산기를 먼저 좁힙니다."
  ,"home.processCalculateText": "급여, 금리, 기간, 세율 같은 실제 입력값으로 바로 결과를 확인합니다."
  ,"home.processReviewText": "FAQ, 기준 설명, 관련 계산기까지 이어서 보고 판단 정확도를 높입니다."
  ,"home.reference": "참고"
  ,"home.policy": "운영 원칙"
  ,"home.privacy": "개인정보처리방침"
  ,"home.terms": "이용약관"
  ,"home.contact": "문의"
  ,"home.metricMinimumWage": "2026 최저시급"
  ,"home.metricMonthlyWage": "월 환산액 209시간"
  ,"home.metricHealthInsurance": "건강보험료율"
  ,"home.siteFeature1Title": "고유 콘텐츠"
  ,"home.siteFeature1Text": "각 계산기마다 입력 기준, 결과 해석, FAQ, 관련 계산기를 함께 제공합니다."
  ,"home.siteFeature2Title": "명확한 탐색"
  ,"home.siteFeature2Text": "상단 메뉴, 계산기 디렉토리, 그룹 필터, 사이트맵으로 주요 페이지를 찾을 수 있습니다."
  ,"home.siteFeature3Title": "정책 공개"
  ,"home.siteFeature3Text": "소개, 운영 원칙, 개인정보처리방침, 이용약관, 문의 페이지를 공개합니다."
  ,"home.siteFeature4Title": "지속 갱신"
  ,"home.siteFeature4Text": "제도 변경과 사용자 제보를 반영해 계산식과 설명을 점검합니다."
  ,"home.trustDescription": "계산 결과는 참고용 추정치이지만, 반영 기준은 공식 기관 고시와 제도 안내를 바탕으로 관리합니다."
  ,"home.trust1": "최저임금, 고용보험, 국민연금, 건강보험 등 공식 기준 반영"
  ,"home.trust2": "계산 결과와 함께 제도 설명·주의 포인트 동시 제공"
  ,"home.trust3": "검색·필터·정렬 구조로 계산기 탐색 효율 강화"
  ,"home.trust4": "노무·금융·절세·건강·일상·생활·사업 계산기를 한 브랜드 안에 통합"
  ,"hub.calculators": "계산기 전체 보기"
  ,"hub.relatedBlog": "관련 글 보기"
  ,"hub.featured": "추천 계산기"
  ,"hub.featuredTitle": "먼저 확인하면 좋은 도구"
  ,"hub.allCount": "개 전체 보기"
  ,"hub.checklist": "점검 체크리스트"
  ,"hub.checklistTitle": "계산 전 확인할 것"
  ,"hub.related": "관련 해설"
  ,"hub.relatedTitle": "계산 결과를 이해하는 글"
  ,"hub.blogAll": "블로그 전체 보기"
  ,"blog.contentHub": "콘텐츠 허브"
  ,"blog.title": "블로그"
  ,"blog.description": "계산 결과를 이해하는 데 필요한 제도 설명, 비교 글, 운영 업데이트를 모아둔 공간입니다."
  ,"blog.loading": "콘텐츠를 불러오는 중입니다."
  ,"blog.readTime": "읽는 시간"
  ,"blog.back": "← 블로그 목록"
  ,"blog.previous": "이전 글 보기"
  ,"blog.next": "다음 글 보기"
  ,"blog.related": "관련 글"
  ,"blog.relatedTitle": "함께 보면 좋은 가이드"
  ,"blog.all": "블로그 전체 보기"
  ,"recent.used": "최근 사용"
  ,"recent.continue": "이어서 계산할 수 있습니다."
  ,"recent.clear": "기록 지우기"
  ,"recent.calculate": "이어서 계산하기"
  ,"content.loading": "콘텐츠를 불러오는 중입니다."
  ,"content.blogEmpty": "아직 등록된 블로그 글이 없습니다."
  ,"content.communityEmpty": "아직 등록된 커뮤니티 글이 없습니다."
  ,"content.all": "전체"
  ,"content.qna": "질문답변"
  ,"content.case": "사례공유"
  ,"content.notice": "공지"
  ,"content.latest": "최신순"
  ,"content.popular": "인기순"
  ,"content.comments": "댓글"
  ,"content.likes": "좋아요"
  ,"content.views": "조회"
  ,"content.previous": "이전"
  ,"content.next": "다음"
  ,"community.eyebrow": "사용자 공간"
  ,"community.title": "커뮤니티"
  ,"community.description": "계산기 사용 중 생기는 질문, 실제 사례, 운영 공지를 모아두는 게시판형 공간입니다. 사용자 생성 콘텐츠는 운영 기준에 따라 검토합니다."
  ,"contact.eyebrow": "운영 문의"
  ,"contact.title": "문의 게시판"
  ,"contact.description": "계산 기준 오류, 기능 요청, 제휴 문의, 개인정보 처리 관련 문의를 남길 수 있습니다. 접수된 내용을 확인해 계산식, 설명 문구, 출처 링크를 지속적으로 보완합니다."
  ,"contact.errorReport": "오류 제보"
  ,"contact.errorReportText": "계산 결과가 실제 기준과 다르거나 출처가 오래된 경우 알려주세요."
  ,"contact.featureRequest": "기능 요청"
  ,"contact.featureRequestText": "필요한 계산기, 입력 항목, 비교 방식이 있으면 제안할 수 있습니다."
  ,"contact.operation": "운영 문의"
  ,"contact.operationText": "광고, 개인정보, 제휴, 게시물 처리와 관련한 문의를 접수합니다."
  ,"contact.board": "문의 게시판"
  ,"contact.register": "문의 등록"
  ,"contact.registerTitle": "게시판에 바로 남기기"
  ,"contact.registerDescription": "계산 기준 오류, 기능 요청, 제휴 문의를 게시판 형태로 등록할 수 있습니다."
  ,"contact.name": "이름"
  ,"contact.subject": "문의 제목"
  ,"contact.bodyPlaceholder": "문의 내용을 입력하세요."
  ,"contact.visibility": "등록한 문의는 같은 브라우저의 작성자와 관리자만 볼 수 있습니다."
  ,"contact.submit": "문의 등록"
  ,"contact.submitting": "등록 중..."
  ,"contact.listLoading": "문의 목록을 불러오는 중입니다."
  ,"contact.empty": "아직 등록된 문의가 없습니다."
  ,"contact.connectionError": "문의 게시판 연결이 없어 기본 목록만 표시합니다."
  ,"contact.required": "이름, 제목, 문의 내용을 모두 입력하세요."
  ,"contact.success": "문의가 등록되었습니다."
  ,"contact.failure": "문의 등록에 실패했습니다."
  ,"detail.blog": "블로그"
  ,"detail.community": "커뮤니티"
  ,"detail.inquiry": "문의"
  ,"detail.list": "목록"
  ,"detail.loading": "콘텐츠를 불러오는 중입니다."
  ,"detail.noSlug": "slug 파라미터가 없습니다."
  ,"detail.forbidden": "이 문의는 등록한 브라우저 또는 관리자만 볼 수 있습니다."
  ,"detail.notFound": "콘텐츠를 찾을 수 없습니다."
  ,"detail.comments": "댓글"
  ,"detail.likes": "좋아요"
  ,"detail.views": "조회"
  ,"detail.processing": "처리 중..."
  ,"detail.cancelLike": "좋아요 취소"
  ,"detail.viewComments": "댓글 보기"
  ,"detail.writeComment": "댓글 쓰기"
  ,"detail.relatedCalculators": "연결 계산기"
  ,"detail.commentGuidance": "초기 운영 단계라 승인 후 노출 방식으로 처리합니다."
  ,"detail.commentName": "이름"
  ,"detail.commentPlaceholder": "댓글 내용을 입력하세요."
  ,"detail.commentPrivacy": "이름과 댓글 내용만 저장합니다."
  ,"detail.register": "댓글 등록"
  ,"detail.submitting": "등록 중..."
  ,"detail.commentLoading": "댓글을 불러오는 중입니다."
  ,"detail.commentApiError": "댓글 API 연결 전이라 목록을 표시하지 못했습니다."
  ,"detail.commentEmpty": "아직 승인된 댓글이 없습니다."
  ,"detail.commentRequired": "이름과 댓글 내용을 입력하세요."
  ,"detail.commentSuccess": "댓글이 접수되었습니다. 승인 후 노출됩니다."
  ,"detail.commentFailure": "댓글 등록에 실패했습니다."
  ,"detail.likeFailure": "좋아요 처리에 실패했습니다."
  ,"detail.inquiryPrivate": "이 문의는 등록한 브라우저 또는 관리자만 볼 수 있습니다."
  ,"detail.inquiryBadge": "문의"
  ,"ads.top": "추천 광고"
  ,"ads.calculator": "계산 결과 아래 광고"
  ,"ads.inArticle": "본문 중간 광고"
  ,"ads.bottom": "관련 콘텐츠 광고"
  ,"visitor.loading": "방문 통계를 불러오는 중입니다."
  ,"visitor.live": "실시간 방문자"
  ,"visitor.current": "현재 {count}명"
  ,"visitor.today": "오늘 {count}명"
  ,"visitor.total": "누적 {count}명"
  ,"visitor.window": "최근 {minutes}분 내 활동 기준으로 집계합니다."
} as const;

const en: Record<keyof typeof ko, string> = {
  "nav.calculators": "Calculators",
  "nav.tax": "Tax",
  "nav.stock": "Stocks",
  "nav.health": "Health",
  "nav.daily": "Daily",
  "nav.game": "Games",
  "nav.saju": "Saju",
  "nav.blog": "Blog",
  "language.label": "Language",
  "search.label": "Search",
  "search.placeholder": "Search calculators",
  "search.submit": "Go",
  "menu.open": "Open menu",
  "menu.close": "Close menu",
  "footer.brand": "CalcRule",
  "footer.description":
    "A calculator directory for labor, finance, tax, health, everyday tools, and life planning. Results are estimates for reference, so legal, tax, or financial decisions should be checked with the relevant institution or a professional.",
  "footer.contact": "Contact: Please use the site contact board.",
  "footer.info": "Site Info",
  "footer.about": "About",
  "footer.blog": "Blog",
  "footer.resources": "Resources",
  "footer.policy": "Editorial Policy",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.contactLink": "Contact",
  "footer.sitemap": "Sitemap",
  "calculator.inputEyebrow": "Inputs",
  "calculator.inputTitle": "Enter your conditions",
  "calculator.autoCalculate": "Auto calculate",
  "calculator.resetDefaults": "Reset defaults",
  "calculator.calculationDate": "Calculation date",
  "calculator.birthDate": "Birth date",
  "calculator.solar": "Solar",
  "calculator.lunar": "Lunar",
  "calculator.leap": "Leap month",
  "calculator.commonMonth": "Common month",
  "calculator.dateBasis": "Date basis",
  "calculator.birthDateBasis": "Birth date basis",
  "calculator.lunarType": "Lunar type",
  "calculator.birthTime": "Birth time",
  "calculator.timeUnknown": "Unknown time",
  "calculator.dateHelp": "Choose the date once and the sunrise/sunset result updates immediately.",
  "calculator.birthDateHelp": "Choose the {basis} birth date once and the result updates immediately.",
  "calculator.slider": "{label} slider",
  "calculator.inputSummary": "Input summary",
  "calculator.autoSaved": "Your last inputs are saved on this device.",
  "calculator.viewResult": "View result",
  "calculator.resultEyebrow": "Result",
  "calculator.tarotTitle": "Tarot cards",
  "calculator.tarotDescription": "View the calculated Major Arcana combination as cards.",
  "calculator.tarotCount": "{count} cards",
  "calculator.tarotPersonality": "Personality card",
  "calculator.tarotSoul": "Soul card",
  "calculator.tarotBridge": "Bridge card",
  "calculator.chartTitle": "Comparison chart",
  "calculator.chartDescription": "Compare the key numbers at a glance.",
  "calculator.checkpointsTitle": "Interpretation points",
  "calculator.nextActionEyebrow": "Next action",
  "calculator.nextActionTitle": "What to do next with this result",
  "calculator.customRecommendation": "Recommended",
  "calculator.preConsultation": "Before consultation",
  "calculator.saveResult": "Save result",
  "calculator.relatedTitle": "Calculators to try next",
  "calculator.disclaimer":
    "Results are estimates based on your inputs and currently reflected standards. Actual review, payment, or loan approval outcomes may differ by institution.",
  "directory.eyebrow": "Calculator Directory",
  "directory.compactTitle": "Find the calculator you need quickly.",
  "directory.title": "Browse all calculators by category.",
  "directory.description": "Narrow calculators by keyword, field, and group, then open the right one directly.",
  "directory.viewAll": "View all calculators ↗",
  "directory.searchPlaceholder": "e.g. unemployment pay, acquisition tax, exchange rate, VAT",
  "directory.openFilter": "Open filters",
  "directory.sort": "Sort",
  "directory.default": "Default",
  "directory.all": "All",
  "directory.allCategory": "All fields",
  "directory.allGroup": "All groups",
  "directory.recommended": "Recommended",
  "directory.name": "Name",
  "directory.group": "Group",
  "directory.reset": "Reset filters",
  "directory.featured": "Featured calculators",
  "directory.recent": "Recently added",
  "directory.more": "View more calculators",
  "directory.filter": "Filters",
  "directory.filterDescription": "Adjust field, group, and sorting.",
  "directory.close": "Close",
  "directory.clear": "Reset",
  "directory.apply": "Apply",
  "directory.calculate": "Calculate",
  "directory.countCalculators": " calculators"
  ,"home.directoryEyebrow": "Quick access"
  ,"home.indicatorEyebrow": "Today's indicators"
  ,"home.indicatorTitle": "Check key exchange rates and gold prices at a glance."
  ,"home.indicatorDescription": "Open the daily indicators from Quick Life Tools here, then continue to the source page for the latest values."
  ,"home.indicatorCta": "View today's indicators ↗"
  ,"home.indicatorRate": "Key exchange rates"
  ,"home.indicatorRateText": "Check today's rates"
  ,"home.indicatorGold": "Gold prices"
  ,"home.indicatorGoldText": "Check today's gold price"
  ,"home.indicatorLive": "Live updates"
  ,"home.indicatorLiveText": "Latest values on Quick Life Tools"
  ,"home.indicatorDelayed": "Update delayed"
  ,"home.indicatorLoading": "Loading..."
  ,"home.indicatorUnavailable": "Unavailable"
  ,"home.indicatorSource": "Rates: ExchangeRate-API · Gold: gold-api.com · Values are for reference."
  ,"home.directoryTitle": "Jump to calculators by field"
  ,"home.viewAll": "View all ↗"
  ,"home.shareEyebrow": "Calculators worth sharing"
  ,"home.shareTitle": "Save your result as a card and share it instantly."
  ,"home.resultCard": "Result card"
  ,"home.shareExample": "Share example"
  ,"home.guideEyebrow": "Guides by topic"
  ,"home.guideTitle": "Calculators and explanations, organized by field."
  ,"home.popular": "Popular calculators"
  ,"home.recent": "Recently added"
  ,"home.flowEyebrow": "How it works"
  ,"home.flowTitle": "Move from a calculation to the standards behind it."
  ,"home.findCalculator": "Find a calculator"
  ,"home.allCalculators": "View all calculators"
  ,"home.viewResources": "View reference sites"
  ,"home.live": "LIVE"
  ,"home.basedOn": "Standards year"
  ,"home.heroBadge": "{count} calculators and math tools based on {year} standards"
  ,"home.calculatorCount": "Active calculators"
  ,"home.groupCount": "Calculator groups"
  ,"home.standardYear": "Standards year"
  ,"home.trustEyebrow": "Trust standards"
  ,"home.trustTitle": "Built around official standards."
  ,"home.blogEyebrow": "Blog"
  ,"home.blogTitle": "Explanations connected to calculations"
  ,"home.siteGuide": "About the site"
  ,"home.siteGuideTitle": "Calculators and explanatory content in one place."
  ,"home.checkSources": "View legal, tax, and finance references"
  ,"home.processFind": "Find a calculator"
  ,"home.processCalculate": "Calculate"
  ,"home.processReview": "Review the basis"
  ,"home.processFindText": "Narrow down the right calculator by keyword, field, and group."
  ,"home.processCalculateText": "Enter real values such as pay, rates, periods, and tax rates."
  ,"home.processReviewText": "Review FAQs, standards, and related calculators before deciding."
  ,"home.reference": "About"
  ,"home.policy": "Editorial policy"
  ,"home.privacy": "Privacy"
  ,"home.terms": "Terms"
  ,"home.contact": "Contact"
  ,"home.metricMinimumWage": "2026 minimum wage"
  ,"home.metricMonthlyWage": "Monthly equivalent, 209 hours"
  ,"home.metricHealthInsurance": "Health insurance rate"
  ,"home.siteFeature1Title": "Original content"
  ,"home.siteFeature1Text": "Every calculator includes input standards, result interpretation, FAQs, and related tools."
  ,"home.siteFeature2Title": "Clear navigation"
  ,"home.siteFeature2Text": "Use the top menu, calculator directory, group filters, and sitemap to find pages quickly."
  ,"home.siteFeature3Title": "Open policies"
  ,"home.siteFeature3Text": "About, editorial policy, privacy, terms, and contact information are publicly available."
  ,"home.siteFeature4Title": "Continuous updates"
  ,"home.siteFeature4Text": "We review formulas and explanations as standards change and users report issues."
  ,"home.trustDescription": "Results are estimates for reference, while the standards we apply are maintained from official notices and institutional guidance."
  ,"home.trust1": "Official standards for minimum wage, employment insurance, national pension, and health insurance"
  ,"home.trust2": "Explanations and caution points alongside every result"
  ,"home.trust3": "Search, filter, and sort tools for faster discovery"
  ,"home.trust4": "Labor, finance, tax, health, daily, life, and business calculators in one service"
  ,"hub.calculators": "View all calculators"
  ,"hub.relatedBlog": "Related articles"
  ,"hub.featured": "Featured calculators"
  ,"hub.featuredTitle": "Tools to check first"
  ,"hub.allCount": " calculators"
  ,"hub.checklist": "Checklist"
  ,"hub.checklistTitle": "Check before calculating"
  ,"hub.related": "Related explanations"
  ,"hub.relatedTitle": "Articles that explain the result"
  ,"hub.blogAll": "View all blog posts"
  ,"blog.contentHub": "Content hub"
  ,"blog.title": "Blog"
  ,"blog.description": "Guides, comparisons, and updates that help you understand calculator results."
  ,"blog.loading": "Loading content..."
  ,"blog.readTime": "Read"
  ,"blog.back": "← Back to blog"
  ,"blog.previous": "Previous article"
  ,"blog.next": "Next article"
  ,"blog.related": "Related articles"
  ,"blog.relatedTitle": "Guides you may also like"
  ,"blog.all": "View all blog posts"
  ,"recent.used": "Recently used"
  ,"recent.continue": "Continue where you left off."
  ,"recent.clear": "Clear history"
  ,"recent.calculate": "Continue calculating"
  ,"content.loading": "Loading content..."
  ,"content.blogEmpty": "No blog posts have been published yet."
  ,"content.communityEmpty": "No community posts have been published yet."
  ,"content.all": "All"
  ,"content.qna": "Q&A"
  ,"content.case": "Case studies"
  ,"content.notice": "Notice"
  ,"content.latest": "Latest"
  ,"content.popular": "Popular"
  ,"content.comments": "Comments"
  ,"content.likes": "Likes"
  ,"content.views": "Views"
  ,"content.previous": "Previous"
  ,"content.next": "Next"
  ,"community.eyebrow": "Community"
  ,"community.title": "Community"
  ,"community.description": "A board for calculator questions, real-world cases, and site notices. User-generated content is reviewed under our operating guidelines."
  ,"contact.eyebrow": "Contact the team"
  ,"contact.title": "Contact board"
  ,"contact.description": "Send reports about calculation standards, feature requests, partnerships, or privacy. We use submissions to improve formulas, explanations, and source links."
  ,"contact.errorReport": "Report an issue"
  ,"contact.errorReportText": "Tell us when a result differs from the current standard or a source needs updating."
  ,"contact.featureRequest": "Feature request"
  ,"contact.featureRequestText": "Suggest a calculator, input field, or comparison method you need."
  ,"contact.operation": "Operations"
  ,"contact.operationText": "Contact us about ads, privacy, partnerships, or content handling."
  ,"contact.board": "Contact board"
  ,"contact.register": "Send a message"
  ,"contact.registerTitle": "Post directly to the board"
  ,"contact.registerDescription": "Submit a standards report, feature request, or partnership inquiry as a board post."
  ,"contact.name": "Name"
  ,"contact.subject": "Subject"
  ,"contact.bodyPlaceholder": "Write your message."
  ,"contact.visibility": "Submitted inquiries are visible only to the author in this browser and site administrators."
  ,"contact.submit": "Submit inquiry"
  ,"contact.submitting": "Submitting..."
  ,"contact.listLoading": "Loading inquiries..."
  ,"contact.empty": "No inquiries have been posted yet."
  ,"contact.connectionError": "The inquiry board is unavailable, so the default list is shown."
  ,"contact.required": "Please enter your name, subject, and message."
  ,"contact.success": "Your inquiry was submitted."
  ,"contact.failure": "The inquiry could not be submitted."
  ,"detail.blog": "Blog"
  ,"detail.community": "Community"
  ,"detail.inquiry": "Inquiry"
  ,"detail.list": "List"
  ,"detail.loading": "Loading content..."
  ,"detail.noSlug": "The slug parameter is missing."
  ,"detail.forbidden": "This inquiry is visible only to the submitting browser or site administrators."
  ,"detail.notFound": "Content not found."
  ,"detail.comments": "Comments"
  ,"detail.likes": "Likes"
  ,"detail.views": "Views"
  ,"detail.processing": "Processing..."
  ,"detail.cancelLike": "Unlike"
  ,"detail.viewComments": "View comments"
  ,"detail.writeComment": "Write a comment"
  ,"detail.relatedCalculators": "Related calculators"
  ,"detail.commentGuidance": "Comments are shown after approval during the initial operating period."
  ,"detail.commentName": "Name"
  ,"detail.commentPlaceholder": "Write your comment."
  ,"detail.commentPrivacy": "Only your name and comment are stored."
  ,"detail.register": "Post comment"
  ,"detail.submitting": "Submitting..."
  ,"detail.commentLoading": "Loading comments..."
  ,"detail.commentApiError": "Comments are unavailable until the comment API is connected."
  ,"detail.commentEmpty": "No approved comments yet."
  ,"detail.commentRequired": "Please enter your name and comment."
  ,"detail.commentSuccess": "Your comment was received and will appear after approval."
  ,"detail.commentFailure": "The comment could not be posted."
  ,"detail.likeFailure": "The like action failed."
  ,"detail.inquiryPrivate": "This inquiry is visible only to the submitting browser or site administrators."
  ,"detail.inquiryBadge": "Inquiry"
  ,"ads.top": "Recommended ad"
  ,"ads.calculator": "Ad below the result"
  ,"ads.inArticle": "In-article ad"
  ,"ads.bottom": "Related content ad"
  ,"visitor.loading": "Loading visitor stats..."
  ,"visitor.live": "Live visitors"
  ,"visitor.current": "{count} now"
  ,"visitor.today": "{count} today"
  ,"visitor.total": "{count} total"
  ,"visitor.window": "Based on activity in the last {minutes} minutes."
};

const ja: Record<keyof typeof ko, string> = {
  "nav.calculators": "計算機",
  "nav.tax": "税金",
  "nav.stock": "株式",
  "nav.health": "健康",
  "nav.daily": "日常",
  "nav.game": "ゲーム",
  "nav.saju": "四柱推命",
  "nav.blog": "ブログ",
  "language.label": "言語",
  "search.label": "検索",
  "search.placeholder": "計算機を検索",
  "search.submit": "移動",
  "menu.open": "メニューを開く",
  "menu.close": "メニューを閉じる",
  "footer.brand": "計算の定石",
  "footer.description":
    "労務、金融、税金、健康、日常ツール、生活計算をすばやく比較し、基準と解説も確認できる計算機ディレクトリです。計算結果は参考用の推定値であり、法律・税務・金融判断は関係機関または専門家にご確認ください。",
  "footer.contact": "お問い合わせ: サイトのお問い合わせページから受け付けています。",
  "footer.info": "サイト情報",
  "footer.about": "紹介",
  "footer.blog": "ブログ",
  "footer.resources": "参考リンク",
  "footer.policy": "運営方針",
  "footer.privacy": "プライバシー",
  "footer.terms": "利用規約",
  "footer.contactLink": "お問い合わせ",
  "footer.sitemap": "サイトマップ",
  "calculator.inputEyebrow": "入力値",
  "calculator.inputTitle": "条件を入力してください",
  "calculator.autoCalculate": "自動計算",
  "calculator.resetDefaults": "初期値に戻す",
  "calculator.calculationDate": "計算日",
  "calculator.birthDate": "生年月日",
  "calculator.solar": "新暦",
  "calculator.lunar": "旧暦",
  "calculator.leap": "閏月",
  "calculator.commonMonth": "平月",
  "calculator.dateBasis": "日付基準",
  "calculator.birthDateBasis": "生年月日基準",
  "calculator.lunarType": "旧暦区分",
  "calculator.birthTime": "出生時刻",
  "calculator.timeUnknown": "時刻不明",
  "calculator.dateHelp": "日付を一度選ぶと、日の出・日の入りの結果がすぐ再計算されます。",
  "calculator.birthDateHelp": "{basis}の生年月日を一度選ぶと、結果がすぐ再計算されます。",
  "calculator.slider": "{label} スライダー",
  "calculator.inputSummary": "入力概要",
  "calculator.autoSaved": "最後の入力値はこの端末に自動保存されます。",
  "calculator.viewResult": "結果を見る",
  "calculator.resultEyebrow": "計算結果",
  "calculator.tarotTitle": "タロットカード",
  "calculator.tarotDescription": "算出された大アルカナの組み合わせをカードで確認します。",
  "calculator.tarotCount": "{count}枚の組み合わせ",
  "calculator.tarotPersonality": "性格カード",
  "calculator.tarotSoul": "魂カード",
  "calculator.tarotBridge": "連結カード",
  "calculator.chartTitle": "比較チャート",
  "calculator.chartDescription": "主要な数値を一目で比較します。",
  "calculator.checkpointsTitle": "解釈ポイント",
  "calculator.nextActionEyebrow": "次のアクション",
  "calculator.nextActionTitle": "計算結果から次に行うこと",
  "calculator.customRecommendation": "おすすめ",
  "calculator.preConsultation": "相談前の整理",
  "calculator.saveResult": "結果を保存",
  "calculator.relatedTitle": "続けて見る計算機",
  "calculator.disclaimer":
    "計算結果は入力値と現在反映されている基準による推定値です。実際の審査・支給・融資承認結果は機関の判断により異なる場合があります。",
  "directory.eyebrow": "計算機ディレクトリ",
  "directory.compactTitle": "必要な計算機をすばやく探せます。",
  "directory.title": "すべての計算機をカテゴリ別に探せます。",
  "directory.description": "キーワード、分野、グループで絞り込み、目的の計算機へ直接移動できます。",
  "directory.viewAll": "すべての計算機を見る ↗",
  "directory.searchPlaceholder": "例: 失業給付、取得税、為替、付加価値税",
  "directory.openFilter": "フィルターを開く",
  "directory.sort": "並び替え",
  "directory.default": "基本",
  "directory.all": "すべて",
  "directory.allCategory": "すべての分野",
  "directory.allGroup": "すべてのグループ",
  "directory.recommended": "おすすめ順",
  "directory.name": "名前順",
  "directory.group": "グループ順",
  "directory.reset": "フィルターをリセット",
  "directory.featured": "おすすめ計算機",
  "directory.recent": "最近追加された計算機",
  "directory.more": "さらに計算機を見る",
  "directory.filter": "フィルター",
  "directory.filterDescription": "分野、グループ、並び替え基準を調整します。",
  "directory.close": "閉じる",
  "directory.clear": "リセット",
  "directory.apply": "適用",
  "directory.calculate": "計算する",
  "directory.countCalculators": "件"
  ,"home.directoryEyebrow": "クイックアクセス"
  ,"home.indicatorEyebrow": "今日の指標"
  ,"home.indicatorTitle": "主要な為替レートと金相場を一目で確認できます。"
  ,"home.indicatorDescription": "빠른생활도구が提供する今日の指標をメイン画面から確認し、最新の数値は元のページで続けて確認できます。"
  ,"home.indicatorCta": "今日の指標を見る ↗"
  ,"home.indicatorRate": "主要為替レート"
  ,"home.indicatorRateText": "今日のレートを確認"
  ,"home.indicatorGold": "金相場"
  ,"home.indicatorGoldText": "今日の金価格を確認"
  ,"home.indicatorLive": "リアルタイム更新"
  ,"home.indicatorLiveText": "最新値は빠른생활도구で提供"
  ,"home.indicatorDelayed": "更新遅延"
  ,"home.indicatorLoading": "読み込み中..."
  ,"home.indicatorUnavailable": "確認できません"
  ,"home.indicatorSource": "為替: ExchangeRate-API · 金: gold-api.com · 数値は参考値です。"
  ,"home.directoryTitle": "分野別に計算機を見る"
  ,"home.viewAll": "すべて見る ↗"
  ,"home.shareEyebrow": "共有しやすい計算機"
  ,"home.shareTitle": "結果をカードに保存してすぐ共有できます。"
  ,"home.resultCard": "結果カード"
  ,"home.shareExample": "共有例"
  ,"home.guideEyebrow": "テーマ別ガイド"
  ,"home.guideTitle": "計算機と解説を分野別にまとめました。"
  ,"home.popular": "よく使われる計算機"
  ,"home.recent": "新しく追加された計算機"
  ,"home.flowEyebrow": "利用の流れ"
  ,"home.flowTitle": "計算から基準の確認まで一つの流れで進めます。"
  ,"home.findCalculator": "計算機を探す"
  ,"home.allCalculators": "すべての計算機を見る"
  ,"home.viewResources": "参考サイトを見る"
  ,"home.live": "LIVE"
  ,"home.basedOn": "基準年"
  ,"home.heroBadge": "{year}年基準 {count}件の計算機・数学ツール"
  ,"home.calculatorCount": "運営中の計算機"
  ,"home.groupCount": "計算機グループ"
  ,"home.standardYear": "反映基準年"
  ,"home.trustEyebrow": "信頼基準"
  ,"home.trustTitle": "公式基準をもとに構成しています。"
  ,"home.blogEyebrow": "ブログ"
  ,"home.blogTitle": "計算につながる解説コンテンツ"
  ,"home.siteGuide": "サイト案内"
  ,"home.siteGuideTitle": "計算ツールと解説コンテンツを提供します。"
  ,"home.checkSources": "法律・税務・金融の参考サイトを見る"
  ,"home.processFind": "計算機を探す"
  ,"home.processCalculate": "すぐ計算する"
  ,"home.processReview": "根拠まで確認"
  ,"home.processFindText": "キーワード、分野、グループで必要な計算機を絞ります。"
  ,"home.processCalculateText": "給与、金利、期間、税率など実際の入力値で結果を確認します。"
  ,"home.processReviewText": "FAQ、基準説明、関連計算機まで確認して判断の精度を高めます。"
  ,"home.reference": "紹介"
  ,"home.policy": "運営方針"
  ,"home.privacy": "プライバシー"
  ,"home.terms": "利用規約"
  ,"home.contact": "お問い合わせ"
  ,"home.metricMinimumWage": "2026年最低賃金"
  ,"home.metricMonthlyWage": "月換算額 209時間"
  ,"home.metricHealthInsurance": "健康保険料率"
  ,"home.siteFeature1Title": "独自コンテンツ"
  ,"home.siteFeature1Text": "各計算機に入力基準、結果の解釈、FAQ、関連計算機を用意しています。"
  ,"home.siteFeature2Title": "明確なナビゲーション"
  ,"home.siteFeature2Text": "上部メニュー、計算機ディレクトリ、グループフィルター、サイトマップから探せます。"
  ,"home.siteFeature3Title": "公開された方針"
  ,"home.siteFeature3Text": "紹介、運営方針、プライバシー、利用規約、お問い合わせを公開しています。"
  ,"home.siteFeature4Title": "継続的な更新"
  ,"home.siteFeature4Text": "制度変更やユーザーからの報告を反映して、計算式と説明を見直します。"
  ,"home.trustDescription": "結果は参考用の推定値ですが、適用する基準は公的機関の告示と制度案内をもとに管理しています。"
  ,"home.trust1": "最低賃金、雇用保険、国民年金、健康保険など公式基準を反映"
  ,"home.trust2": "結果とともに制度説明・注意点を表示"
  ,"home.trust3": "検索・フィルター・並び替えで計算機を探しやすく構成"
  ,"home.trust4": "労務・金融・節税・健康・日常・生活・事業計算機を一つに統合"
  ,"hub.calculators": "すべての計算機を見る"
  ,"hub.relatedBlog": "関連記事を見る"
  ,"hub.featured": "おすすめ計算機"
  ,"hub.featuredTitle": "先に確認したいツール"
  ,"hub.allCount": "件すべて見る"
  ,"hub.checklist": "チェックリスト"
  ,"hub.checklistTitle": "計算前に確認すること"
  ,"hub.related": "関連解説"
  ,"hub.relatedTitle": "計算結果を理解する記事"
  ,"hub.blogAll": "ブログをすべて見る"
  ,"blog.contentHub": "コンテンツハブ"
  ,"blog.title": "ブログ"
  ,"blog.description": "計算結果を理解するための制度解説、比較記事、運営アップデートをまとめています。"
  ,"blog.loading": "コンテンツを読み込んでいます..."
  ,"blog.readTime": "読了"
  ,"blog.back": "← ブログ一覧"
  ,"blog.previous": "前の記事"
  ,"blog.next": "次の記事"
  ,"blog.related": "関連記事"
  ,"blog.relatedTitle": "一緒に読みたいガイド"
  ,"blog.all": "ブログをすべて見る"
  ,"recent.used": "最近使った計算機"
  ,"recent.continue": "続きから計算できます。"
  ,"recent.clear": "履歴を消去"
  ,"recent.calculate": "続けて計算する"
  ,"content.loading": "コンテンツを読み込んでいます..."
  ,"content.blogEmpty": "まだブログ記事がありません。"
  ,"content.communityEmpty": "まだコミュニティ投稿がありません。"
  ,"content.all": "すべて"
  ,"content.qna": "質問と回答"
  ,"content.case": "事例共有"
  ,"content.notice": "お知らせ"
  ,"content.latest": "新着順"
  ,"content.popular": "人気順"
  ,"content.comments": "コメント"
  ,"content.likes": "いいね"
  ,"content.views": "閲覧"
  ,"content.previous": "前へ"
  ,"content.next": "次へ"
  ,"community.eyebrow": "ユーザースペース"
  ,"community.title": "コミュニティ"
  ,"community.description": "計算機に関する質問、実際の事例、運営のお知らせをまとめた掲示板です。ユーザー投稿は運営方針に沿って確認します。"
  ,"contact.eyebrow": "運営へのお問い合わせ"
  ,"contact.title": "お問い合わせ掲示板"
  ,"contact.description": "計算基準の誤り、機能リクエスト、提携、個人情報の取り扱いについてお問い合わせください。計算式、説明、出典リンクの改善に活用します。"
  ,"contact.errorReport": "不具合の報告"
  ,"contact.errorReportText": "結果が現在の基準と異なる場合や、出典が古い場合はお知らせください。"
  ,"contact.featureRequest": "機能リクエスト"
  ,"contact.featureRequestText": "必要な計算機、入力項目、比較方法を提案できます。"
  ,"contact.operation": "運営へのお問い合わせ"
  ,"contact.operationText": "広告、個人情報、提携、投稿の取り扱いについてお問い合わせください。"
  ,"contact.board": "お問い合わせ掲示板"
  ,"contact.register": "お問い合わせを登録"
  ,"contact.registerTitle": "掲示板に投稿する"
  ,"contact.registerDescription": "計算基準の報告、機能リクエスト、提携のお問い合わせを掲示板に登録できます。"
  ,"contact.name": "お名前"
  ,"contact.subject": "件名"
  ,"contact.bodyPlaceholder": "お問い合わせ内容を入力してください。"
  ,"contact.visibility": "登録したお問い合わせは、このブラウザの投稿者と管理者だけが確認できます。"
  ,"contact.submit": "お問い合わせを登録"
  ,"contact.submitting": "登録中..."
  ,"contact.listLoading": "お問い合わせ一覧を読み込んでいます..."
  ,"contact.empty": "まだお問い合わせがありません。"
  ,"contact.connectionError": "お問い合わせ掲示板に接続できないため、初期一覧を表示しています。"
  ,"contact.required": "名前、件名、お問い合わせ内容を入力してください。"
  ,"contact.success": "お問い合わせを登録しました。"
  ,"contact.failure": "お問い合わせの登録に失敗しました。"
  ,"detail.blog": "ブログ"
  ,"detail.community": "コミュニティ"
  ,"detail.inquiry": "お問い合わせ"
  ,"detail.list": "一覧"
  ,"detail.loading": "コンテンツを読み込んでいます..."
  ,"detail.noSlug": "slugパラメータがありません。"
  ,"detail.forbidden": "このお問い合わせは投稿したブラウザまたは管理者だけが確認できます。"
  ,"detail.notFound": "コンテンツが見つかりません。"
  ,"detail.comments": "コメント"
  ,"detail.likes": "いいね"
  ,"detail.views": "閲覧"
  ,"detail.processing": "処理中..."
  ,"detail.cancelLike": "いいねを取り消す"
  ,"detail.viewComments": "コメントを見る"
  ,"detail.writeComment": "コメントを書く"
  ,"detail.relatedCalculators": "関連計算機"
  ,"detail.commentGuidance": "初期運営期間中は、承認後にコメントを表示します。"
  ,"detail.commentName": "お名前"
  ,"detail.commentPlaceholder": "コメントを入力してください。"
  ,"detail.commentPrivacy": "名前とコメント内容だけを保存します。"
  ,"detail.register": "コメントを登録"
  ,"detail.submitting": "登録中..."
  ,"detail.commentLoading": "コメントを読み込んでいます..."
  ,"detail.commentApiError": "コメントAPI接続前のため、一覧を表示できません。"
  ,"detail.commentEmpty": "承認されたコメントはまだありません。"
  ,"detail.commentRequired": "名前とコメント内容を入力してください。"
  ,"detail.commentSuccess": "コメントを受け付けました。承認後に表示されます。"
  ,"detail.commentFailure": "コメントの登録に失敗しました。"
  ,"detail.likeFailure": "いいねの処理に失敗しました。"
  ,"detail.inquiryPrivate": "このお問い合わせは投稿したブラウザまたは管理者だけが確認できます。"
  ,"detail.inquiryBadge": "お問い合わせ"
  ,"ads.top": "おすすめ広告"
  ,"ads.calculator": "計算結果の下の広告"
  ,"ads.inArticle": "記事内広告"
  ,"ads.bottom": "関連記事広告"
  ,"visitor.loading": "訪問統計を読み込んでいます..."
  ,"visitor.live": "リアルタイム訪問者"
  ,"visitor.current": "現在 {count}人"
  ,"visitor.today": "今日 {count}人"
  ,"visitor.total": "累計 {count}人"
  ,"visitor.window": "過去{minutes}分以内の活動を基準に集計しています。"
};

export const translations = { ko, en, ja } as const;

export type TranslationKey = keyof typeof ko;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as Locale);
}

export function translate(locale: Locale, key: TranslationKey) {
  return translations[locale][key] ?? translations[DEFAULT_LOCALE][key] ?? key;
}

export function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export function formatCalculatorCount(locale: Locale, count: number) {
  if (locale === "en") return `${count.toLocaleString("en-US")} calculators`;
  if (locale === "ja") return `${count.toLocaleString("ja-JP")}件の計算機`;
  return `${count.toLocaleString("ko-KR")}개 계산기`;
}

export function formatDirectoryResultTitle(locale: Locale, count: number, isFiltered: boolean) {
  const formatted = count.toLocaleString(locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : "ko-KR");
  if (locale === "en") return isFiltered ? `${formatted} search results` : `${formatted} calculators`;
  if (locale === "ja") return isFiltered ? `検索結果 ${formatted}件` : `すべての計算機 ${formatted}件`;
  return isFiltered ? `검색 결과 ${formatted}개` : `전체 계산기 ${formatted}개`;
}

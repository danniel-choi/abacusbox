export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abacusbox.com";

export const legalStandards = {
  year: 2026,
  minimumWage: 10320,
  minimumDailyWage8h: 82560,
  minimumMonthlyWage209h: 2156880,
  nationalPensionEmployeeRate: 0.0475,
  nationalPensionTotalRate: 0.095,
  nationalPensionMinMonthlyIncome: 410000,
  nationalPensionMaxMonthlyIncome: 6590000,
  healthEmployeeRate: 0.03595,
  healthTotalRate: 0.0719,
  longTermCareRateOfHealth: 0.1314,
  employmentEmployeeRate: 0.009,
  unemploymentDailyUpper: 66000,
  unemploymentDailyLowerByMinimumWage: 10320 * 8 * 0.8
};

export const officialSources = [
  {
    label: "최저임금위원회 2026년 적용 최저임금",
    href: "https://minimumwage.go.kr/"
  },
  {
    label: "국민연금공단 보험료율 및 기준소득월액",
    href: "https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0038M0.do"
  },
  {
    label: "국민건강보험공단 2026년 건강보험료율",
    href: "https://www.nhis.or.kr/renewal_popup/poster/20260204_poster_longdesc_1.html"
  },
  {
    label: "고용보험 제도 안내",
    href: "https://www.ei.go.kr/"
  },
  {
    label: "국세청 종합소득세 세액계산요령",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7667&mi=2315"
  },
  {
    label: "국세청 근로소득 안내",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7870&mi=6591"
  },
  {
    label: "국세청 연말정산 종합 안내",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7957&mi=6645"
  },
  {
    label: "국세청 상속세 세율 안내",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7957&mi=6529"
  }
];

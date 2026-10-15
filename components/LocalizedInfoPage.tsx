"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/i18n";

type InfoKind = "about" | "editorial" | "privacy" | "terms";
type InfoCopy = { eyebrow: string; title: string; intro: string; sections: { title: string; paragraphs: string[] }[] };

const copy: Record<InfoKind, Record<Locale, InfoCopy>> = {
  about: {
    ko: {
      eyebrow: "About Calcrule",
      title: "계산의정석(계산의 정석) 소개",
      intro: "계산의정석은 복잡한 기준과 숫자를 빠르게 이해하고 비교할 수 있도록 만든 실전형 계산기 서비스입니다.",
      sections: [
        { title: "서비스 범위", paragraphs: ["급여, 퇴직금, 대출, 세금, 건강, 일상 도구, 생활 계산, 게임, 사주, 수학 도구를 한곳에서 제공합니다.", "주요 계산기는 회원가입 없이 사용할 수 있으며 운영 문의는 문의 게시판을 통해 접수합니다."] },
        { title: "운영 기준", paragraphs: ["계산 결과와 함께 입력 기준, 해석 포인트, FAQ, 관련 계산기를 제공합니다.", "변경 가능성이 큰 기준값은 기준연도 또는 확인일을 표시하고 공식 자료를 우선 반영합니다."] },
        { title: "신뢰와 한계", paragraphs: ["계산 결과는 참고용 추정치입니다. 실제 신고, 계약, 대출 승인, 세무·법률 판단은 관할 기관 또는 전문가 확인이 필요합니다.", "서비스는 확정 판단을 대신하기보다 판단 전에 기준을 잡고 비교하도록 돕습니다."] }
      ]
    },
    en: {
      eyebrow: "About Calcrule",
      title: "About Calcrule",
      intro: "Calcrule is a practical calculator service that helps people understand and compare complex standards and numbers quickly.",
      sections: [
        { title: "What we cover", paragraphs: ["We bring together payroll, severance, loans, taxes, health, everyday tools, life costs, games, fortune tools, and mathematics.", "Core calculators are available without an account, and operational questions can be submitted through the contact board."] },
        { title: "How we operate", paragraphs: ["Each calculator connects inputs and results with standards, interpretation points, FAQs, and related tools.", "Values that may change are marked with a reference year or review date, using official sources as the starting point."] },
        { title: "Trust and limitations", paragraphs: ["Results are estimates for reference. Confirm actual filings, contracts, loan approvals, tax matters, and legal decisions with the relevant institution or a professional.", "Our role is to help you compare the basis before making a decision, not to replace a final decision-maker."] }
      ]
    },
    ja: {
      eyebrow: "About Calcrule",
      title: "計算の定石について",
      intro: "計算の定石は、複雑な基準や数字をすばやく理解し、比較できるようにする実用的な計算機サービスです。",
      sections: [
        { title: "提供範囲", paragraphs: ["給与、退職金、ローン、税金、健康、日常ツール、生活費、ゲーム、占い、数学ツールをまとめています。", "主要な計算機は会員登録なしで利用でき、お問い合わせは掲示板から送信できます。"] },
        { title: "運営基準", paragraphs: ["各計算機で入力条件、結果の解釈、FAQ、関連ツールを確認できます。", "変更される可能性がある基準値には基準年や確認日を表示し、公的資料を優先します。"] },
        { title: "信頼と限界", paragraphs: ["結果は参考用の推定値です。申告、契約、融資、税務・法律上の判断は関係機関または専門家にご確認ください。", "最終判断を代替するのではなく、判断前の基準整理と比較を支援します。"] }
      ]
    }
  },
  editorial: {
    ko: { eyebrow: "Editorial policy", title: "운영 원칙", intro: "계산의정석의 콘텐츠 작성, 출처 반영, 수정·갱신, 사용자 생성 콘텐츠 운영 기준을 안내합니다.", sections: [
      { title: "1. 콘텐츠 작성 기준", paragraphs: ["검색 유입보다 실제 판단에 도움이 되는 계산 기준, 해석 포인트, 예외 조건을 우선합니다.", "주제별 사례와 입력 기준, 자주 발생하는 실수, 관련 계산기 연결성을 중심으로 구성합니다."] },
      { title: "2. 출처 반영 원칙", paragraphs: ["세율, 보험료율, 공제 기준과 법정 계산 구조는 공식 기관 고시, 법령, 공공 안내 자료를 우선 출처로 사용합니다.", "해석 차이가 생길 수 있는 항목은 참고용 추정치임을 함께 안내합니다."] },
      { title: "3. 수정 및 갱신", paragraphs: ["사용자 제보, 제도 개정, 기준연도 변경, 공식 문서 갱신이 확인되면 관련 계산기와 콘텐츠를 함께 점검합니다.", "새 기능 배포 전 계산기 동작, 모바일 표시, 주요 URL과 sitemap을 확인합니다."] },
      { title: "4. 사용자 콘텐츠와 광고", paragraphs: ["커뮤니티, 문의, 댓글은 스팸, 중복, 정책 위반 여부를 검토합니다.", "광고는 계산 결과와 입력 폼을 가리지 않는 위치에 배치하고, 가치가 낮은 페이지에는 보수적으로 노출합니다."] }
    ] },
    en: { eyebrow: "Editorial policy", title: "Editorial Policy", intro: "This page explains how Calcrule writes content, uses sources, handles updates, and moderates user-generated content.", sections: [
      { title: "1. Content standards", paragraphs: ["We prioritize calculation standards, interpretation points, and exceptions that help real decisions over search-focused summaries.", "Articles connect examples, input assumptions, common mistakes, and related calculators."] },
      { title: "2. Source standards", paragraphs: ["Official notices, laws, and public guidance are the primary sources for rates, insurance, deductions, and statutory formulas.", "Items with interpretation differences are identified as estimates for reference."] },
      { title: "3. Corrections and updates", paragraphs: ["We review related calculators and content when users report issues, rules change, reference years change, or official documents are updated.", "Before releasing features, we check calculator behavior, mobile layouts, important URLs, and sitemap coverage."] },
      { title: "4. User content and ads", paragraphs: ["Community posts, inquiries, and comments may be reviewed for spam, duplication, and policy violations.", "Ads are placed away from results and input forms, and are limited on pages with little user value."] }
    ] },
    ja: { eyebrow: "Editorial policy", title: "運営方針", intro: "計算の定石のコンテンツ作成、出典、更新、ユーザー投稿の運用基準を案内します。", sections: [
      { title: "1. コンテンツ基準", paragraphs: ["検索向けの要約より、実際の判断に役立つ計算基準、解釈、例外条件を優先します。", "事例、入力条件、よくある誤り、関連計算機をつなげて構成します。"] },
      { title: "2. 出典基準", paragraphs: ["税率、保険料、控除、法定計算式は公的機関の告示、法令、公的案内を優先します。", "解釈の違いがある項目は参考用の推定値として案内します。"] },
      { title: "3. 修正と更新", paragraphs: ["報告、制度改正、基準年の変更、公的文書の更新があれば関連する計算機と記事を確認します。", "機能公開前に動作、モバイル表示、主要URL、サイトマップを確認します。"] },
      { title: "4. 投稿と広告", paragraphs: ["コミュニティ、問い合わせ、コメントはスパムや重複、方針違反を確認します。", "広告は結果や入力欄を妨げない位置に配置し、価値の低いページでは控えめに表示します。"] }
    ] }
  },
  privacy: {
    ko: { eyebrow: "Privacy", title: "개인정보처리방침", intro: "계산의정석은 계산기 이용에 필요한 정보만 최소한으로 처리하고, 사용 목적과 보관 범위를 공개합니다.", sections: [
      { title: "1. 기본 원칙", paragraphs: ["계산기 입력값 자체를 회원 계정과 연결해 서버에 저장하지 않습니다. 입력값은 브라우저 화면, 공유 URL, 일부 로컬 저장소에 반영될 수 있습니다."] },
      { title: "2. 처리될 수 있는 정보", paragraphs: ["접속 로그, 기기·브라우저 정보, 페이지 요청, 성능 진단 정보가 처리될 수 있습니다.", "문의 게시판에서는 작성자 이름, 제목, 본문과 익명 문의 토큰이 처리될 수 있습니다."] },
      { title: "3. 쿠키와 광고", paragraphs: ["최근 사용 계산기, 입력 복원, 문의 식별, 방문 집계를 위해 로컬 저장소를 사용할 수 있습니다.", "Google AdSense 등 제3자 광고 서비스는 광고 게재와 측정을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다."] },
      { title: "4. 게시물과 삭제", paragraphs: ["문의, 댓글, 커뮤니티 게시물은 운영과 답변을 위해 필요한 기간 동안 보관될 수 있습니다.", "스팸, 욕설, 개인정보 노출, 정책 위반 게시물은 비공개 또는 삭제될 수 있습니다."] }
    ] },
    en: { eyebrow: "Privacy", title: "Privacy Policy", intro: "Calcrule processes only the information needed to operate the calculators and explains how that information is used and retained.", sections: [
      { title: "1. General principles", paragraphs: ["Calculator inputs are not stored on a server linked to a member account. Inputs may appear in the browser, shared URLs, or limited local storage."] },
      { title: "2. Information that may be processed", paragraphs: ["Access logs, device and browser details, page requests, and performance diagnostics may be processed.", "The contact board may process a name, subject, message, and an anonymous inquiry token."] },
      { title: "3. Cookies and advertising", paragraphs: ["Local storage may support recent calculators, input recovery, inquiry identification, and visitor counting.", "Third-party services such as Google AdSense may use cookies or similar technologies for ad delivery and measurement."] },
      { title: "4. Posts and deletion", paragraphs: ["Inquiries, comments, and community posts may be retained as needed for operations and responses.", "Spam, abuse, exposed personal information, and policy-violating posts may be hidden or deleted."] }
    ] },
    ja: { eyebrow: "Privacy", title: "プライバシーポリシー", intro: "計算の定石は、計算機の運営に必要な情報だけを最小限に処理し、利用目的と保存範囲を案内します。", sections: [
      { title: "1. 基本方針", paragraphs: ["計算機の入力値を会員アカウントと結び付けてサーバーに保存しません。入力値はブラウザ、共有URL、一部のローカルストレージに反映される場合があります。"] },
      { title: "2. 処理される可能性がある情報", paragraphs: ["アクセスログ、端末・ブラウザ情報、ページリクエスト、性能診断情報を処理する場合があります。", "お問い合わせでは名前、件名、本文、匿名トークンを処理する場合があります。"] },
      { title: "3. Cookieと広告", paragraphs: ["最近使った計算機、入力復元、お問い合わせ識別、訪問集計のためローカルストレージを使用する場合があります。", "Google AdSenseなど第三者サービスは広告配信と測定のためCookie等を使用する場合があります。"] },
      { title: "4. 投稿と削除", paragraphs: ["お問い合わせ、コメント、コミュニティ投稿は運営と回答に必要な期間保存される場合があります。", "スパム、暴言、個人情報の掲載、方針違反の投稿は非公開または削除される場合があります。"] }
    ] }
  },
  terms: {
    ko: { eyebrow: "Terms", title: "이용약관", intro: "계산의정석 서비스 이용 범위, 계산 결과의 한계, 사용자 게시물과 광고 운영 기준을 안내합니다.", sections: [
      { title: "1. 서비스 목적", paragraphs: ["계산의정석은 노무, 금융, 세금, 생활, 수학 관련 계산을 빠르게 비교하고 이해하도록 돕는 정보성 서비스입니다.", "계산 결과와 해설은 공식 신고, 계약, 대출 승인, 법률·세무 판단을 대신하지 않습니다."] },
      { title: "2. 결과의 한계", paragraphs: ["기준연도와 공개된 자료를 바탕으로 결과를 산출하지만 제도 개정, 개인별 예외, 기관 해석에 따라 실제 결과와 다를 수 있습니다.", "중요한 의사결정 전에는 관할 기관이나 전문가 확인을 권장합니다."] },
      { title: "3. 사용자 게시물", paragraphs: ["문의, 댓글, 커뮤니티에는 개인정보 노출, 욕설, 차별, 불법 행위 조장, 광고성 스팸, 저작권 침해 콘텐츠를 게시할 수 없습니다.", "정책 위반 가능성이 있는 게시물은 비공개, 수정 요청, 삭제 처리될 수 있습니다."] },
      { title: "4. 광고와 문의", paragraphs: ["서비스 운영을 위해 제3자 광고가 표시될 수 있으며 쿠키 또는 유사 기술이 사용될 수 있습니다.", "서비스 오류, 기준 정정, 제휴 문의는 문의 페이지를 통해 접수할 수 있습니다."] }
    ] },
    en: { eyebrow: "Terms", title: "Terms of Use", intro: "These terms explain the scope of Calcrule, the limits of calculator results, and the rules for user posts and advertising.", sections: [
      { title: "1. Service purpose", paragraphs: ["Calcrule is an informational service for quickly comparing labor, finance, tax, life, and mathematics calculations.", "Results and explanations do not replace official filings, contracts, loan approvals, or legal and tax decisions."] },
      { title: "2. Limits of results", paragraphs: ["Results use reference years and public materials, but may differ because of rule changes, personal exceptions, or institutional interpretation.", "Confirm important decisions with the relevant institution or a professional."] },
      { title: "3. User posts", paragraphs: ["Do not post personal information, abuse, discrimination, encouragement of illegal activity, advertising spam, or copyright-infringing content.", "Posts that may violate policy may be hidden, sent back for edits, or deleted."] },
      { title: "4. Ads and contact", paragraphs: ["Third-party ads may appear to operate the service, using cookies or similar technologies.", "Report service errors, standards corrections, or partnership questions through the contact page."] }
    ] },
    ja: { eyebrow: "Terms", title: "利用規約", intro: "計算の定石の利用範囲、計算結果の限界、投稿と広告の運用基準を案内します。", sections: [
      { title: "1. サービスの目的", paragraphs: ["計算の定石は、労務、金融、税金、生活、数学の計算をすばやく比較する情報サービスです。", "結果と解説は、公式申告、契約、融資、法律・税務上の判断を代替しません。"] },
      { title: "2. 結果の限界", paragraphs: ["基準年と公開資料をもとに計算しますが、制度改正、個別条件、機関の解釈により実際と異なる場合があります。", "重要な判断は関係機関または専門家にご確認ください。"] },
      { title: "3. ユーザー投稿", paragraphs: ["お問い合わせやコメントに個人情報、暴言、差別、違法行為の助長、広告スパム、著作権侵害の内容を投稿できません。", "方針違反の可能性がある投稿は非公開、修正依頼、削除の対象となる場合があります。"] },
      { title: "4. 広告とお問い合わせ", paragraphs: ["運営のため第三者広告を表示する場合があり、Cookie等を使用する場合があります。", "不具合、基準の訂正、提携に関するお問い合わせはお問い合わせページから送信できます。"] }
    ] }
  }
};

export function LocalizedInfoPage({ kind }: { kind: InfoKind }) {
  const { locale } = useLanguage();
  const page = copy[kind][locale];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-[24px] border border-line bg-white p-7 shadow-panel">
        <p className="text-sm font-extrabold text-brand">{page.eyebrow}</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{page.title}</h1>
        <p className="mt-5 text-base font-medium leading-8 text-slate-700">{page.intro}</p>
        <div className="mt-7 grid gap-7 text-slate-700">
          {page.sections.map((section) => (
            <section key={section.title} className="grid gap-3 text-base font-medium leading-8">
              <h2 className="text-lg font-extrabold text-ink">{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

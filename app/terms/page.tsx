import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관",
  description: "계산의정석 서비스 이용 범위, 계산 결과의 한계, 사용자 게시물과 광고 운영 기준을 안내합니다."
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-[24px] border border-line bg-white p-7 shadow-panel">
        <p className="text-sm font-extrabold text-brand">Terms of Use</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">이용약관</h1>
        <div className="mt-6 grid gap-6 text-slate-700">
          <section>
            <h2 className="text-lg font-extrabold text-ink">1. 서비스의 목적</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산의정석은 노무, 금융, 세금, 생활, 수학 관련 계산을 빠르게 비교하고 이해할 수 있도록 돕는 정보성 계산기 서비스입니다.</p>
              <p>각 계산기는 입력값에 따른 추정 결과와 해설을 제공하며, 공식 신고, 계약, 대출 승인, 법률·세무 판단을 대신하지 않습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">2. 계산 결과의 한계</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>서비스는 기준연도, 공개된 공식 자료, 일반적인 계산 구조를 바탕으로 결과를 산출합니다. 제도 개정, 개인별 예외 조건, 기관 해석에 따라 실제 결과와 차이가 날 수 있습니다.</p>
              <p>세금, 임금, 보험, 대출, 부동산 관련 의사결정 전에는 관할 기관, 금융기관, 노무사, 세무사 등 전문가 확인을 권장합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">3. 사용자 게시물</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>문의, 댓글, 커뮤니티 게시물에는 개인정보, 욕설, 차별적 표현, 불법 행위 조장, 광고성 스팸, 저작권 침해 콘텐츠를 올릴 수 없습니다.</p>
              <p>운영상 필요하거나 정책 위반 가능성이 있는 게시물은 비공개, 수정 요청, 삭제 처리될 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">4. 광고 및 외부 서비스</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산의정석은 서비스 운영을 위해 Google AdSense 등 제3자 광고 서비스를 사용할 수 있습니다. 광고 게재와 측정 과정에서 쿠키 또는 유사 기술이 사용될 수 있습니다.</p>
              <p>광고와 개인정보 처리에 관한 자세한 내용은 <Link href="/privacy" className="font-extrabold text-brand">개인정보처리방침</Link>을 함께 확인하세요.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">5. 문의</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>서비스 오류, 계산 기준 정정, 제휴와 관련한 문의는 <Link href="/contact" className="font-extrabold text-brand">문의 페이지</Link>에서 접수할 수 있습니다.</p>
              <p>시행일: 2026년 9월 25일</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

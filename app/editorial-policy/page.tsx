import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "운영 원칙",
  description: "계산의정석의 콘텐츠 작성 기준, 출처 반영 원칙, 문의 및 수정 대응 기준을 안내합니다."
};

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-[24px] border border-line bg-white p-7 shadow-panel">
        <p className="text-sm font-extrabold text-brand">Trust & Editorial</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">운영 원칙</h1>
        <div className="mt-6 grid gap-6 text-slate-700">
          <section>
            <h2 className="text-lg font-extrabold text-ink">1. 콘텐츠 작성 기준</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산의정석은 검색 유입을 위한 요약문보다 실제 판단에 도움이 되는 계산 기준, 해석 포인트, 예외 조건을 우선해 작성합니다.</p>
              <p>계산기 설명 글과 블로그 글은 같은 표현을 반복하는 방식보다 주제별 사례, 입력 기준, 자주 발생하는 실수, 관련 계산기 연결성을 중심으로 구성합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">2. 출처 반영 원칙</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>세율, 보험료율, 공제 기준, 법정 계산 구조는 공식 기관 고시, 법령, 공공 안내 자료를 우선 출처로 사용합니다.</p>
              <p>연도나 제도 변경 가능성이 큰 항목은 가능한 한 기준일을 명시하고, 해석 차이가 생길 수 있는 항목은 참고용 추정치임을 함께 안내합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">3. 수정 및 갱신 기준</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>사용자 제보, 제도 개정, 기준연도 변경, 공식 문서 갱신이 확인되면 관련 계산기와 해설 콘텐츠를 함께 점검합니다.</p>
              <p>오류 가능성이 있는 표현은 그대로 두지 않고, 계산식보다 먼저 입력 전제와 적용 범위를 수정하는 것을 원칙으로 합니다.</p>
              <p>새 기능을 배포할 때는 계산기 동작, 모바일 표시, 주요 URL 응답, sitemap 반영 여부를 함께 확인합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">4. 사용자 생성 콘텐츠 운영</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>커뮤니티, 문의, 댓글 등 사용자 생성 콘텐츠는 운영자가 정책 위반, 스팸, 중복, 저품질 게시물을 점검하고 필요 시 비노출 또는 삭제할 수 있습니다.</p>
              <p>광고 및 검색 품질에 불리할 수 있는 페이지는 보수적으로 색인하거나 광고 노출 범위에서 제외하는 방향을 우선 고려합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">5. 광고 친화성과 사용자 경험</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>광고는 콘텐츠를 가리거나 기능 사용을 방해하지 않는 위치에 배치하는 것을 원칙으로 합니다. 계산 결과와 입력 폼, 공식 출처 링크가 광고보다 먼저 이해되도록 화면을 구성합니다.</p>
              <p>빈 페이지, 제작 중인 페이지, 내용이 부족한 자동 생성 페이지, 사용자에게 가치가 낮은 중복 페이지에는 광고 노출을 보수적으로 적용합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">6. 문의 및 정정 요청</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산 기준 오류, 표현상 오해, 제휴 문의는 <Link href="/contact" className="font-extrabold text-brand">문의 페이지</Link>를 통해 접수할 수 있습니다.</p>
              <p>정정이 필요한 경우 관련 계산기 설명, 블로그 글, 연결 문구까지 함께 조정해 사용자 해석 오류를 줄이는 방향으로 반영합니다.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-[24px] border border-line bg-white p-7 shadow-panel">
        <p className="text-sm font-extrabold text-brand">About Calcrule</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">계산의정석 소개</h1>
        <div className="mt-6 grid gap-6 text-slate-700">
          <section className="grid gap-3 text-base font-medium leading-8">
            <p>
              계산의정석은 복잡한 기준과 숫자를 더 빠르게 이해하고 판단할 수 있도록 만든 실전형 계산기 서비스입니다.
              급여, 퇴직금, 대출, 세금, 생활 계산까지 자주 필요한 계산을 한곳에 모아 바로 실행할 수 있게 구성했습니다.
            </p>
            <p>
              단순히 숫자만 보여주는 도구가 아니라, 계산 결과를 해석하는 데 필요한 기준 설명과 주의사항까지 함께 제공하는 것이
              계산의정석의 핵심입니다. 각 계산기 페이지에서 입력, 결과, 해설, FAQ, 관련 계산기를 한 흐름으로 이어서 볼 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">무엇을 중요하게 보나</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>서비스는 신속성과 정확성을 함께 지향합니다. 필요한 값을 즉시 확인할 수 있도록 인터페이스를 단순하게 유지하면서도, 실제 판단에 영향을 주는 기준값은 공식 자료를 우선 반영합니다.</p>
              <p>최저임금, 보험료율, 세율, 공제 기준, 제도 문구처럼 변경 가능성이 큰 항목은 기준연도 또는 확인일을 함께 표시해 해석 오류를 줄이려 합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">콘텐츠 운영 방식</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산의정석은 계산기만 나열하는 구조보다, 계산 결과와 연결되는 해설 콘텐츠를 함께 제공하는 구조를 지향합니다. 블로그에서는 제도 가이드, 비교 글, 자주 틀리는 포인트를 다룹니다.</p>
              <p>자동 발행되는 글도 그대로 두지 않고, 주제별 입력 기준, 예외 사항, 실무형 표현을 강화하는 방식으로 지속 개선합니다. 사람이 검토한 것처럼 읽히되, 사실관계와 구조가 흔들리지 않는 방향을 우선합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">신뢰와 한계</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산 결과는 참고용 추정치이며, 실제 신고, 계약, 대출 승인, 세무, 법률 판단은 관할 기관 또는 전문가 확인이 필요합니다.</p>
              <p>계산의정석의 역할은 확정 판단을 대신하는 것이 아니라, 그 전 단계에서 가장 빠르게 기준을 잡고 비교할 수 있도록 돕는 것입니다.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

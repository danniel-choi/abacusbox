export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-[24px] border border-line bg-white p-7 shadow-panel">
        <p className="text-sm font-extrabold text-brand">Privacy Policy</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">개인정보처리방침</h1>
        <div className="mt-6 grid gap-6 text-slate-700">
          <section>
            <h2 className="text-lg font-extrabold text-ink">1. 기본 원칙</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산의정석은 계산기 입력값 자체를 회원 계정과 연결해 서버에 저장하지 않습니다. 계산 입력값은 브라우저 화면, 공유 URL 파라미터, 일부 로컬 저장소에만 반영될 수 있습니다.</p>
              <p>서비스는 로그인 기반 회원 서비스를 운영하지 않으며, 계산 기능은 가능한 한 최소한의 정보 처리로 동작하도록 설계합니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">2. 수집 또는 처리될 수 있는 정보</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>서비스 운영 과정에서 접속 로그, 기기·브라우저 정보, 페이지 요청 정보, 성능 진단 정보가 처리될 수 있습니다.</p>
              <p>푸터 방문 통계 기능은 브라우저 로컬 저장소에 익명 방문자 식별값을 저장하고, 최근 활동 시각을 기반으로 현재 방문자 수와 누적 방문 수를 집계합니다. 이 값은 개인을 직접 식별하기 위한 용도로 사용하지 않습니다.</p>
              <p>문의 게시판을 사용할 경우 작성자 이름, 제목, 문의 본문, 브라우저에 저장된 익명 문의 토큰이 처리될 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">3. 쿠키 및 로컬 저장소</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>서비스는 계산기 입력 복원, 최근 사용 계산기, 문의 식별, 방문 집계를 위해 브라우저의 로컬 저장소를 사용할 수 있습니다.</p>
              <p>광고 또는 분석 도구를 연동하는 경우 해당 사업자가 쿠키, 광고 식별자, 유사 기술을 사용할 수 있습니다. 이 경우 관련 정책과 브라우저 설정에 따라 사용자가 일부 저장을 차단할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">4. 광고 및 제3자 서비스</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>계산의정석은 Google AdSense 등 제3자 광고 서비스를 사용할 수 있으며, 이 과정에서 광고 게재·측정·사기 방지 목적의 기술이 적용될 수 있습니다.</p>
              <p>광고 게재 방식과 개인화 여부는 Google 및 관련 사업자의 정책, 사용자 브라우저 설정, 지역별 규제에 따라 달라질 수 있습니다.</p>
              <p>Google을 포함한 제3자 사업자는 사용자의 이전 방문 기록 또는 관심사를 바탕으로 광고를 제공하기 위해 쿠키를 사용할 수 있습니다. 사용자는 브라우저 설정 또는 Google 광고 설정에서 개인화 광고 관련 선택을 조정할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">5. 문의 및 게시물 처리</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>문의 게시판에 작성된 내용은 서비스 운영, 오류 수정, 기능 요청 검토, 제휴 응대 목적으로 사용할 수 있습니다.</p>
              <p>스팸, 욕설, 개인정보 노출, 정책 위반 게시물은 사전 통지 없이 비공개 또는 삭제될 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">6. 보관 및 삭제</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>문의 게시물과 댓글은 서비스 운영과 답변 관리를 위해 필요한 기간 동안 보관될 수 있습니다. 개인정보가 포함된 게시물은 요청 또는 운영 판단에 따라 비공개 처리될 수 있습니다.</p>
              <p>브라우저 로컬 저장소에 저장된 계산 입력값, 최근 사용 계산기, 방문자 식별값은 사용자가 브라우저 설정에서 직접 삭제할 수 있습니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-ink">7. 문의 방법</h2>
            <div className="mt-3 grid gap-3 text-base font-medium leading-8">
              <p>개인정보 처리나 콘텐츠 오류와 관련한 문의는 사이트의 문의 페이지를 통해 접수할 수 있습니다.</p>
              <p>시행일: 2026년 9월 25일</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

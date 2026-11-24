"use client";

import { useMemo, useRef, useState } from "react";

type TarotCard = {
  name: string;
  image: string;
  keyword: string;
  message: string;
  advice: string;
};

const tarotCards: TarotCard[] = [
  { name: "마법사", image: "01-TheMagician.png", keyword: "시작·표현·기회", message: "오늘은 생각해 둔 일을 작게라도 시작하기 좋은 날입니다. 가진 도구와 사람을 연결하면 막혀 있던 일이 움직입니다.", advice: "완벽하게 준비될 때까지 기다리기보다 첫 연락이나 첫 실행을 남겨 보세요." },
  { name: "여사제", image: "02-TheHighPriestess.png", keyword: "직관·관찰·침착", message: "빠른 결론보다 조용히 정보를 모으는 편이 유리합니다. 말보다 표정과 분위기에서 중요한 단서를 찾을 수 있습니다.", advice: "오늘은 답을 재촉하지 말고 한 번 더 확인한 뒤 결정하세요." },
  { name: "여황제", image: "03-TheEmpress.png", keyword: "풍요·돌봄·성장", message: "주변의 도움과 따뜻한 에너지가 결과를 키워 주는 날입니다. 작은 성과를 나누면 관계와 일 모두 더 풍성해집니다.", advice: "나를 돌보는 시간과 가까운 사람에게 건네는 고마움을 챙겨 보세요." },
  { name: "황제", image: "04-TheEmperor.png", keyword: "기준·책임·정리", message: "흐릿했던 일에 기준을 세우면 속도가 붙습니다. 역할과 우선순위를 분명히 할수록 불필요한 충돌을 줄일 수 있습니다.", advice: "오늘 해야 할 일을 세 가지로 줄이고 순서를 정하세요." },
  { name: "교황", image: "05-TheHierophant.png", keyword: "배움·조언·원칙", message: "혼자 고민하기보다 경험 있는 사람의 관점을 빌리면 실수가 줄어듭니다. 익숙한 방식 안에서도 새로운 답을 발견합니다.", advice: "공식 자료나 신뢰할 수 있는 조언을 먼저 확인하세요." },
  { name: "연인", image: "06-TheLovers.png", keyword: "선택·조화·관계", message: "오늘의 핵심은 무엇을 선택하느냐보다 왜 선택하는지입니다. 서로의 기준을 솔직하게 나누면 관계가 한 단계 가까워집니다.", advice: "상대의 마음을 추측하기보다 짧고 분명하게 물어보세요." },
  { name: "전차", image: "07-TheChariot.png", keyword: "추진·집중·전진", message: "방향이 정해지면 속도감 있게 움직일 수 있습니다. 중간에 흔들려도 처음 정한 목표를 다시 바라보면 됩니다.", advice: "알림을 끄고 가장 중요한 일에 집중하는 시간을 확보하세요." },
  { name: "힘", image: "08-Strength.png", keyword: "용기·인내·균형", message: "강하게 밀어붙이는 것보다 부드럽게 지속하는 힘이 빛납니다. 감정을 누르기보다 다루는 태도가 좋은 결과로 이어집니다.", advice: "급한 답장이나 반응은 잠시 늦추고 한 번 호흡하세요." },
  { name: "은둔자", image: "09-TheHermit.png", keyword: "성찰·집중·지혜", message: "사람이 많은 곳보다 혼자 생각을 정리하는 시간이 도움이 됩니다. 이미 알고 있지만 외면했던 답을 다시 발견할 수 있습니다.", advice: "오늘의 생각을 짧은 메모로 남기면 내일의 방향이 선명해집니다." },
  { name: "운명의 수레바퀴", image: "10-WheelOfFortune.png", keyword: "전환·흐름·기회", message: "예상 밖의 변화가 새로운 기회로 이어질 수 있습니다. 계획을 고집하기보다 좋은 흐름을 알아보는 유연함이 필요합니다.", advice: "갑작스러운 제안은 즉시 거절하지 말고 조건부터 확인하세요." },
  { name: "정의", image: "11-Justice.png", keyword: "균형·판단·정직", message: "감정과 사실을 나누어 보면 판단이 쉬워집니다. 주고받는 관계에서는 약속과 기준을 공평하게 맞추는 일이 중요합니다.", advice: "결정 전에 장점과 부담을 각각 한 줄씩 적어 보세요." },
  { name: "매달린 사람", image: "12-TheHangedMan.png", keyword: "멈춤·관점·수용", message: "잠깐 멈추는 것이 뒤처지는 일이 아닙니다. 다른 각도에서 바라보면 당연하게 여겼던 선택지가 새롭게 보입니다.", advice: "오늘 결론을 내리지 않아도 되는 일은 하루 미뤄 보세요." },
  { name: "죽음", image: "13-Death.png", keyword: "정리·변화·전환", message: "끝내야 할 습관이나 미련을 정리하면 새로운 공간이 생깁니다. 변화는 손실보다 다음 장면을 준비하는 과정에 가깝습니다.", advice: "더 이상 쓰지 않는 일이나 약속 하나를 정리해 보세요." },
  { name: "절제", image: "14-Temperance.png", keyword: "조율·회복·중용", message: "서로 다른 속도와 의견을 섞어 균형을 만드는 날입니다. 과하거나 부족한 쪽을 조금씩 조절하면 흐름이 안정됩니다.", advice: "한 번에 바꾸려 하지 말고 오늘 가능한 만큼만 조정하세요." },
  { name: "악마", image: "15-TheDevil.png", keyword: "욕망·집중·현실감각", message: "매력적인 제안이나 즉흥적인 소비를 만날 수 있습니다. 원하는 마음을 나쁘게 볼 필요는 없지만 대가와 조건을 함께 살펴야 합니다.", advice: "결제·계약 전 총비용과 취소 조건을 확인하세요." },
  { name: "탑", image: "16-TheTower.png", keyword: "전환·해체·새기준", message: "예상과 다른 소식이 계획을 바꿀 수 있지만, 오히려 약했던 부분을 드러내는 계기가 됩니다. 숨기기보다 빠르게 현실을 인정하세요.", advice: "문제가 보이면 책임 공방보다 복구 순서부터 정하세요." },
  { name: "별", image: "17-TheStar.png", keyword: "희망·회복·영감", message: "작지만 분명한 희망이 다시 보이는 날입니다. 지금의 속도가 느려도 방향이 맞다면 꾸준함이 좋은 결과를 만듭니다.", advice: "다음 주의 나를 위해 오늘 할 수 있는 작은 준비를 남기세요." },
  { name: "달", image: "18-TheMoon.png", keyword: "감정·직감·불확실성", message: "확실하지 않은 정보가 마음을 크게 흔들 수 있습니다. 느낌을 무시할 필요는 없지만 사실로 확인되기 전까지는 가능성으로만 다뤄 주세요.", advice: "소문보다 원문과 실제 숫자를 먼저 확인하세요." },
  { name: "태양", image: "19-TheSun.png", keyword: "활력·성공·명료함", message: "자신 있게 드러낼수록 좋은 반응을 얻는 날입니다. 결과를 혼자 간직하기보다 함께 축하하면 기쁨이 더 커집니다.", advice: "미뤄 둔 발표·공유·감사 인사를 오늘 실행해 보세요." },
  { name: "심판", image: "20-Judgement.png", keyword: "각성·재평가·결단", message: "과거의 경험에서 배운 것을 현재의 선택에 적용할 때입니다. 다시 기회가 온 일이 있다면 이번에는 다른 기준으로 바라보세요.", advice: "예전에 포기한 일 중 지금 조건이 달라진 것을 하나 점검하세요." },
  { name: "세계", image: "21-TheWorld.png", keyword: "완성·통합·성취", message: "한 사이클을 마무리하고 다음 단계로 넘어갈 준비가 되었습니다. 부족한 점보다 여기까지 쌓아 온 연결과 성취를 먼저 보세요.", advice: "완료한 일을 기록하고 다음 목표를 한 문장으로 정리하세요." }
];

function hashDate(date: Date) {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return [...key].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 7);
}

function getTodayLabel(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(date);
}

export function DailyTarotClient() {
  const today = useMemo(() => new Date(), []);
  const dailyIndex = Math.abs(hashDate(today)) % tarotCards.length;
  const [selected, setSelected] = useState<number | null>(null);
  const [drawingIndex, setDrawingIndex] = useState<number | null>(null);
  const [shared, setShared] = useState(false);
  const drawTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const card = tarotCards[selected === null ? dailyIndex : selected];
  const cardSlots = useMemo(() => [0, 1, 2].map((offset) => (dailyIndex + offset * 7) % tarotCards.length), [dailyIndex]);

  const drawCard = (index: number) => {
    if (drawingIndex !== null) return;
    if (drawTimer.current) clearTimeout(drawTimer.current);
    setDrawingIndex(index);
    setShared(false);
    drawTimer.current = setTimeout(() => {
      setSelected(cardSlots[index]);
      setDrawingIndex(null);
      drawTimer.current = null;
    }, 560);
  };

  const shareResult = async () => {
    const text = `오늘의 타로: ${card.name} (${card.keyword}) - 계산의정석`;
    if (navigator.share) {
      await navigator.share({ title: "오늘의 타로 운세", text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setShared(true);
    }
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
      <section className="tarot-stage relative overflow-hidden rounded-[30px] bg-[#17112d] p-6 text-white shadow-panel sm:p-8" aria-labelledby="tarot-draw-title">
        <div className="tarot-stars" aria-hidden="true">
          {["top-8 left-[12%]", "top-20 left-[82%]", "top-[42%] left-[6%]", "top-[56%] left-[91%]", "bottom-12 left-[23%]", "bottom-8 left-[74%]"].map((position, index) => (
            <span key={position} className={`tarot-star ${position} tarot-star-delay-${index + 1}`}>✦</span>
          ))}
        </div>
        <div className="relative z-10">
        <p className="text-sm font-extrabold text-[#d7b8ff]">{getTodayLabel(today)}</p>
        <h2 id="tarot-draw-title" className="mt-3 text-2xl font-extrabold sm:text-3xl">오늘의 카드를 한 장 골라보세요</h2>
        <p className="mt-3 text-sm font-medium leading-7 text-white/70">마음속 질문을 하나 정한 뒤 끌리는 카드를 선택하세요. 카드를 고르면 오늘의 종합운과 실천 메시지를 확인할 수 있습니다.</p>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">
          {cardSlots.map((_, index) => (
            <button
              key={`slot-${index}`}
              type="button"
              onClick={() => drawCard(index)}
              disabled={drawingIndex !== null}
              className={`tarot-card-button group aspect-[2/3] overflow-hidden rounded-[20px] border p-2 transition hover:-translate-y-1 sm:rounded-[26px] sm:p-3 ${drawingIndex === index ? "is-drawing" : ""} ${selected === cardSlots[index] ? "is-selected border-[#d7b8ff] bg-[#6e42a7]" : "border-white/15 bg-[#30204d] hover:border-[#d7b8ff]/70"}`}
              aria-label={`${index + 1}번째 타로 카드 선택`}
            >
              <span className="tarot-card-inner block h-full w-full">
                <span className="tarot-card-face tarot-card-back flex h-full w-full items-center justify-center rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,#865dc5,#2b1d47_65%)] text-4xl text-[#e8d8ff] sm:rounded-[20px] sm:text-6xl">✦</span>
                <span className="tarot-card-face tarot-card-front block h-full w-full overflow-hidden rounded-[14px] sm:rounded-[20px]">
                  <img src={`/tarot-images/${cardSlots[index] === selected ? card.image : tarotCards[cardSlots[index]].image}`} alt={`${cardSlots[index] === selected ? card.name : tarotCards[cardSlots[index]].name} 타로 카드`} className="h-full w-full object-cover" />
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-center text-xs font-bold text-white/50">카드는 오늘 날짜를 기준으로 매일 새롭게 준비됩니다.</p>
        </div>
      </section>

      <section key={`tarot-result-${selected ?? dailyIndex}`} className="tarot-result-card rounded-[30px] border border-[#eadcff] bg-white p-6 shadow-panel sm:p-8" aria-live="polite">
        <p className="text-sm font-extrabold text-[#7040a4]">오늘의 종합운</p>
        <div className="mt-4 flex items-center gap-4">
          <img src={`/tarot-images/${card.image}`} alt={`${card.name} 카드`} className="h-28 w-20 rounded-xl object-cover shadow-md sm:h-36 sm:w-24" />
          <div>
            <h2 className="text-3xl font-black text-ink">{card.name}</h2>
            <p className="mt-2 text-sm font-extrabold text-[#7040a4]">{card.keyword}</p>
          </div>
        </div>
        <p className="mt-6 text-base font-bold leading-8 text-slate-700">{card.message}</p>
        <div className="mt-5 rounded-[20px] bg-[#f8f2ff] p-4">
          <p className="text-xs font-extrabold text-[#7040a4]">오늘의 한마디</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{card.advice}</p>
        </div>
        <button type="button" onClick={shareResult} className="mt-6 w-full rounded-full bg-[#7040a4] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#5c318c]">
          {shared ? "결과 링크를 복사했어요" : "오늘의 타로 결과 공유하기"}
        </button>
      </section>
    </div>
  );
}

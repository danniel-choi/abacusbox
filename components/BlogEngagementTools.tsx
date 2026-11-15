"use client";

import { useState } from "react";

type Props = {
  title: string;
  excerpt: string;
  url: string;
  calculatorHref?: string;
};

export function BlogEngagementTools({ title, excerpt, url, calculatorHref }: Props) {
  const [message, setMessage] = useState("");

  const share = async () => {
    const shareData = { title, text: excerpt, url };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${title}\n${url}`);
        setMessage("링크를 복사했습니다.");
      }
    } catch {
      setMessage("공유를 취소했거나 지원하지 않는 환경입니다.");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setMessage("링크를 복사했습니다.");
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext("2d");
    if (!context) return;
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#102a43");
    gradient.addColorStop(1, "#087f5b");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#8ff0c7";
    context.font = "700 28px sans-serif";
    context.fillText("계산의정석", 80, 90);
    context.fillStyle = "#ffffff";
    context.font = "800 52px sans-serif";
    drawWrappedText(context, title, 80, 190, 1040, 66, 3);
    context.fillStyle = "rgba(255,255,255,0.78)";
    context.font = "500 28px sans-serif";
    drawWrappedText(context, excerpt, 80, 410, 1040, 42, 3);
    context.fillStyle = "rgba(255,255,255,0.58)";
    context.font = "600 22px sans-serif";
    context.fillText("www.abacusbox.com", 80, 570);
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "calcrule-blog-summary.png";
    anchor.click();
    setMessage("공유용 이미지를 저장했습니다.");
  };

  return (
    <section className="mt-7 rounded-[24px] border border-brand/20 bg-gradient-to-br from-[#effff8] via-white to-[#eef3ff] p-5 sm:p-6" aria-label="블로그 공유 도구">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-brand">읽고 바로 활용하기</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">이 글의 내용을 저장하거나 공유하세요</h2>
        </div>
        {calculatorHref && <a href={calculatorHref} className="rounded-full bg-brand px-4 py-2.5 text-center text-sm font-extrabold text-white transition hover:bg-[#029b72]">직접 계산하기 →</a>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={share} className="rounded-full bg-ink px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand">공유하기</button>
        <button type="button" onClick={copyLink} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-extrabold text-ink transition hover:border-brand">링크 복사</button>
        <button type="button" onClick={saveImage} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-extrabold text-ink transition hover:border-brand">요약 이미지 저장</button>
        {message && <span className="self-center text-xs font-bold text-slate-500">{message}</span>}
      </div>
    </section>
  );
}

function drawWrappedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(/\s+/);
  let line = "";
  let lineNumber = 0;
  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line) {
      context.fillText(line, x, y + lineNumber * lineHeight);
      line = word;
      lineNumber += 1;
      if (lineNumber >= maxLines - 1) break;
    } else line = nextLine;
  }
  if (lineNumber < maxLines) context.fillText(line, x, y + lineNumber * lineHeight);
}

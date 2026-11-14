"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";

type ImageTool = "compress" | "resize" | "crop";

export function ToolboxClient() {
  const [active, setActive] = useState<"image" | "json" | "text" | "drawing" | "youtube" | "metadata">("image");

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
        {active === "image" && <ImageToolPanel />}
        {active === "json" && <JsonToolPanel />}
        {active === "text" && <TextToolPanel />}
        {active === "drawing" && <DrawingToolPanel />}
        {active === "youtube" && <YoutubeThumbnailPanel />}
        {active === "metadata" && <ImageMetadataPanel />}
      </section>
      <aside className="h-fit rounded-[28px] border border-line bg-white p-5 shadow-panel">
        <p className="text-sm font-extrabold text-brand">브라우저에서 바로 처리</p>
        <h2 className="mt-2 text-xl font-extrabold text-ink">웹툴 모음</h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">파일을 서버에 올리지 않고 이 브라우저에서 처리하는 도구부터 제공합니다.</p>
        <div className="mt-5 grid gap-2">
          <ToolTab active={active === "image"} onClick={() => setActive("image")} title="이미지 작업실" description="압축·리사이즈·변환·자르기" />
          <ToolTab active={active === "json"} onClick={() => setActive("json")} title="JSON 정리" description="검사·정렬·압축" />
          <ToolTab active={active === "text"} onClick={() => setActive("text")} title="텍스트 카운터" description="글자·단어·줄 수" />
          <ToolTab active={active === "drawing"} onClick={() => setActive("drawing")} title="브라우저 그림판" description="그리기·주석·PNG 저장" />
          <ToolTab active={active === "youtube"} onClick={() => setActive("youtube")} title="유튜브 썸네일" description="영상 URL에서 이미지 추출" />
          <ToolTab active={active === "metadata"} onClick={() => setActive("metadata")} title="이미지 정보" description="크기·비율·용량 확인" />
        </div>
        <div className="mt-5 rounded-2xl bg-paper p-4 text-xs font-semibold leading-5 text-slate-500">OCR, 배경 제거, 웹사이트 캡처는 브라우저 권한과 별도 모델이 필요해 후속 도구로 확장합니다.</div>
      </aside>
    </div>
  );
}

function ToolTab({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description: string }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left transition ${active ? "border-brand bg-brand/5" : "border-line hover:border-brand/50"}`}>
      <span className="block text-sm font-extrabold text-ink">{title}</span>
      <span className="mt-1 block text-xs font-semibold text-slate-500">{description}</span>
    </button>
  );
}

function ImageToolPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [tool, setTool] = useState<ImageTool>("compress");
  const [maxWidth, setMaxWidth] = useState(1600);
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [ratio, setRatio] = useState("free");
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile || !nextFile.type.startsWith("image/")) {
      setMessage("이미지 파일만 선택할 수 있습니다.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setMessage(`${nextFile.name} · ${(nextFile.size / 1024).toFixed(0)}KB`);
  };

  const processImage = async () => {
    if (!file) {
      setMessage("먼저 이미지 파일을 선택하세요.");
      return;
    }
    const source = new Image();
    source.src = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => { source.onload = () => resolve(); source.onerror = () => reject(new Error("이미지를 읽지 못했습니다.")); });
    const cropRatio = ratio === "free" ? null : Number(ratio);
    let width = source.naturalWidth;
    let height = source.naturalHeight;
    let sx = 0;
    let sy = 0;
    if (tool === "crop" && cropRatio) {
      if (width / height > cropRatio) { const croppedWidth = height * cropRatio; sx = (width - croppedWidth) / 2; width = croppedWidth; }
      else { const croppedHeight = width / cropRatio; sy = (height - croppedHeight) / 2; height = croppedHeight; }
    }
    const scale = Math.min(1, maxWidth / width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) { setMessage("브라우저에서 이미지 처리를 지원하지 않습니다."); return; }
    context.drawImage(source, sx, sy, width, height, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(source.src);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality / 100));
    if (!blob) { setMessage("이미지 변환에 실패했습니다."); return; }
    const extension = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${file.name.replace(/\.[^.]+$/, "")}-calcrule.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(`완료 · ${(blob.size / 1024).toFixed(0)}KB · ${canvas.width}×${canvas.height}px`);
  };

  return (
    <div>
      <p className="text-sm font-extrabold text-brand">이미지 작업실</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">이미지 압축·리사이즈·변환</h1>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">이미지를 브라우저에서 처리하고 JPG, PNG, WebP로 저장하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 text-center hover:bg-brand/10">
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} />
          <span className="text-3xl">🖼️</span><span className="mt-2 text-sm font-extrabold text-ink">이미지 선택</span><span className="mt-1 text-xs font-semibold text-slate-500">파일은 서버로 전송되지 않습니다.</span>
        </label>
        <FieldLabel label="작업"><select value={tool} onChange={(event) => setTool(event.target.value as ImageTool)} className="tool-input"><option value="compress">압축</option><option value="resize">크기 조절</option><option value="crop">가운데 자르기</option></select></FieldLabel>
        <FieldLabel label="출력 형식"><select value={format} onChange={(event) => setFormat(event.target.value as typeof format)} className="tool-input"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></FieldLabel>
        <FieldLabel label={`최대 가로 ${maxWidth}px`}><input type="range" min="320" max="4000" step="40" value={maxWidth} onChange={(event) => setMaxWidth(Number(event.target.value))} className="mt-3 w-full accent-brand" /></FieldLabel>
        <FieldLabel label={`품질 ${quality}%`}><input type="range" min="20" max="100" step="1" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-3 w-full accent-brand" /></FieldLabel>
        {tool === "crop" && <FieldLabel label="자르기 비율"><select value={ratio} onChange={(event) => setRatio(event.target.value)} className="tool-input"><option value="free">원본 비율</option><option value="1">1:1</option><option value="1.7777778">16:9</option><option value="1.3333333">4:3</option></select></FieldLabel>}
      </div>
      {preview && <img src={preview} alt="선택한 이미지 미리보기" className="mt-5 max-h-64 w-full rounded-2xl border border-line object-contain" />}
      <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={processImage} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white hover:bg-[#029b72]">변환 후 다운로드</button><span className="text-sm font-semibold text-slate-500">{message}</span></div>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-extrabold text-ink"><span>{label}</span>{children}</label>;
}

function JsonToolPanel() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const formatJson = (compact: boolean) => {
    try { setValue(JSON.stringify(JSON.parse(value), null, compact ? 0 : 2)); setMessage("JSON 형식이 정상입니다."); }
    catch { setMessage("JSON 문법을 확인하세요."); }
  };
  return <div><p className="text-sm font-extrabold text-brand">텍스트 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">JSON 정리 도구</h1><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder='{"name":"계산의정석"}' className="mt-6 min-h-72 w-full rounded-2xl border border-line bg-paper p-4 font-mono text-sm outline-none focus:border-brand"/><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => formatJson(false)} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white">예쁘게 정리</button><button type="button" onClick={() => formatJson(true)} className="rounded-full border border-line px-5 py-3 text-sm font-extrabold text-ink">압축</button><span className="self-center text-sm font-semibold text-slate-500">{message}</span></div></div>;
}

function TextToolPanel() {
  const [value, setValue] = useState("");
  const withoutSpaces = value.replace(/\s/g, "");
  return <div><p className="text-sm font-extrabold text-brand">텍스트 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">텍스트 카운터</h1><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder="텍스트를 입력하세요." className="mt-6 min-h-72 w-full rounded-2xl border border-line bg-paper p-4 text-sm outline-none focus:border-brand"/><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat label="글자 수" value={value.length} /><Stat label="공백 제외" value={withoutSpaces.length} /><Stat label="단어 수" value={value.trim() ? value.trim().split(/\s+/).length : 0} /><Stat label="줄 수" value={value ? value.split(/\r?\n/).length : 0} /></div></div>;
}

function DrawingToolPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#111827");
  const [size, setSize] = useState(6);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  };
  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    drawing.current = true;
    context.beginPath();
    context.moveTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = "round";
    canvas?.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  };
  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = "calcrule-drawing.png";
    anchor.click();
  };
  return <div><p className="text-sm font-extrabold text-brand">이미지 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">브라우저 그림판</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-600">메모나 주석을 그린 뒤 PNG로 저장하세요. 입력 내용은 브라우저에만 남습니다.</p><canvas ref={canvasRef} width={1200} height={650} onPointerDown={start} onPointerMove={move} onPointerUp={() => { drawing.current = false; }} onPointerLeave={() => { drawing.current = false; }} className="mt-6 h-auto w-full touch-none rounded-2xl border border-line bg-white" /><div className="mt-4 flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-sm font-extrabold text-ink">색상 <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-9 w-12 rounded border border-line" /></label><label className="flex items-center gap-2 text-sm font-extrabold text-ink">굵기 <input type="range" min="1" max="30" value={size} onChange={(event) => setSize(Number(event.target.value))} /></label><button type="button" onClick={clear} className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-ink">지우기</button><button type="button" onClick={download} className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white">PNG 저장</button></div></div>;
}

function YoutubeThumbnailPanel() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const extract = () => {
    try {
      const parsed = new URL(url.trim());
      const id = parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : parsed.searchParams.get("v") || parsed.pathname.match(/\/shorts\/([^/]+)/)?.[1] || parsed.pathname.match(/\/embed\/([^/]+)/)?.[1] || "";
      setVideoId(id?.slice(0, 11) || "");
    } catch { setVideoId(""); }
  };
  return <div><p className="text-sm font-extrabold text-brand">이미지 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">유튜브 썸네일 추출</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-600">유튜브 영상 URL에서 공개 썸네일 주소를 만들어 확인하고 저장합니다.</p><div className="mt-6 flex gap-2"><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand" /><button type="button" onClick={extract} className="rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white">추출</button></div>{videoId ? <div className="mt-6 grid gap-4 sm:grid-cols-2">{["maxresdefault", "hqdefault", "mqdefault", "default"].map((quality) => <ThumbnailCard key={quality} src={`https://i.ytimg.com/vi/${videoId}/${quality}.jpg`} label={quality} />)}</div> : <p className="mt-5 rounded-2xl bg-paper p-4 text-sm font-semibold text-slate-500">영상 URL을 입력하면 해상도별 썸네일이 표시됩니다.</p>}</div>;
}

function ThumbnailCard({ src, label }: { src: string; label: string }) {
  return <div className="overflow-hidden rounded-2xl border border-line bg-paper"><img src={src} alt={`${label} 유튜브 썸네일`} className="aspect-video w-full object-cover" /><div className="flex items-center justify-between gap-2 p-3"><span className="text-xs font-extrabold text-slate-500">{label}</span><a href={src} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-3 py-1.5 text-xs font-extrabold text-white">열기</a></div></div>;
}

function ImageMetadataPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const inspect = (next: File | undefined) => {
    if (!next || !next.type.startsWith("image/")) return;
    const image = new Image();
    image.onload = () => setSize({ width: image.naturalWidth, height: image.naturalHeight });
    image.src = URL.createObjectURL(next);
    setFile(next);
  };
  return <div><p className="text-sm font-extrabold text-brand">이미지 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">이미지 정보 확인</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-600">이미지의 파일 형식, 용량, 픽셀 크기와 비율을 확인합니다.</p><label className="mt-6 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 text-center"><input type="file" accept="image/*" className="sr-only" onChange={(event) => inspect(event.target.files?.[0])} /><span className="text-sm font-extrabold text-ink">이미지 선택</span><span className="mt-1 text-xs font-semibold text-slate-500">파일은 서버로 전송되지 않습니다.</span></label>{file && size && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">형식</span><strong className="mt-2 block text-lg text-ink">{file.type.replace("image/", "").toUpperCase()}</strong></div><Stat label="용량(KB)" value={Math.round(file.size / 1024)} /><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">픽셀</span><strong className="mt-2 block text-lg text-ink">{size.width}×{size.height}</strong></div><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">비율</span><strong className="mt-2 block text-lg text-ink">{(size.width / size.height).toFixed(2)}:1</strong></div></div>}</div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">{label}</span><strong className="mt-2 block text-2xl text-ink">{value.toLocaleString("ko-KR")}</strong></div>;
}

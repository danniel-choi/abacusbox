"use client";

// Browser-generated blob URLs and user-selected external thumbnails cannot be optimized by next/image.
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type ImageTool = "compress" | "resize" | "crop";
export type ToolboxTool = "image" | "json" | "text" | "drawing" | "youtube" | "metadata" | "developer" | "audio";

async function copyToClipboard(value: string, onSuccess: () => void, onFailure: () => void) {
  try {
    await navigator.clipboard.writeText(value);
    onSuccess();
  } catch {
    onFailure();
  }
}

export function ToolboxClient({ initialActive = "image" }: { initialActive?: ToolboxTool }) {
  const [active, setActive] = useState<ToolboxTool>(initialActive);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
        {active === "image" && <ImageToolPanel />}
        {active === "json" && <JsonToolPanel />}
        {active === "text" && <TextToolPanel />}
        {active === "drawing" && <DrawingToolPanel />}
        {active === "youtube" && <YoutubeThumbnailPanel />}
        {active === "metadata" && <ImageMetadataPanel />}
        {active === "developer" && <DeveloperToolsPanel />}
        {active === "audio" && <AudioConverterPanel />}
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
          <ToolTab active={active === "developer"} onClick={() => setActive("developer")} title="개발자 도구" description="JWT·타임스탬프·인코딩" />
          <ToolTab active={active === "audio"} onClick={() => setActive("audio")} title="오디오 변환" description="내 영상 파일을 MP3로 변환" />
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
  const [resizeUnit, setResizeUnit] = useState<"px" | "cm">("px");
  const [targetWidth, setTargetWidth] = useState(1200);
  const [targetHeight, setTargetHeight] = useState(800);
  const [resizeDpi, setResizeDpi] = useState(96);
  const [preserveAspect, setPreserveAspect] = useState(false);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [ratio, setRatio] = useState("free");
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [outputBaseName, setOutputBaseName] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [outputDimensions, setOutputDimensions] = useState({ width: 0, height: 0 });
  const [sourceDimensions, setSourceDimensions] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile || !nextFile.type.startsWith("image/")) {
      setMessage("이미지 파일만 선택할 수 있습니다.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    const nextPreview = URL.createObjectURL(nextFile);
    const image = new Image();
    image.onload = () => { setSourceDimensions({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(nextPreview); };
    image.onerror = () => URL.revokeObjectURL(nextPreview);
    image.src = nextPreview;
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setOutputUrl(null);
    setOutputName("");
    setOutputBaseName(nextFile.name.replace(/\.[^.]+$/, "") + "-calcrule");
    setOutputSize(0);
    setOutputDimensions({ width: 0, height: 0 });
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
    let outputWidth: number;
    let outputHeight: number;
    if (tool === "crop" && cropRatio) {
      if (width / height > cropRatio) { const croppedWidth = height * cropRatio; sx = (width - croppedWidth) / 2; width = croppedWidth; }
      else { const croppedHeight = width / cropRatio; sy = (height - croppedHeight) / 2; height = croppedHeight; }
    }
    if (tool === "resize") {
      const conversion = resizeUnit === "cm" ? resizeDpi / 2.54 : 1;
      outputWidth = Math.round(targetWidth * conversion);
      outputHeight = preserveAspect
        ? Math.round(outputWidth * (height / width))
        : Math.round(targetHeight * conversion);
      if (outputWidth < 1 || outputHeight < 1 || outputWidth > 10000 || outputHeight > 10000) {
        URL.revokeObjectURL(source.src);
        setMessage("가로·세로는 1~10,000 범위로 입력하세요.");
        return;
      }
    } else {
      const scale = Math.min(1, maxWidth / width);
      outputWidth = Math.max(1, Math.round(width * scale));
      outputHeight = Math.max(1, Math.round(height * scale));
    }
    const isQuarterTurn = rotation === 90 || rotation === 270;
    const canvas = document.createElement("canvas");
    canvas.width = isQuarterTurn ? outputHeight : outputWidth;
    canvas.height = isQuarterTurn ? outputWidth : outputHeight;
    const context = canvas.getContext("2d");
    if (!context) { setMessage("브라우저에서 이미지 처리를 지원하지 않습니다."); return; }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotation * Math.PI / 180);
    context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    context.drawImage(source, sx, sy, width, height, -outputWidth / 2, -outputHeight / 2, outputWidth, outputHeight);
    URL.revokeObjectURL(source.src);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality / 100));
    if (!blob) { setMessage("이미지 변환에 실패했습니다."); return; }
    const extension = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    const url = URL.createObjectURL(blob);
    const name = `${outputBaseName.trim() || file.name.replace(/\.[^.]+$/, "") + "-calcrule"}.${extension}`;
    setOutputUrl(url);
    setOutputName(name);
    setOutputSize(blob.size);
    setOutputDimensions({ width: canvas.width, height: canvas.height });
    const savingRate = file.size ? Math.round((1 - blob.size / file.size) * 100) : 0;
    setMessage(`완료 · ${(blob.size / 1024).toFixed(0)}KB · ${canvas.width}×${canvas.height}px · ${savingRate >= 0 ? `${savingRate}% 절감` : `${Math.abs(savingRate)}% 증가`}`);
  };

  const downloadResult = () => {
    if (!outputUrl || !outputName) return;
    const anchor = document.createElement("a");
    anchor.href = outputUrl;
    anchor.download = outputName;
    anchor.click();
  };

  return (
    <div>
      <p className="text-sm font-extrabold text-brand">이미지 작업실</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">이미지 압축·리사이즈·변환</h1>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">이미지를 브라우저에서 처리하고 JPG, PNG, WebP로 저장하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files?.[0]); }} className="sm:col-span-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 text-center hover:bg-brand/10">
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} />
          <span className="text-3xl">🖼️</span><span className="mt-2 text-sm font-extrabold text-ink">이미지 선택 또는 드래그앤드롭</span><span className="mt-1 text-xs font-semibold text-slate-500">파일은 서버로 전송되지 않습니다.</span>
        </label>
        <FieldLabel label="작업"><select value={tool} onChange={(event) => setTool(event.target.value as ImageTool)} className="tool-input"><option value="compress">압축</option><option value="resize">크기 조절</option><option value="crop">가운데 자르기</option></select></FieldLabel>
        <FieldLabel label="출력 형식"><select value={format} onChange={(event) => setFormat(event.target.value as typeof format)} className="tool-input"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></FieldLabel>
        <FieldLabel label="저장 파일명"><input value={outputBaseName} onChange={(event) => setOutputBaseName(event.target.value)} placeholder="파일명 입력" className="tool-input" /></FieldLabel>
        {tool === "resize" ? <>
          <div className="sm:col-span-2 rounded-2xl border border-brand/20 bg-brand/5 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldLabel label="단위"><select value={resizeUnit} onChange={(event) => setResizeUnit(event.target.value as typeof resizeUnit)} className="tool-input"><option value="px">픽셀 (px)</option><option value="cm">센티미터 (cm)</option></select></FieldLabel>
              <FieldLabel label="가로"><input type="number" min="1" max="10000" value={targetWidth} onChange={(event) => setTargetWidth(Number(event.target.value))} className="tool-input" /></FieldLabel>
              <FieldLabel label="세로"><input type="number" min="1" max="10000" value={targetHeight} onChange={(event) => setTargetHeight(Number(event.target.value))} disabled={preserveAspect} className="tool-input disabled:cursor-not-allowed disabled:bg-slate-100" /></FieldLabel>
              {resizeUnit === "cm" && <FieldLabel label="해상도 (DPI)"><input type="number" min="72" max="600" value={resizeDpi} onChange={(event) => setResizeDpi(Number(event.target.value))} className="tool-input" /></FieldLabel>}
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={preserveAspect} onChange={(event) => setPreserveAspect(event.target.checked)} /> 비율 유지 (가로 기준으로 세로 자동 계산)</label>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{resizeUnit === "cm" ? `${resizeDpi} DPI 기준으로 cm를 픽셀로 환산합니다. 인쇄소나 제출처가 지정한 DPI가 있다면 그 값을 입력하세요.` : "입력한 가로·세로 픽셀 크기로 정확히 변환합니다."}</p>
          </div>
        </> : <FieldLabel label={`최대 가로 ${maxWidth}px`}><input type="range" min="320" max="4000" step="40" value={maxWidth} onChange={(event) => setMaxWidth(Number(event.target.value))} className="mt-3 w-full accent-brand" /></FieldLabel>}
        <FieldLabel label={`품질 ${quality}%`}><input type="range" min="20" max="100" step="1" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-3 w-full accent-brand" /></FieldLabel>
        {tool === "crop" && <FieldLabel label="자르기 비율"><select value={ratio} onChange={(event) => setRatio(event.target.value)} className="tool-input"><option value="free">원본 비율</option><option value="1">1:1</option><option value="1.7777778">16:9</option><option value="1.3333333">4:3</option></select></FieldLabel>}
        <div className="sm:col-span-2 rounded-2xl border border-line bg-paper p-4"><p className="text-sm font-extrabold text-ink">방향 보정</p><div className="mt-3 flex flex-wrap gap-3"><FieldLabel label="회전"><select value={rotation} onChange={(event) => setRotation(Number(event.target.value) as typeof rotation)} className="tool-input"><option value={0}>없음</option><option value={90}>90° 오른쪽</option><option value={180}>180°</option><option value={270}>270° 오른쪽</option></select></FieldLabel><label className="flex items-center gap-2 text-sm font-extrabold text-ink"><input type="checkbox" checked={flipHorizontal} onChange={(event) => setFlipHorizontal(event.target.checked)} /> 좌우 반전</label><label className="flex items-center gap-2 text-sm font-extrabold text-ink"><input type="checkbox" checked={flipVertical} onChange={(event) => setFlipVertical(event.target.checked)} /> 상하 반전</label></div></div>
      </div>
      {preview && <img src={preview} alt="선택한 이미지 미리보기" className="mt-5 max-h-64 w-full rounded-2xl border border-line object-contain" />}
      <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={processImage} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white hover:bg-[#029b72]">변환하기</button>{outputUrl && <button type="button" onClick={downloadResult} className="rounded-full border border-brand px-5 py-3 text-sm font-extrabold text-brand">결과 다운로드</button>}<span className="text-sm font-semibold text-slate-500">{message}</span></div>
      {outputUrl && <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-extrabold text-ink">변환 결과 미리보기</p><p className="text-xs font-semibold text-slate-500">{outputName} · {outputDimensions.width}×{outputDimensions.height}px · {(outputSize / 1024).toFixed(0)}KB</p></div><div className="mt-4 grid gap-4 md:grid-cols-2"><div><p className="mb-2 text-xs font-extrabold text-slate-500">원본 · {sourceDimensions.width}×{sourceDimensions.height}px · {(file ? file.size / 1024 : 0).toFixed(0)}KB</p><img src={preview ?? ""} alt="원본 이미지 미리보기" className="max-h-64 w-full rounded-xl border border-line bg-white object-contain" /></div><div><p className="mb-2 text-xs font-extrabold text-brand">결과 · {outputDimensions.width}×{outputDimensions.height}px · {(outputSize / 1024).toFixed(0)}KB</p><img src={outputUrl} alt="변환된 이미지 미리보기" className="max-h-64 w-full rounded-xl border border-brand/30 bg-white object-contain" /></div></div></div>}
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
  const downloadJson = () => {
    if (!value) return;
    const blob = new Blob([value], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "calcrule-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <div><p className="text-sm font-extrabold text-brand">개발 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">JSON 정리 도구</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-600">JSON 문법을 확인하고 보기 좋게 정리하거나 한 줄로 압축하세요.</p><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder='{"name":"계산의정석"}' spellCheck={false} className="mt-6 min-h-72 w-full rounded-2xl border border-line bg-paper p-4 font-mono text-sm outline-none focus:border-brand"/><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => formatJson(false)} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white">예쁘게 정리</button><button type="button" onClick={() => formatJson(true)} className="rounded-full border border-line px-5 py-3 text-sm font-extrabold text-ink">압축</button><button type="button" onClick={() => setValue('{\n  "name": "계산의정석",\n  "tool": "json"\n}')} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink">예시</button><button type="button" onClick={() => copyToClipboard(value, () => setMessage("클립보드에 복사했습니다."), () => setMessage("클립보드 권한을 사용할 수 없습니다."))} disabled={!value} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink disabled:opacity-40">복사</button><button type="button" onClick={downloadJson} disabled={!value} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink disabled:opacity-40">JSON 저장</button><button type="button" onClick={() => { setValue(""); setMessage(""); }} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink">초기화</button><span className="self-center text-sm font-semibold text-slate-500">{message}</span></div></div>;
}

function TextToolPanel() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const withoutSpaces = value.replace(/\s/g, "");
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const byteCount = new TextEncoder().encode(value).length;
  return <div><p className="text-sm font-extrabold text-brand">텍스트 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">텍스트 카운터</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-600">공백 포함·제외 글자 수와 단어·줄·UTF-8 바이트 수를 확인하세요.</p><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder="텍스트를 입력하세요." className="mt-6 min-h-72 w-full rounded-2xl border border-line bg-paper p-4 text-sm outline-none focus:border-brand"/><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5"><Stat label="글자 수" value={value.length} /><Stat label="공백 제외" value={withoutSpaces.length} /><Stat label="단어 수" value={wordCount} /><Stat label="줄 수" value={value ? value.split(/\r?\n/).length : 0} /><Stat label="UTF-8 바이트" value={byteCount} /></div><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => copyToClipboard(value, () => setMessage("복사했습니다."), () => setMessage("클립보드 권한을 사용할 수 없습니다."))} disabled={!value} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white disabled:opacity-40">텍스트 복사</button><button type="button" onClick={() => setValue(value.split(/\r?\n/).map((line) => line.trim()).join("\n"))} disabled={!value} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink disabled:opacity-40">줄바꿈 정리</button><button type="button" onClick={() => setValue(value.trim())} disabled={!value} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink disabled:opacity-40">앞뒤 공백 제거</button><button type="button" onClick={() => { setValue(""); setMessage(""); }} className="rounded-full border border-line px-4 py-3 text-sm font-extrabold text-ink">초기화</button><span className="self-center text-sm font-semibold text-slate-500">{message}</span></div></div>;
}

function DrawingToolPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#111827");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [size, setSize] = useState(6);
  const [opacity, setOpacity] = useState(100);
  const [tool, setTool] = useState<"pen" | "eraser" | "line" | "arrow" | "rectangle" | "ellipse" | "text">("pen");
  const [fillShape, setFillShape] = useState(false);
  const [textValue, setTextValue] = useState("텍스트");
  const [textSize, setTextSize] = useState(32);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(650);
  const [showGrid, setShowGrid] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [exportQuality, setExportQuality] = useState(92);
  const [historyState, setHistoryState] = useState({ index: 0, length: 1 });
  const drawing = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const baseImage = useRef<ImageData | null>(null);
  const history = useRef<ImageData[]>([]);
  const historyIndex = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    history.current = [context.getImageData(0, 0, canvas.width, canvas.height)];
    historyIndex.current = 0;
    setHistoryState({ index: 0, length: 1 });
  }, [backgroundColor, canvasWidth, canvasHeight]);

  const syncHistory = () => setHistoryState({ index: historyIndex.current, length: history.current.length });
  const saveHistory = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(context.getImageData(0, 0, canvas.width, canvas.height));
    if (history.current.length > 25) history.current.shift();
    historyIndex.current = history.current.length - 1;
    syncHistory();
  };
  const restoreHistory = (index: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const image = history.current[index];
    if (!canvas || !context || !image) return;
    context.putImageData(image, 0, 0);
    historyIndex.current = index;
    syncHistory();
  };

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  };
  const setupStroke = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = tool === "eraser" ? backgroundColor : color;
    context.fillStyle = color;
    context.globalAlpha = opacity / 100;
    context.lineWidth = size;
    context.lineCap = "round";
    context.lineJoin = "round";
  };
  const drawArrow = (context: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const head = Math.max(10, size * 3);
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineTo(end.x - head * Math.cos(angle - Math.PI / 6), end.y - head * Math.sin(angle - Math.PI / 6));
    context.moveTo(end.x, end.y);
    context.lineTo(end.x - head * Math.cos(angle + Math.PI / 6), end.y - head * Math.sin(angle + Math.PI / 6));
  };
  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const { x, y } = point(event);
    if (tool === "text") {
      context.globalAlpha = opacity / 100;
      context.fillStyle = color;
      context.font = `${textSize}px sans-serif`;
      context.textBaseline = "top";
      context.fillText(textValue || "텍스트", x, y);
      context.globalAlpha = 1;
      saveHistory();
      return;
    }
    drawing.current = true;
    startPoint.current = { x, y };
    baseImage.current = context.getImageData(0, 0, canvas.width, canvas.height);
    setupStroke(context);
    context.beginPath();
    context.moveTo(x, y);
    canvas.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    if (tool === "pen" || tool === "eraser") {
      setupStroke(context);
      context.lineTo(x, y);
      context.stroke();
      return;
    }
    if (!baseImage.current) return;
    context.putImageData(baseImage.current, 0, 0);
    setupStroke(context);
    context.beginPath();
    const startPointValue = startPoint.current;
    if (tool === "line") {
      context.moveTo(startPointValue.x, startPointValue.y);
      context.lineTo(x, y);
      context.stroke();
    } else if (tool === "arrow") {
      drawArrow(context, startPointValue, { x, y });
      context.stroke();
    } else if (tool === "rectangle") {
      const width = x - startPointValue.x;
      const height = y - startPointValue.y;
      if (fillShape) context.fillRect(startPointValue.x, startPointValue.y, width, height);
      context.strokeRect(startPointValue.x, startPointValue.y, width, height);
    } else if (tool === "ellipse") {
      const centerX = (startPointValue.x + x) / 2;
      const centerY = (startPointValue.y + y) / 2;
      context.ellipse(centerX, centerY, Math.abs(x - startPointValue.x) / 2, Math.abs(y - startPointValue.y) / 2, 0, 0, Math.PI * 2);
      if (fillShape) context.fill();
      context.stroke();
    }
    context.globalAlpha = 1;
  };
  const finish = (event?: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    if (event && canvasRef.current?.hasPointerCapture(event.pointerId)) canvasRef.current.releasePointerCapture(event.pointerId);
    if (canvasRef.current) { const context = canvasRef.current.getContext("2d"); if (context) context.globalAlpha = 1; }
    saveHistory();
    baseImage.current = null;
  };
  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.globalAlpha = 1;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = `image/${exportFormat}`;
    const extension = exportFormat === "jpeg" ? "jpg" : exportFormat;
    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL(mime, exportQuality / 100);
    anchor.download = `calcrule-drawing.${extension}`;
    anchor.click();
  };

  return <div>
    <p className="text-sm font-extrabold text-brand">이미지 도구</p>
    <h1 className="mt-2 text-2xl font-extrabold text-ink">브라우저 그림판</h1>
    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">주석, 스케치, 화면 설명을 브라우저에서 만들고 PNG·JPG·WebP로 저장하세요. 입력 내용은 브라우저에만 남습니다.</p>
    <div className="mt-6 grid gap-3 rounded-2xl bg-paper p-4 sm:grid-cols-2 lg:grid-cols-4">
      <FieldLabel label="캔버스 너비"><input type="number" min="320" max="2400" value={canvasWidth} onChange={(event) => setCanvasWidth(Math.min(2400, Math.max(320, Number(event.target.value) || 320)))} className="tool-input" /></FieldLabel>
      <FieldLabel label="캔버스 높이"><input type="number" min="200" max="1600" value={canvasHeight} onChange={(event) => setCanvasHeight(Math.min(1600, Math.max(200, Number(event.target.value) || 200)))} className="tool-input" /></FieldLabel>
      <label className="flex items-center gap-2 text-sm font-extrabold text-ink">배경색 <input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} className="h-10 w-14 rounded border border-line" /></label>
      <label className="flex items-center gap-2 text-sm font-extrabold text-ink"><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /> 격자 보기</label>
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-paper p-3"><label className="flex items-center gap-2 text-sm font-extrabold text-ink">도구<select value={tool} onChange={(event) => setTool(event.target.value as typeof tool)} className="tool-input w-auto py-2"><option value="pen">펜</option><option value="eraser">지우개</option><option value="line">직선</option><option value="arrow">화살표</option><option value="rectangle">사각형</option><option value="ellipse">타원</option><option value="text">텍스트</option></select></label><label className="flex items-center gap-2 text-sm font-extrabold text-ink">색상 <input type="color" value={color} onChange={(event) => setColor(event.target.value)} disabled={tool === "eraser"} className="h-9 w-12 rounded border border-line disabled:opacity-50" /></label><label className="flex items-center gap-2 text-sm font-extrabold text-ink">굵기 <input type="range" min="1" max="40" value={size} onChange={(event) => setSize(Number(event.target.value))} /></label><label className="flex items-center gap-2 text-sm font-extrabold text-ink">투명도 {opacity}% <input type="range" min="10" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label>{(tool === "rectangle" || tool === "ellipse") && <label className="flex items-center gap-2 text-sm font-extrabold text-ink"><input type="checkbox" checked={fillShape} onChange={(event) => setFillShape(event.target.checked)} /> 채우기</label>}{tool === "text" && <><input value={textValue} onChange={(event) => setTextValue(event.target.value)} placeholder="캔버스에 넣을 텍스트" className="tool-input min-w-44 py-2" /><label className="flex items-center gap-2 text-sm font-extrabold text-ink">글자 크기 <input type="range" min="12" max="96" value={textSize} onChange={(event) => setTextSize(Number(event.target.value))} /></label></>}</div>
    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-line p-3"><label className="flex items-center gap-2 text-sm font-extrabold text-ink">저장 형식<select value={exportFormat} onChange={(event) => setExportFormat(event.target.value as typeof exportFormat)} className="tool-input w-auto py-2"><option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option></select></label><label className="flex items-center gap-2 text-sm font-extrabold text-ink">저장 품질 {exportQuality}% <input type="range" min="50" max="100" value={exportQuality} onChange={(event) => setExportQuality(Number(event.target.value))} /></label><span className="text-xs font-semibold text-slate-500">캔버스 크기 변경과 배경색은 초기화 후 적용됩니다.</span></div>
    <div className="relative mt-4 overflow-hidden rounded-2xl"><canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onPointerLeave={(event) => { if (tool === "pen" || tool === "eraser") finish(event); }} className="block h-auto w-full touch-none rounded-2xl border border-line bg-white" />{showGrid && <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl opacity-30" style={{ backgroundImage: "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)", backgroundSize: "24px 24px" }} />}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => restoreHistory(historyIndex.current - 1)} disabled={historyState.index <= 0} className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-ink disabled:cursor-not-allowed disabled:opacity-40">실행취소</button><button type="button" onClick={() => restoreHistory(historyIndex.current + 1)} disabled={historyState.index >= historyState.length - 1} className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-ink disabled:cursor-not-allowed disabled:opacity-40">다시실행</button><button type="button" onClick={clear} className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-ink">초기화</button><button type="button" onClick={download} className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white">{exportFormat.toUpperCase()} 저장</button><span className="text-xs font-semibold text-slate-500">히스토리 {historyState.index + 1}/{historyState.length}</span></div>
  </div>;
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
  return <div className="overflow-hidden rounded-2xl border border-line bg-paper"><img src={src} alt={`${label} 유튜브 썸네일`} className="aspect-video w-full object-cover" /><div className="flex flex-wrap items-center justify-between gap-2 p-3"><span className="text-xs font-extrabold text-slate-500">{label}</span><div className="flex gap-2"><button type="button" onClick={() => copyToClipboard(src, () => undefined, () => undefined)} className="rounded-full border border-line px-3 py-1.5 text-xs font-extrabold text-ink">URL 복사</button><a href={src} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-3 py-1.5 text-xs font-extrabold text-white">열기</a></div></div></div>;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function formatDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function DeveloperToolsPanel() {
  const [jwt, setJwt] = useState("");
  const [jwtHeader, setJwtHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");
  const [jwtMessage, setJwtMessage] = useState("");
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [timestampDate, setTimestampDate] = useState("");
  const [timestampMessage, setTimestampMessage] = useState("");
  const [encodingValue, setEncodingValue] = useState("");
  const [encodingMode, setEncodingMode] = useState<"base64" | "url">("base64");
  const [encodingAction, setEncodingAction] = useState<"encode" | "decode">("encode");
  const [encodingResult, setEncodingResult] = useState("");
  const [encodingMessage, setEncodingMessage] = useState("");

  const decodeJwt = () => {
    const parts = jwt.trim().split(".");
    if (parts.length !== 3) {
      setJwtHeader("");
      setJwtPayload("");
      setJwtMessage("JWT는 헤더·페이로드·서명 3개 영역이어야 합니다.");
      return;
    }
    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      setJwtHeader(JSON.stringify(header, null, 2));
      setJwtPayload(JSON.stringify(payload, null, 2));
      setJwtMessage("헤더와 페이로드를 해석했습니다. 서명 검증은 수행하지 않습니다.");
    } catch {
      setJwtHeader("");
      setJwtPayload("");
      setJwtMessage("JWT 형식 또는 Base64URL 인코딩을 확인하세요.");
    }
  };

  const convertTimestamp = () => {
    const seconds = Number(timestamp.trim());
    if (!Number.isFinite(seconds)) {
      setTimestampMessage("유효한 Unix timestamp를 입력하세요.");
      return;
    }
    const date = new Date(seconds * 1000);
    if (Number.isNaN(date.getTime())) {
      setTimestampMessage("날짜로 변환할 수 없는 값입니다.");
      return;
    }
    setTimestampDate(formatDateTimeLocal(date));
    setTimestampMessage(`${date.toLocaleString("ko-KR")} · ${date.toISOString()}`);
  };

  const setCurrentTimestamp = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
    setTimestampMessage("");
  };

  const convertDateToTimestamp = () => {
    const date = new Date(timestampDate);
    if (!timestampDate || Number.isNaN(date.getTime())) {
      setTimestampMessage("변환할 날짜와 시간을 선택하세요.");
      return;
    }
    setTimestamp(Math.floor(date.getTime() / 1000).toString());
    setTimestampMessage("선택한 날짜를 Unix timestamp로 변환했습니다.");
  };

  const transformEncoding = () => {
    try {
      const result = encodingMode === "base64"
        ? encodingAction === "encode" ? encodeBase64(encodingValue) : decodeBase64(encodingValue.trim())
        : encodingAction === "encode" ? encodeURIComponent(encodingValue) : decodeURIComponent(encodingValue);
      setEncodingResult(result);
      setEncodingMessage("변환했습니다.");
    } catch {
      setEncodingResult("");
      setEncodingMessage("입력값의 인코딩 형식을 확인하세요.");
    }
  };

  return <div>
    <p className="text-sm font-extrabold text-brand">개발·운영 도구</p>
    <h1 className="mt-2 text-2xl font-extrabold text-ink">전문가용 개발자 도구</h1>
    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">JWT 구조 확인, Unix timestamp 변환, Base64·URL 인코딩을 브라우저에서 처리합니다. 입력값은 서버로 전송되지 않습니다.</p>

    <section className="mt-6 rounded-2xl border border-line p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-extrabold text-ink">JWT 디코더</h2><span className="text-xs font-semibold text-slate-500">서명 검증 없음</span></div>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">토큰의 헤더와 페이로드만 읽습니다. 비밀번호·운영 토큰은 입력하지 마세요.</p>
      <textarea value={jwt} onChange={(event) => setJwt(event.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." spellCheck={false} className="mt-4 min-h-28 w-full rounded-xl border border-line bg-paper p-3 font-mono text-sm outline-none focus:border-brand" />
      <div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" onClick={decodeJwt} disabled={!jwt.trim()} className="rounded-full bg-brand px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-40">디코드</button><span className="text-sm font-semibold text-slate-500">{jwtMessage}</span></div>
      {(jwtHeader || jwtPayload) && <div className="mt-4 grid gap-3 lg:grid-cols-2"><CodeOutput label="Header" value={jwtHeader} /><CodeOutput label="Payload" value={jwtPayload} /></div>}
    </section>

    <section className="mt-5 rounded-2xl border border-line p-5">
      <h2 className="text-lg font-extrabold text-ink">Unix timestamp 변환기</h2>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">초 단위 Unix timestamp와 한국 시간 기준 날짜를 서로 변환합니다.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input value={timestamp} onChange={(event) => setTimestamp(event.target.value)} inputMode="numeric" className="tool-input" /><div className="flex flex-wrap gap-2"><button type="button" onClick={convertTimestamp} className="rounded-full bg-brand px-4 py-2.5 text-sm font-extrabold text-white">날짜로 변환</button><button type="button" onClick={setCurrentTimestamp} className="rounded-full border border-line px-4 py-2.5 text-sm font-extrabold text-ink">현재 시각</button></div></div>
      <div className="mt-3 flex flex-wrap items-center gap-3"><input type="datetime-local" value={timestampDate} onChange={(event) => setTimestampDate(event.target.value)} className="tool-input" /><button type="button" onClick={convertDateToTimestamp} disabled={!timestampDate} className="rounded-full border border-line px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-40">timestamp로 변환</button></div>
      <p className="mt-3 text-sm font-semibold text-slate-500">{timestampMessage}</p>
    </section>

    <section className="mt-5 rounded-2xl border border-line p-5">
      <h2 className="text-lg font-extrabold text-ink">Base64·URL 인코더</h2>
      <div className="mt-4 flex flex-wrap gap-3"><select value={encodingMode} onChange={(event) => setEncodingMode(event.target.value as typeof encodingMode)} className="tool-input w-auto"><option value="base64">Base64</option><option value="url">URL encoding</option></select><select value={encodingAction} onChange={(event) => setEncodingAction(event.target.value as typeof encodingAction)} className="tool-input w-auto"><option value="encode">인코딩</option><option value="decode">디코딩</option></select></div>
      <textarea value={encodingValue} onChange={(event) => setEncodingValue(event.target.value)} placeholder="변환할 값을 입력하세요." spellCheck={false} className="mt-4 min-h-24 w-full rounded-xl border border-line bg-paper p-3 font-mono text-sm outline-none focus:border-brand" />
      <div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" onClick={transformEncoding} disabled={!encodingValue} className="rounded-full bg-brand px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-40">변환</button>{encodingResult && <button type="button" onClick={() => copyToClipboard(encodingResult, () => setEncodingMessage("결과를 복사했습니다."), () => setEncodingMessage("클립보드 권한을 사용할 수 없습니다."))} className="rounded-full border border-line px-4 py-2.5 text-sm font-extrabold text-ink">결과 복사</button>}<span className="text-sm font-semibold text-slate-500">{encodingMessage}</span></div>
      {encodingResult && <textarea readOnly value={encodingResult} className="mt-4 min-h-24 w-full rounded-xl border border-brand/30 bg-brand/5 p-3 font-mono text-sm outline-none" />}
    </section>
  </div>;
}

function CodeOutput({ label, value }: { label: string; value: string }) {
  return <div><div className="mb-2 flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span><button type="button" onClick={() => copyToClipboard(value, () => undefined, () => undefined)} className="text-xs font-extrabold text-brand">복사</button></div><textarea readOnly value={value} className="min-h-48 w-full rounded-xl border border-line bg-paper p-3 font-mono text-xs outline-none" /></div>;
}

function AudioConverterPanel() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<"128k" | "192k" | "320k">("192k");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [converting, setConverting] = useState(false);

  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const selectFile = (nextFile: File | undefined) => {
    if (!nextFile || !(nextFile.type.startsWith("video/") || nextFile.type.startsWith("audio/"))) {
      setStatus("MP4·WebM·MOV 등 영상 또는 오디오 파일을 선택하세요.");
      return;
    }
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(nextFile);
    setResultUrl(null);
    setResultName("");
    setProgress(0);
    setStatus(`${nextFile.name} · ${(nextFile.size / 1024 / 1024).toFixed(1)}MB`);
  };

  const convert = async () => {
    if (!file) {
      setStatus("먼저 변환할 파일을 선택하세요.");
      return;
    }
    setConverting(true);
    setProgress(0);
    setStatus("변환 엔진을 준비하는 중입니다. 처음 실행할 때 시간이 걸릴 수 있습니다.");
    try {
      const ffmpeg = ffmpegRef.current ?? new FFmpeg();
      ffmpegRef.current = ffmpeg;
      if (!ffmpeg.loaded) {
        ffmpeg.on("progress", ({ progress: nextProgress }) => setProgress(Math.min(99, Math.round(nextProgress * 100))));
        const coreVersion = "0.12.10";
        const baseURL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${coreVersion}/dist/umd`;
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
        });
      }
      const inputName = `input-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const outputName = `${file.name.replace(/\.[^.]+$/, "") || "audio"}-calcrule.mp3`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      setStatus("오디오 트랙을 MP3로 변환하는 중입니다.");
      await ffmpeg.exec(["-i", inputName, "-vn", "-codec:a", "libmp3lame", "-b:a", quality, outputName]);
      const data = await ffmpeg.readFile(outputName);
      const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "audio/mpeg" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultName(outputName);
      setProgress(100);
      setStatus(`변환 완료 · ${(blob.size / 1024 / 1024).toFixed(1)}MB · ${quality}`);
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (error) {
      console.error(error);
      setStatus("변환에 실패했습니다. 파일 형식이나 브라우저 메모리를 확인하세요.");
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!resultUrl || !resultName) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = resultName;
    anchor.click();
  };

  return <div>
    <p className="text-sm font-extrabold text-brand">오디오 도구</p>
    <h1 className="mt-2 text-2xl font-extrabold text-ink">MP4·영상 파일 → MP3 변환</h1>
    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">직접 보유하거나 변환 권한이 있는 영상 파일의 오디오 트랙을 MP3로 변환합니다. 파일은 서버로 업로드되지 않고 브라우저에서 처리됩니다.</p>
    <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="mt-6 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 text-center hover:bg-brand/10">
      <input type="file" accept="video/*,audio/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
      <span className="text-3xl">🎧</span><span className="mt-2 text-sm font-extrabold text-ink">영상 또는 오디오 파일 선택</span><span className="mt-1 text-xs font-semibold text-slate-500">MP4·WebM·MOV·M4A · 브라우저에서만 처리</span>
    </label>
    <div className="mt-5 grid gap-4 sm:grid-cols-2"><FieldLabel label="MP3 비트레이트"><select value={quality} onChange={(event) => setQuality(event.target.value as typeof quality)} className="tool-input"><option value="128k">128 kbps · 용량 절약</option><option value="192k">192 kbps · 일반 권장</option><option value="320k">320 kbps · 고음질</option></select></FieldLabel><div className="flex items-end"><p className="text-sm font-semibold text-slate-500">{file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)}MB` : "파일을 선택하면 변환할 수 있습니다."}</p></div></div>
    <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={convert} disabled={!file || converting} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">{converting ? "변환 중…" : "MP3로 변환"}</button>{resultUrl && <button type="button" onClick={download} className="rounded-full border border-brand px-5 py-3 text-sm font-extrabold text-brand">MP3 다운로드</button>}<span className="text-sm font-semibold text-slate-500">{status}</span></div>
    {converting && <div className="mt-4"><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs font-semibold text-slate-500">진행률 {progress}%</p></div>}
    {resultUrl && <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-4"><p className="text-sm font-extrabold text-ink">변환 결과 미리듣기</p><audio controls src={resultUrl} className="mt-3 w-full" /><p className="mt-3 text-xs font-semibold text-slate-500">{resultName}</p></div>}
    <p className="mt-5 rounded-2xl bg-paper p-4 text-xs font-semibold leading-5 text-slate-500">저작권이 있는 콘텐츠나 다운로드 권한이 없는 영상의 변환·재배포는 금지될 수 있습니다. YouTube 링크를 입력해 다운로드하는 기능은 제공하지 않습니다.</p>
  </div>;
}

function ImageMetadataPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState<{ width: number; height: number; orientation: string } | null>(null);
  const inspect = (next: File | undefined) => {
    if (!next || !next.type.startsWith("image/")) return;
    const image = new Image();
    const objectUrl = URL.createObjectURL(next);
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      setSize({ width, height, orientation: width === height ? "정사각형" : width > height ? "가로형" : "세로형" });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      setSize(null);
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
    setFile(next);
  };
  return <div><p className="text-sm font-extrabold text-brand">이미지 도구</p><h1 className="mt-2 text-2xl font-extrabold text-ink">이미지 정보 확인</h1><p className="mt-3 text-sm font-medium leading-6 text-slate-600">이미지의 파일명, 형식, 용량, 픽셀 크기와 방향을 브라우저에서 확인합니다.</p><label className="mt-6 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 text-center"><input type="file" accept="image/*" className="sr-only" onChange={(event) => inspect(event.target.files?.[0])} /><span className="text-sm font-extrabold text-ink">이미지 선택</span><span className="mt-1 text-xs font-semibold text-slate-500">파일은 서버로 전송되지 않습니다.</span></label>{file && size && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">파일명</span><strong className="mt-2 block truncate text-sm text-ink" title={file.name}>{file.name}</strong></div><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">형식·용량</span><strong className="mt-2 block text-sm text-ink">{file.type.replace("image/", "").toUpperCase()} · {Math.round(file.size / 1024).toLocaleString("ko-KR")}KB</strong></div><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">픽셀</span><strong className="mt-2 block text-lg text-ink">{size.width}×{size.height}</strong></div><div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">방향·비율</span><strong className="mt-2 block text-sm text-ink">{size.orientation} · {(size.width / size.height).toFixed(2)}:1</strong></div></div>}</div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-paper p-4"><span className="block text-xs font-extrabold text-slate-500">{label}</span><strong className="mt-2 block text-2xl text-ink">{value.toLocaleString("ko-KR")}</strong></div>;
}

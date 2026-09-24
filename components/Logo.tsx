import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="계산의정석 홈">
      <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${inverted ? "bg-white" : "bg-ink"}`}>
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="17" height="17" rx="5" fill={inverted ? "#02B585" : "#02B585"} />
          <path d="M7 9.4h9M7 13.2h5.7M14.4 13.2h1.6M7 16.9h2.1M11.1 16.9h4.9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15.2 5.8l2 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`text-xl font-extrabold tracking-normal ${inverted ? "text-white" : "text-ink"}`}>
        계산의정석
      </span>
    </Link>
  );
}

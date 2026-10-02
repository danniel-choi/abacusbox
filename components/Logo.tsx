import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="계산의정석 계산의 정석 홈">
      <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${inverted ? "bg-white" : "bg-ink"}`}>
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
          <circle cx="12.5" cy="12.3" r="9" fill="#02B585" />
          <path d="M7.5 14.2c0-3.2 2.2-5.5 5-5.5s5 2.3 5 5.5v1.5c0 1.4-1.1 2.5-2.5 2.5h-5c-1.4 0-2.5-1.1-2.5-2.5v-1.5Z" fill="white" />
          <path d="M9.1 13.6c0-1.7 1.4-3.1 3.1-3.1h.6c1.7 0 3.1 1.4 3.1 3.1v.4c0 .8-.6 1.4-1.4 1.4h-4c-.8 0-1.4-.6-1.4-1.4v-.4Z" fill="#040713" />
          <path d="M10.6 13.8h3.8" stroke="#02B585" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6.3 12.2 4.7 11M18.7 12.2l1.6-1.2M9 19.2l-1.1 1.5M16 19.2l1.1 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="18.2" cy="6.8" r="1.1" fill="white" />
          <circle cx="5.6" cy="6.4" r=".7" fill="white" opacity=".72" />
        </svg>
      </span>
      <span className={`text-xl font-extrabold tracking-normal ${inverted ? "text-white" : "text-ink"}`}>
        계산의정석
      </span>
      <span className="sr-only">계산의 정석</span>
    </Link>
  );
}

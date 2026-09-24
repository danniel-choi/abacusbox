export function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function formatManwon(value: number) {
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value: number, digits = 2) {
  return `${value.toFixed(digits)}%`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function floorToTen(value: number) {
  return Math.floor(value / 10) * 10;
}

export function formatYearRange(
  premiered: string | null,
  ended: string | null,
) {
  const start = yearOf(premiered);
  const end = yearOf(ended);
  if (!start) return "";
  if (!end || end === "Present") return `${start}–`;
  if (start === end) return `${start}`;
  return `${start}–${end}`;
}

function yearOf(date: string | null) {
  if (!date) return null;
  const m = date.match(/^(\d{4})/);
  return m ? m[1] : null;
}

export function stripHtml(value: string | null) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitGenres(value: string | string[] | null | undefined) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((g) => g.trim()).filter(Boolean);
  }
  return value
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

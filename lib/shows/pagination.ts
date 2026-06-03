export function sanitizePage(page: number): number {
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}

export function sanitizePageSize(pageSize: number, fallback: number): number {
  const size = Math.max(1, Math.floor(pageSize)) || fallback;
  return size;
}

export function pageOffset(page: number, pageSize: number): number {
  return (sanitizePage(page) - 1) * sanitizePageSize(pageSize, pageSize);
}

const MIN_SEARCH_QUERY_LENGTH = 2;

function escapeIlikePattern(term: string): string {
  return term.replace(/[%_\\]/g, (char) => `\\${char}`);
}

export function normalizeSearchQuery(query: string): string | null {
  const trimmed = query.trim();
  if (trimmed.length < MIN_SEARCH_QUERY_LENGTH) {
    return null;
  }

  return trimmed;
}

export function buildIlikeNamePattern(query: string): string {
  return `%${escapeIlikePattern(query)}%`;
}

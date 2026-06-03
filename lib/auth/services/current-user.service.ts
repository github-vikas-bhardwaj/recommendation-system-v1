import { hashSessionToken } from "../hash-token";
import type { CurrentUser, SessionRecord } from "../types";

export type ResolveCurrentUserDeps = {
  findSessionByHash: (tokenHash: string) => Promise<SessionRecord | null>;
  findUserById: (userId: number) => Promise<CurrentUser | null>;
  deleteSessionByHash: (tokenHash: string) => Promise<void>;
  now?: () => number;
};

export async function resolveCurrentUser(
  token: string | undefined,
  deps: ResolveCurrentUserDeps,
): Promise<CurrentUser | null> {
  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);
  const now = deps.now ?? Date.now;

  const session = await deps.findSessionByHash(tokenHash);
  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() < now()) {
    await deps.deleteSessionByHash(tokenHash);
    return null;
  }

  return deps.findUserById(session.user_id);
}

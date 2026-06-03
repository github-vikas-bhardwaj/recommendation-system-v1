import { SESSION_DURATION_SECONDS } from "../constants";
import { generateSessionToken, hashSessionToken } from "../hash-token";
import type { SessionInsert } from "../types";

export type CreateSessionDeps = {
  insertSession: (session: SessionInsert) => Promise<void>;
  setSessionCookie: (token: string) => void;
  generateToken?: () => string;
  now?: () => number;
};

export async function createUserSession(
  userId: number,
  deps: CreateSessionDeps,
): Promise<void> {
  const generateToken = deps.generateToken ?? generateSessionToken;
  const now = deps.now ?? Date.now;

  const token = generateToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(
    now() + SESSION_DURATION_SECONDS * 1000,
  ).toISOString();

  await deps.insertSession({
    token_hash: tokenHash,
    user_id: userId,
    expires_at: expiresAt,
  });

  deps.setSessionCookie(token);
}

export type DestroySessionDeps = {
  deleteSessionByHash: (tokenHash: string) => Promise<void>;
};

export async function destroyUserSession(
  rawToken: string,
  deps: DestroySessionDeps,
): Promise<void> {
  await deps.deleteSessionByHash(hashSessionToken(rawToken));
}

import { afterEach, describe, expect, it, vi } from "vitest";

import { getAppEnvConfig, getAppEnvironment, usesSecureCookies } from "./app";

describe("getAppEnvironment", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers explicit APP_ENV", () => {
    vi.stubEnv("APP_ENV", "testing");
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "production");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("VERCEL_ENV", "production");

    expect(getAppEnvironment()).toBe("testing");
  });

  it("falls back to NEXT_PUBLIC_APP_ENV on the client", () => {
    vi.stubEnv("APP_ENV", "");
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "production");
    vi.stubEnv("VERCEL", "");

    expect(getAppEnvironment()).toBe("production");
  });

  it("returns local when not on Vercel and APP_ENV is unset", () => {
    vi.stubEnv("APP_ENV", "");
    vi.stubEnv("VERCEL", "");

    expect(getAppEnvironment()).toBe("local");
  });

  it("returns production on Vercel production when APP_ENV is unset", () => {
    vi.stubEnv("APP_ENV", "");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("VERCEL_ENV", "production");

    expect(getAppEnvironment()).toBe("production");
  });

  it("returns testing for other Vercel environments", () => {
    vi.stubEnv("APP_ENV", "");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("VERCEL_ENV", "preview");

    expect(getAppEnvironment()).toBe("testing");
  });
});

describe("getAppEnvConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns production hints", () => {
    vi.stubEnv("APP_ENV", "production");

    expect(getAppEnvConfig()).toMatchObject({
      appEnv: "production",
      isProduction: true,
      isLocal: false,
      isTesting: false,
      supabaseProjectHint: "recommendation-system-v1 (production Supabase)",
    });
  });
});

describe("usesSecureCookies", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false only for local", () => {
    vi.stubEnv("APP_ENV", "local");
    expect(usesSecureCookies()).toBe(false);

    vi.stubEnv("APP_ENV", "testing");
    expect(usesSecureCookies()).toBe(true);
  });
});

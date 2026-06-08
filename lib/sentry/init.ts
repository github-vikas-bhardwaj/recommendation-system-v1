import * as Sentry from "@sentry/nextjs";

import { getAppEnvironment } from "@/lib/env/app";

const SENTRY_DSN =
  "https://e87ea7081c4b84917300120491d93650@o4511529203007488.ingest.de.sentry.io/4511529203335248";

export function isSentryEnabled(): boolean {
  return getAppEnvironment() === "production";
}

export function initSentry(): void {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: getAppEnvironment(),
    tracesSampleRate: 0.1,
    enableLogs: true,
    sendDefaultPii: true,
  });
}

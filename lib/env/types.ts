export type AppEnvironment = "local" | "testing" | "production";

export type AppEnvConfig = {
  appEnv: AppEnvironment;
  isLocal: boolean;
  isTesting: boolean;
  isProduction: boolean;
  /** Human-readable hint for error messages and docs. */
  supabaseProjectHint: string;
};

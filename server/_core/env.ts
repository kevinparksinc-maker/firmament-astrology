const isProduction = process.env.NODE_ENV === "production";
const configuredCookieSecret = (process.env.MANUS_JWT_SECRET || process.env.JWT_SECRET || "").trim();
if (isProduction && configuredCookieSecret.length < 32) {
  throw new Error("Set MANUS_JWT_SECRET or JWT_SECRET to a unique value of at least 32 characters before starting in production.");
}

export const ENV = {
  appId: process.env.MANUS_PROJECT_ID ?? process.env.VITE_APP_ID ?? "firmament-guardian",
  cookieSecret: configuredCookieSecret || "firmament-guardian-development-only-secret",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.MANUS_OAUTH_API_URL ?? process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction,
  manusApiUrl: process.env.MANUS_API_URL ?? "",
  manusApiKey: process.env.MANUS_API_KEY ?? "",
  manusApiBrowserKey: process.env.MANUS_API_BROWSER_KEY ?? "",
  forgeApiUrl: process.env.MANUS_API_URL ?? process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.MANUS_API_KEY ?? process.env.BUILT_IN_FORGE_API_KEY ?? "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  openaiApiBase: process.env.OPENAI_API_BASE ?? process.env.OPENAI_BASE_URL ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
};

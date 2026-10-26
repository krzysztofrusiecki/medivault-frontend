const DEFAULT_API_BASE_URL = "http://localhost:3000/api";

// A blank value in .env (`VITE_API_BASE_URL=`) falls back to the default too.
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

export const apiBaseUrl: string =
  configuredApiBaseUrl === "" ? DEFAULT_API_BASE_URL : configuredApiBaseUrl;

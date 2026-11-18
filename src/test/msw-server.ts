import { setupServer } from "msw/node";

// Starts with no handlers: each test declares the backend responses it needs via `server.use(...)`.
export const server = setupServer();

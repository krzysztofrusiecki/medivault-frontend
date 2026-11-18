import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./msw-server";

// `onUnhandledFrame: "error"` only rejects the fetch, which app code may catch;
// collecting the requests and throwing in afterEach makes the test itself fail.
const unhandledRequests: string[] = [];

beforeAll(() => {
  server.events.on("request:unhandled", ({ request }) => {
    unhandledRequests.push(`${request.method} ${request.url}`);
  });
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();

  const requests = unhandledRequests.splice(0);
  if (requests.length > 0) {
    throw new Error(`Requests without an MSW handler:\n${requests.join("\n")}`);
  }
});

afterAll(() => {
  server.close();
});

// jsdom doesn't implement scrolling; the router calls it on navigation.
window.scrollTo = vi.fn();

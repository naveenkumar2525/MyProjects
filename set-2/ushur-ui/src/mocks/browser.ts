import { setupWorker } from "msw";
import defaultHandlers from "./handlers/defaultHandlers";

export const worker = setupWorker(...defaultHandlers);

const workerPromise = worker.start({
  // eslint-disable-next-line complexity
  onUnhandledRequest(req) {
    if (
      req.url.href.endsWith(".hot-update.json") ||
      req.url.href.endsWith(".hot-update.js")
    ) {
      // Don't generate warnings for hot module updates
      return;
    }

    if (
      req.url.href.startsWith("/favicon.ico") ||
      req.url.href.startsWith("/manifest.json")
    ) {
      // Don't generate warnings for local assets
      return;
    }

    if (req.url.href.includes("userpilot.io")) {
      // Don't generate warnings for userpiliot.io
      return;
    }

    if (req.url.href.startsWith("chrome-extension:")) {
      // Don't generate warnings for chrome extensions
      return;
    }
    const msg = `[MSW] Warning: captured a request without a matching request handler:

    ${req.method} ${req.url.href}

If this is intentional, please create an exception in the file src/mocks/browser.ts.

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`;

    // eslint-disable-next-line no-console
    console.error(msg);
  },
});

const browserWorkerPromise = process.env.REACT_APP_CI
  ? Promise.resolve()
  : workerPromise;

export default browserWorkerPromise;

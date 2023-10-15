import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

class Alerting {
  constructor() {
    if (this.isEnabled()) {
      Sentry.init({
        dsn: "https://e659c2e895d44b6ba5b1b247136ce846@o4503962522550272.ingest.sentry.io/4503962523467776",
        // Add RRWeb only if we want video recording for all exceptions
        // Disabled for now until we figure out pricing for Sentry
        integrations: [new BrowserTracing() /* new SentryRRWeb() */],

        tracesSampleRate: 1.0,
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isEnabled(): boolean {
    return process.env.NODE_ENV === "production";
  }

  // eslint-disable-next-line class-methods-use-this
  captureMessage(message: string) {
    Sentry.captureMessage(message);
  }

  // eslint-disable-next-line class-methods-use-this
  captureException(err: Error) {
    Sentry.captureException(err);
  }
}

export default new Alerting();

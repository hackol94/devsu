export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Execution environment: dev | stg | prod */
      ENV: 'stg' | 'prod' | 'dev';

      /** Browser to use for UI tests */
      BROWSER: 'chrome_latest' | 'firefox' | 'Safari';

      /** Cucumber tag filter (e.g. "@smoke") */
      TAGS: string;

      /** Base URL of the UI application */
      BASEURL: string;

      /** Base URL for API endpoints */
      API_BASE_URL: string;

      // ─── UI credentials ──────────────────────────────────────────────────────
      USER_EMAIL: string;
      USER_PASS: string;

      // ─── API keys ─────────────────────────────────────────────────────────────
      REQRES_API_KEY: string;

      // ─── Viewport ────────────────────────────────────────────────────────────
      /** Enable custom viewport size */
      viewPort: 'true' | 'false';
      viewPort_width: string;
      viewPort_height: string;

      // ─── LambdaTest ──────────────────────────────────────────────────────────
      /** Set to "true" to run tests on LambdaTest */
      ltDevice: 'true' | 'false';
      LT_USERNAME: string;
      LT_ACCESS_KEY: string;

      // ─── Mock system ─────────────────────────────────────────────────────────
      /** Set to "true" to enable mock schema validation & update */
      updateSchema: 'true' | 'false';

      // ─── Report / misc ───────────────────────────────────────────────────────
      HEAD: 'true' | 'false';
    }
  }
}

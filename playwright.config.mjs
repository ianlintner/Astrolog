import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 120_000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:4187',
        viewport: { width: 1280, height: 720 },
        trace: 'retain-on-failure',
    },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
    webServer: {
        command: 'node scripts/serve-subpath.mjs',
        url: 'http://127.0.0.1:4187/astrolog/',
        reuseExistingServer: false,
        timeout: 30_000,
    },
});

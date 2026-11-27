import { expect, test } from '@playwright/test';

const URL = '/astrolog/?seed=42&test=1';

test('core loop: seed, build a route, advance time, save and reset', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) =>
        failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`)
    );
    page.on('response', (response) => {
        if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });
    page.on('dialog', (dialog) => dialog.accept());

    await page.clock.install();
    await page.goto(URL);
    await page.waitForFunction(
        () => window.__astrolog?.starSystemManager?.starSystems?.length === 100
    );

    const welcome = page.locator('#welcome-modal');
    await expect(welcome).toBeVisible();
    await welcome.locator('.start-button').click();
    await expect(welcome).toBeHidden();

    // Find a system with a profitable route to an existing depot that is also on screen.
    const plan = await page.evaluate(() => {
        const game = window.__astrolog;
        const { starSystemManager, gameState, renderer, canvas } = game;
        const rect = canvas.getBoundingClientRect();
        const depotIds = starSystemManager.starSystems
            .filter((sys) => gameState.getDepotCount(sys.id) > 0)
            .map((sys) => sys.id);
        const candidates = [];

        for (const system of starSystemManager.starSystems) {
            const screen = renderer.worldToScreen(system.x, system.y);
            const point = { x: rect.left + screen.x, y: rect.top + screen.y };
            if (
                point.x < 10 ||
                point.y < 10 ||
                point.x > rect.right - 10 ||
                point.y > rect.bottom - 10
            ) {
                continue;
            }
            for (const depotId of depotIds) {
                const depot = starSystemManager.getSystem(depotId);
                for (const exportGood of system.exports) {
                    const importGood = depot.imports.find((good) => good.id === exportGood.id);
                    if (
                        importGood &&
                        importGood.price > exportGood.price &&
                        starSystemManager.findPath(system.id, depotId)
                    ) {
                        candidates.push({
                            systemId: system.id,
                            systemName: system.name,
                            from: system.id,
                            to: depotId,
                            good: exportGood.id,
                            profit: importGood.price - exportGood.price,
                            point,
                        });
                    }
                }
            }
        }
        candidates.sort((a, b) => b.profit - a.profit);
        return candidates[0] || null;
    });
    expect(plan, 'expected a visible system with a profitable route to a depot').not.toBeNull();

    await page.mouse.click(plan.point.x, plan.point.y);
    await expect(page.locator('#selected-system')).toContainText(plan.systemName);

    await page.locator('#btn-buy-depot').click();
    expect(
        await page.evaluate((id) => window.__astrolog.gameState.getDepotCount(id), plan.systemId)
    ).toBe(1);

    const spareVehicleId = await page.evaluate(
        () => window.__astrolog.vehicleManager.getAvailableVehicles()[0].id
    );
    await page.locator('#route-from').selectOption(String(plan.from));
    await page.locator('#route-to').selectOption(String(plan.to));
    await page.locator('#route-good').selectOption(plan.good);
    await page.locator('#route-vehicle').selectOption(String(spareVehicleId));
    await page.locator('#btn-create-route').click();
    await expect(page.locator('#route-count')).toHaveText('2');

    const readStats = () =>
        page.evaluate(() => ({
            day: window.__astrolog.gameState.day,
            credits: window.__astrolog.gameState.credits,
        }));
    const before = await readStats();
    await page.clock.runFor(60_000);
    const after = await readStats();
    expect(after.day).toBeGreaterThanOrEqual(12);
    expect(after.credits).toBeGreaterThan(before.credits);
    await expect(page.locator('#day')).toHaveText(String(after.day));

    await page.locator('#btn-save-game').click();
    const saved = await readStats();
    await page.reload();
    await page.waitForFunction(
        () => window.__astrolog?.starSystemManager?.starSystems?.length === 100
    );
    expect(await readStats()).toEqual(saved);

    // Reload restores the welcome overlay too; dismiss it before using the panel.
    const welcomeAfterReload = page.locator('#welcome-modal');
    if (await welcomeAfterReload.isVisible()) {
        await welcomeAfterReload.locator('.start-button').click();
    }

    await page.locator('#btn-reset-game').click();
    await page.waitForFunction(() => window.__astrolog?.gameState?.day === 1);
    await expect(page.locator('#day')).toHaveText('1');

    expect(consoleErrors, `console errors: ${consoleErrors.join('; ')}`).toEqual([]);
    expect(pageErrors, `page errors: ${pageErrors.join('; ')}`).toEqual([]);
    expect(failedRequests, `failed requests: ${failedRequests.join('; ')}`).toEqual([]);
});

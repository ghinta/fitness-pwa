import { expect, test } from '@playwright/test';

test('serves hash routes and the installable PWA below the repository path', async ({
  page,
}) => {
  await page.goto('./#/verlauf');

  await expect(page.getByRole('heading', { name: 'Verlauf' })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/fitness-pwa/');
  expect(new URL(page.url()).hash).toBe('#/verlauf');

  const manifestHref = await page
    .locator('link[rel="manifest"]')
    .getAttribute('href');
  expect(manifestHref).not.toBeNull();

  const manifestUrl = new URL(manifestHref!, page.url());
  expect(manifestUrl.pathname).toBe('/fitness-pwa/manifest.webmanifest');

  const manifest = await page.evaluate(async (url) => {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        `Manifest konnte nicht geladen werden: ${response.status}`,
      );
    return (await response.json()) as {
      id: string;
      start_url: string;
      scope: string;
      icons: Array<{ src: string }>;
    };
  }, manifestUrl.href);

  expect(manifest.id).toBe('/fitness-pwa/');
  expect(manifest.start_url).toBe('/fitness-pwa/#/');
  expect(manifest.scope).toBe('/fitness-pwa/');
  expect(manifest.icons).not.toHaveLength(0);
  for (const icon of manifest.icons) {
    expect(new URL(icon.src, manifestUrl).pathname).toMatch(
      /^\/fitness-pwa\/icons\//,
    );
  }

  const registration = await page.evaluate(async () => {
    const ready = await navigator.serviceWorker.ready;
    return {
      scope: ready.scope,
      scriptURL: ready.active?.scriptURL ?? '',
    };
  });

  expect(new URL(registration.scope).pathname).toBe('/fitness-pwa/');
  expect(new URL(registration.scriptURL).pathname).toBe('/fitness-pwa/sw.js');

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Verlauf' })).toBeVisible();
  expect(
    await page.evaluate(() => navigator.serviceWorker.controller !== null),
  ).toBe(true);

  const cachedShell = await page.evaluate(async (scope) => {
    const scopePath = new URL(scope).pathname;
    let indexResponse: Response | undefined;
    for (const cacheName of await caches.keys()) {
      const cache = await caches.open(cacheName);
      const indexRequest = (await cache.keys()).find((request) => {
        const path = new URL(request.url).pathname;
        return path === scopePath || path === `${scopePath}index.html`;
      });
      if (indexRequest) {
        indexResponse = await cache.match(indexRequest);
        break;
      }
    }
    const assetUrls = Array.from(
      document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>(
        'script[src], link[rel="stylesheet"]',
      ),
      (element) =>
        element instanceof HTMLScriptElement ? element.src : element.href,
    );
    const assetResponses = await Promise.all(
      assetUrls.map((url) => caches.match(url)),
    );
    return {
      hasIndex: indexResponse?.ok ?? false,
      hasAllAssets: assetResponses.every((response) => response?.ok),
    };
  }, registration.scope);

  expect(cachedShell).toEqual({ hasIndex: true, hasAllAssets: true });
});

test('opens the active-workout hash route directly below the Pages URL', async ({
  page,
}) => {
  await page.goto('./#/training');

  expect(page.url()).toBe('http://127.0.0.1:4173/fitness-pwa/#/training');
  await expect(
    page.getByRole('heading', { name: 'Kein aktives Training' }),
  ).toBeVisible();
});

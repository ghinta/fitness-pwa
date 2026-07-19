import { createSettingsView } from '../views/settings-view';
import { createStartView } from '../views/start-view';
import { createHistoryView } from '../views/history-view';

export const routes = {
  '/': createStartView,
  '/verlauf': createHistoryView,
  '/einstellungen': createSettingsView,
} as const;

export type RoutePath = keyof typeof routes;

export interface Router {
  resolve(): RoutePath;
  start(): void;
  stop(): void;
}

export function resolveRoute(hash: string): RoutePath {
  const path = hash.replace(/^#/, '').split('?')[0] || '/';
  return path in routes ? (path as RoutePath) : '/';
}

export function createRouter(outlet: HTMLElement): Router {
  const render = (): RoutePath => {
    const route = resolveRoute(window.location.hash);
    outlet.replaceChildren(routes[route]());
    document.title = `${outlet.querySelector('h1')?.textContent ?? 'Fitness'} · Fitness PWA`;
    return route;
  };

  return {
    resolve: render,
    start(): void {
      window.addEventListener('hashchange', render);
      render();
    },
    stop(): void {
      window.removeEventListener('hashchange', render);
    },
  };
}

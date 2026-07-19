import { createRouter, type Router } from './router';
import { createNavigation } from '../components/navigation';

export interface App {
  start(): void;
  stop(): void;
}

export function createApp(root: HTMLElement): App {
  root.replaceChildren();

  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = '#main-content';
  skipLink.textContent = 'Zum Inhalt springen';

  const header = document.createElement('header');
  header.className = 'app-header';
  const brand = document.createElement('span');
  brand.className = 'app-brand';
  brand.textContent = 'Fitness PWA';
  header.append(brand);

  const main = document.createElement('main');
  main.id = 'main-content';
  main.className = 'app-content';
  main.tabIndex = -1;

  const router: Router = createRouter(main);
  const navigation = createNavigation(() => router.resolve());
  root.append(skipLink, header, main, navigation);

  return {
    start(): void {
      router.start();
    },
    stop(): void {
      router.stop();
    },
  };
}

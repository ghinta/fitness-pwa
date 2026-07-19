import type { RoutePath } from '../app/router';

const links: ReadonlyArray<{ path: RoutePath; label: string }> = [
  { path: '/', label: 'Start' },
  { path: '/verlauf', label: 'Verlauf' },
  { path: '/einstellungen', label: 'Einstellungen' },
];

export function createNavigation(onNavigate: () => RoutePath): HTMLElement {
  const navigation = document.createElement('nav');
  navigation.className = 'bottom-navigation';
  navigation.ariaLabel = 'Hauptnavigation';

  for (const { path, label } of links) {
    const anchor = document.createElement('a');
    anchor.href = `#${path}`;
    anchor.textContent = label;
    anchor.addEventListener('click', () => {
      window.setTimeout(onNavigate, 0);
    });
    navigation.append(anchor);
  }

  return navigation;
}

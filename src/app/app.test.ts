import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from './app';

describe('application shell', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('renders the German shell and primary navigation', () => {
    const root = document.createElement('div');
    const app = createApp(root);
    app.start();

    expect(root.querySelector('header')?.textContent).toContain('Fitness PWA');
    expect(root.querySelector('main h1')?.textContent).toBe('Start');
    expect(
      [...root.querySelectorAll('nav a')].map((link) => link.textContent),
    ).toEqual(['Start', 'Verlauf', 'Einstellungen']);

    app.stop();
  });
});

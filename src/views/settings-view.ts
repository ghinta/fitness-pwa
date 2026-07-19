import { createPlaceholderView } from './view';

export function createSettingsView(): HTMLElement {
  return createPlaceholderView(
    'Einstellungen',
    'Trainingsvorlagen und lokale Daten werden später hier verwaltet.',
  );
}

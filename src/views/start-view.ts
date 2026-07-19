import { createPlaceholderView } from './view';

export function createStartView(): HTMLElement {
  return createPlaceholderView(
    'Start',
    'Hier kannst du später Training A oder Training B beginnen.',
  );
}

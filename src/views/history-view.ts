import { createPlaceholderView } from './view';

export function createHistoryView(): HTMLElement {
  return createPlaceholderView(
    'Verlauf',
    'Deine abgeschlossenen Trainings werden später hier angezeigt.',
  );
}

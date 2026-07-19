import { createNavigation, updateNavigation } from '../components/navigation';
import { button, element, statusMessage } from '../components/dom';
import { BackupService } from '../services/backup-service';
import { FitnessService } from '../services/fitness-service';
import {
  createRepositories,
  FitnessDatabase,
  openFitnessDatabase,
} from '../storage';
import { createHistoryView } from '../views/history-view';
import { createSettingsView } from '../views/settings-view';
import { createStartView } from '../views/start-view';
import type { ViewContext, ViewFactory } from '../views/context';
import { createWorkoutView } from '../views/workout-view';
import { resolveRoute } from './router';
import { setupPwaUpdates } from './pwa-update';

export interface App {
  start(): Promise<void>;
  stop(): void;
}

export interface AppDependencies {
  database?: FitnessDatabase;
  fitness?: FitnessService;
  backup?: BackupService;
  registerUpdates?: typeof setupPwaUpdates;
}

const views: Record<ReturnType<typeof resolveRoute>, ViewFactory> = {
  '/': createStartView,
  '/training': createWorkoutView,
  '/verlauf': createHistoryView,
  '/einstellungen': createSettingsView,
};

export function createApp(
  root: HTMLElement,
  dependencies: AppDependencies = {},
): App {
  root.replaceChildren();
  let stopped = false;
  let rendering = 0;
  let dirty = false;
  let activeWorkout = false;
  let fitness = dependencies.fitness;
  let backup = dependencies.backup;

  const skipLink = element('a', {
    className: 'skip-link',
    text: 'Zum Inhalt springen',
  });
  skipLink.href = '#main-content';
  const header = element('header', { className: 'app-header' });
  const headerInner = element('div', { className: 'app-header__inner' });
  headerInner.append(
    element('span', { className: 'app-brand', text: 'Fitness PWA' }),
  );
  header.append(headerInner);
  const updateHost = element('div', { className: 'system-messages' });
  const main = element('main', {
    className: 'app-content',
    id: 'main-content',
  });
  main.tabIndex = -1;
  const navigation = createNavigation();
  root.append(skipLink, header, updateHost, main, navigation);

  const refresh = async (): Promise<void> => render();
  const context = (): ViewContext => {
    if (!fitness || !backup)
      throw new Error('Die Anwendung ist nicht initialisiert.');
    return {
      fitness,
      backup,
      refresh,
      setDirty(value) {
        dirty = value;
      },
    };
  };

  const render = async (): Promise<void> => {
    const renderId = ++rendering;
    main.ariaBusy = 'true';
    main.replaceChildren(
      element('p', { className: 'loading', text: 'Laden …' }),
    );
    try {
      if (!fitness) throw new Error('Die lokale Datenbank ist nicht bereit.');
      const active = await fitness.getActiveWorkout();
      if (renderId !== rendering || stopped) return;
      activeWorkout = active !== undefined;
      navigation.hidden = resolveRoute(window.location.hash) === '/training';
      const view = await views[resolveRoute(window.location.hash)](context());
      if (renderId !== rendering || stopped) return;
      main.replaceChildren(view);
      main.removeAttribute('aria-busy');
      updateNavigation(navigation);
      document.title = `${view.querySelector('h1')?.textContent ?? 'Fitness'} · Fitness PWA`;
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (error) {
      main.removeAttribute('aria-busy');
      main.replaceChildren(createFailure(error, () => void render()));
    }
  };

  const onHashChange = (): void => {
    if (dirty) {
      const stay = !window.confirm('Nicht gespeicherte Eingaben verwerfen?');
      if (stay) {
        window.history.forward();
        return;
      }
      dirty = false;
    }
    void render();
  };
  const onBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (dirty) event.preventDefault();
  };
  let disposeUpdates = (): void => undefined;

  return {
    async start(): Promise<void> {
      window.addEventListener('hashchange', onHashChange);
      window.addEventListener('beforeunload', onBeforeUnload);
      try {
        if (!fitness || !backup) {
          const database = await openFitnessDatabase(
            dependencies.database ?? new FitnessDatabase(),
          );
          const repositories = createRepositories(database);
          fitness ??= new FitnessService(repositories);
          backup ??= new BackupService(repositories.snapshots);
        }
        disposeUpdates = (dependencies.registerUpdates ?? setupPwaUpdates)(
          updateHost,
          () => !activeWorkout && !dirty,
        );
        await render();
      } catch (error) {
        main.replaceChildren(createFailure(error, () => void this.start()));
      }
    },
    stop(): void {
      stopped = true;
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
      disposeUpdates();
    },
  };
}

function createFailure(error: unknown, retry: () => void): HTMLElement {
  const section = element('section', { className: 'card stack storage-error' });
  section.append(
    element('h1', { text: 'Lokaler Speicher nicht verfügbar' }),
    statusMessage(
      error instanceof Error
        ? error.message
        : 'Die lokalen Daten konnten nicht geöffnet werden. Es wurden keine Daten gelöscht.',
      'error',
    ),
    element('p', {
      text: 'Prüfe den privaten Browsermodus oder freien Gerätespeicher und versuche es erneut. Die App setzt die Datenbank niemals automatisch zurück.',
    }),
  );
  const action = button('Erneut versuchen', 'button button--primary');
  action.addEventListener('click', retry);
  section.append(action);
  return section;
}

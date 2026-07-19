import { registerSW } from 'virtual:pwa-register';
import { button, element, statusMessage } from '../components/dom';

export function setupPwaUpdates(
  host: HTMLElement,
  mayActivate: () => boolean,
): () => void {
  let disposed = false;
  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (disposed) return;
      const banner = element('aside', { className: 'update-banner' });
      banner.setAttribute('role', 'status');
      const copy = element('div');
      copy.append(
        element('strong', { text: 'Update verfügbar' }),
        element('span', {
          text: 'Die neue Version kann sicher geladen werden.',
        }),
      );
      const action = button('Jetzt aktualisieren', 'button button--small');
      action.addEventListener('click', () => {
        if (!mayActivate()) {
          banner.append(
            statusMessage(
              'Das Update wartet, bis das aktive Training beendet oder sicher verlassen wurde.',
            ),
          );
          return;
        }
        action.disabled = true;
        void updateServiceWorker(true);
      });
      banner.append(copy, action);
      host.replaceChildren(banner);
    },
    onOfflineReady() {
      if (disposed) return;
      host.replaceChildren(
        statusMessage('Die App ist jetzt offline verfügbar.', 'success'),
      );
      window.setTimeout(() => {
        if (!disposed) host.replaceChildren();
      }, 5000);
    },
    onRegisterError() {
      // Storage and workout behavior remain available even if registration fails.
    },
  });
  return () => {
    disposed = true;
  };
}

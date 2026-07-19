import { beforeEach, describe, expect, it } from 'vitest';
import {
  getRegisterOptions,
  getUpdateCalls,
  resetPwaRegisterMock,
} from '../test/pwa-register-mock';
import { setupPwaUpdates } from './pwa-update';

describe('PWA update prompt', () => {
  beforeEach(() => resetPwaRegisterMock());

  it('defers activation while workout state may be at risk', () => {
    const host = document.createElement('div');
    setupPwaUpdates(host, () => false);

    getRegisterOptions().onNeedRefresh?.();
    host.querySelector('button')?.click();

    expect(host.textContent).toContain('Update verfügbar');
    expect(host.textContent).toContain('aktive Training');
    expect(getUpdateCalls()).toBe(0);
  });

  it('activates an explicitly accepted safe update', () => {
    const host = document.createElement('div');
    setupPwaUpdates(host, () => true);

    getRegisterOptions().onNeedRefresh?.();
    host.querySelector('button')?.click();

    expect(host.querySelector('button')?.disabled).toBe(true);
    expect(getUpdateCalls()).toBe(1);
  });
});

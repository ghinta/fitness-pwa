export interface RegisterOptions {
  onNeedRefresh?(): void;
  onOfflineReady?(): void;
  onRegisterError?(error: unknown): void;
}

let options: RegisterOptions | undefined;
let updateCalls = 0;
export const updateWorkerMock = (): Promise<void> => {
  updateCalls += 1;
  return Promise.resolve();
};

export function registerSW(
  nextOptions: RegisterOptions,
): typeof updateWorkerMock {
  options = nextOptions;
  return updateWorkerMock;
}

export function getRegisterOptions(): RegisterOptions {
  if (!options) throw new Error('Service worker was not registered.');
  return options;
}

export function getUpdateCalls(): number {
  return updateCalls;
}

export function resetPwaRegisterMock(): void {
  options = undefined;
  updateCalls = 0;
}

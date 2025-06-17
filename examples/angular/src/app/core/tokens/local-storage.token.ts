import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
const noop = (): any => {};

const FALLBACK_STORAGE = {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  clear: noop,
  key: noop,
  length: 0,
} satisfies Storage;

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    if (isBrowser) {
      return localStorage;
    }

    return FALLBACK_STORAGE;
  },
});

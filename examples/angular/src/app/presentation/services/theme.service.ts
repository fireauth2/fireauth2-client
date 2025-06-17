import {
  DOCUMENT,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';
import { LOCAL_STORAGE } from '../../core/tokens';

const THEME_STORAGE_KEY = 'theme';

export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly localStorage = inject(LOCAL_STORAGE);
  private readonly renderer: Renderer2;

  currentTheme = signal<AppTheme | undefined>(undefined);

  constructor(rendererFactory2: RendererFactory2) {
    this.renderer = rendererFactory2.createRenderer(null, null);
    const currentTheme = this.localStorage.getItem(THEME_STORAGE_KEY) as never;
    this.currentTheme.set(currentTheme);
  }

  setLightTheme() {
    this.setTheme(AppTheme.LIGHT);
  }

  setDarkTheme() {
    this.setTheme(AppTheme.DARK);
  }

  setSystemTheme() {
    this.setTheme(null);
  }

  private setTheme(theme: AppTheme | null) {
    this.removeClass(AppTheme.LIGHT, AppTheme.DARK);

    if (theme == null) {
      theme = this.getThemeFromSystemPreference();
    }

    this.localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.currentTheme.set(theme);
    this.addClass(theme);
  }

  private getThemeFromSystemPreference(): AppTheme {
    return this.matchesColorScheme(AppTheme.DARK)
      ? AppTheme.DARK
      : AppTheme.LIGHT;
  }

  private matchesColorScheme(theme: AppTheme): boolean {
    return matchMedia(`(prefers-color-scheme: ${theme})`).matches;
  }

  private addClass(...classNames: string[]): void {
    classNames.forEach((className) =>
      this.renderer.addClass(this.document.documentElement, className),
    );
  }

  private removeClass(...classNames: string[]): void {
    classNames.forEach((className) =>
      this.renderer.removeClass(this.document.documentElement, className),
    );
  }
}

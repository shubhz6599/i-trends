import { Injectable, signal } from '@angular/core';

type ThemePreference = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly isDarkMode = signal(false);
  readonly usesSystemPreference = signal(true);
  private readonly preferenceKey = 'itrends-theme';
  private readonly mediaQuery = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  constructor() {
    const savedPreference = this.getSavedPreference();
    if (savedPreference) {
      this.applyPreference(savedPreference);
    } else {
      this.applySystemPreference();
    }

    this.mediaQuery?.addEventListener('change', event => {
      if (this.usesSystemPreference()) {
        this.isDarkMode.set(event.matches);
        this.removeThemeOverride();
      }
    });

    window.addEventListener('storage', event => {
      if (event.key === this.preferenceKey) {
        const preference = this.parsePreference(event.newValue);
        if (preference) {
          this.applyPreference(preference);
        } else {
          this.applySystemPreference();
        }
      }
    });
  }

  toggleTheme(): void {
    if (this.usesSystemPreference()) {
      this.applyPreference(this.isDarkMode() ? 'light' : 'dark');
    } else {
      this.useSystemPreference();
    }
  }

  useSystemPreference(): void {
    localStorage.removeItem(this.preferenceKey);
    this.applySystemPreference();
  }

  private applySystemPreference(): void {
    this.usesSystemPreference.set(true);
    this.isDarkMode.set(this.mediaQuery?.matches ?? false);
    this.removeThemeOverride();
  }

  private applyPreference(preference: ThemePreference): void {
    this.usesSystemPreference.set(false);
    this.isDarkMode.set(preference === 'dark');
    document.documentElement.dataset['theme'] = preference;
    localStorage.setItem(this.preferenceKey, preference);
  }

  private removeThemeOverride(): void {
    delete document.documentElement.dataset['theme'];
  }

  private getSavedPreference(): ThemePreference | null {
    return this.parsePreference(localStorage.getItem(this.preferenceKey));
  }

  private parsePreference(value: string | null): ThemePreference | null {
    return value === 'light' || value === 'dark' ? value : null;
  }
}

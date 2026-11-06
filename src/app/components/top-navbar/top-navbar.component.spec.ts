import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

import { TopNavbarComponent } from './top-navbar.component';

describe('TopNavbarComponent', () => {
  let component: TopNavbarComponent;
  let fixture: ComponentFixture<TopNavbarComponent>;

  beforeEach(() => {
    localStorage.removeItem('itrends-theme');
    delete document.documentElement.dataset['theme'];
    TestBed.configureTestingModule({
      imports: [TopNavbarComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the system theme by default and lets a user return to it', () => {
    const theme = TestBed.inject(ThemeService);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    expect(theme.usesSystemPreference()).toBeTrue();
    expect(theme.isDarkMode()).toBe(systemPrefersDark);
    expect(document.documentElement.dataset['theme']).toBeUndefined();

    component.toggleTheme();
    expect(theme.usesSystemPreference()).toBeFalse();
    expect(localStorage.getItem('itrends-theme')).toBe(theme.isDarkMode() ? 'dark' : 'light');

    component.toggleTheme();
    expect(theme.usesSystemPreference()).toBeTrue();
    expect(localStorage.getItem('itrends-theme')).toBeNull();
  });

  it('toggles the mobile navigation menu state', () => {
    component.toggleMenu();

    expect(component.isMenuOpen).toBeTrue();

    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
  });
});

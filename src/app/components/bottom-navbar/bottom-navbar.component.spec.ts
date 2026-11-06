import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

import { BottomNavbarComponent } from './bottom-navbar.component';

describe('BottomNavbarComponent', () => {
  let component: BottomNavbarComponent;
  let fixture: ComponentFixture<BottomNavbarComponent>;

  beforeEach(() => {
    localStorage.removeItem('itrends-theme');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    delete document.documentElement.dataset['theme'];
    TestBed.configureTestingModule({
      imports: [BottomNavbarComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(BottomNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a contact popover and closes it with Escape', () => {
    component.toggleOptions();
    fixture.detectChanges();

    expect(component.showContactOptions).toBeTrue();

    component.closeContactOptionsOnEscape();
    fixture.detectChanges();

    expect(component.showContactOptions).toBeFalse();
  });

  it('shares the theme control state with the top navigation', () => {
    const theme = TestBed.inject(ThemeService);

    component.toggleTheme();
    fixture.detectChanges();

    expect(theme.usesSystemPreference()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.theme-nav-link')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.theme-nav-link .nav-text').textContent.trim()).toBe('System');

    component.toggleTheme();
    fixture.detectChanges();
    expect(theme.usesSystemPreference()).toBeTrue();
  });

  it('disables Account while a user session is stored', () => {
    fixture.destroy();
    localStorage.setItem('jwtToken', 'test-token');
    localStorage.setItem('user', JSON.stringify({ email: 'user@example.com' }));
    fixture = TestBed.createComponent(BottomNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(TestBed.inject(AuthService).isAuthenticated()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.account-link').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('a[routerLink="/auth"]')).toBeNull();
  });

  it('keeps Account navigable when no user session is stored', () => {
    expect(fixture.nativeElement.querySelector('a[routerLink="/auth"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.account-link')).toBeNull();
  });
});

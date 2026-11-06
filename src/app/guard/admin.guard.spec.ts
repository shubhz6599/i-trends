import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminGuard, provideHttpClient(), provideRouter([])]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(AdminGuard)).toBeTruthy();
  });
});

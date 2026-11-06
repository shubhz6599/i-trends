import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    });
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an accessible eyewear-themed loading indicator', async () => {
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loader-container')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.bi-eyeglasses')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.loader-container').getAttribute('role')).toBe('status');
  });
});

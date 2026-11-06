import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PaymentProcessComponent } from './payment-process.component';

describe('PaymentProcessComponent', () => {
  let component: PaymentProcessComponent;
  let fixture: ComponentFixture<PaymentProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentProcessComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(PaymentProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

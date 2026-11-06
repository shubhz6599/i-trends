import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { AdminDashboardComponent } from './admin-dashboard.component';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let orderService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    orderService = jasmine.createSpyObj<AuthService>('AuthService', [
      'getAdminOrders',
      'updateStatus',
      'exportOrdersToExcel'
    ]);
    orderService.getAdminOrders.and.returnValue(of({ orders: [] }));

    TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [{ provide: AuthService, useValue: orderService }]
    });
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the order filters and summary cards', () => {
    expect(fixture.nativeElement.querySelectorAll('.summary-card').length).toBe(3);
    expect(fixture.nativeElement.querySelector('input[type="search"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('input[name="fromDate"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('input[name="toDate"]')).not.toBeNull();
  });

  it('shows order and item information in the responsive order card', () => {
    const orders = [{
      _id: 'order-1',
      userId: { name: 'Test customer', email: 'customer@example.com' },
      items: [{
        name: 'Everyday frames',
        quantity: 2,
        productType: 'Eyeglasses',
        mainOption: 'Single vision',
        subOption: 'Anti-glare'
      }],
      totalAmount: 2499,
      status: 'processing',
      selectedStatus: 'processing'
    }];
    orderService.getAdminOrders.and.returnValue(of({ orders }));
    const ordersFixture = TestBed.createComponent(AdminDashboardComponent);
    ordersFixture.detectChanges();

    const orderCard: HTMLElement | null = ordersFixture.nativeElement.querySelector('.order-card');
    expect(orderCard).not.toBeNull();
    expect(orderCard?.textContent).toContain('Test customer');
    expect(orderCard?.textContent).toContain('Everyday frames');
    expect(orderCard?.textContent).toContain('Anti-glare');
    expect(orderCard?.querySelector('select')).not.toBeNull();
  });

  it('shows a retryable error state when loading orders fails', () => {
    spyOn(console, 'error');
    orderService.getAdminOrders.and.returnValue(throwError(() => new Error('Request failed')));
    const errorFixture = TestBed.createComponent(AdminDashboardComponent);
    errorFixture.detectChanges();

    expect(errorFixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(errorFixture.nativeElement.querySelector('.error-state .search-button')).not.toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LensDetailsComponent } from './lens-details.component';

describe('LensDetailsComponent', () => {
  let component: LensDetailsComponent;
  let fixture: ComponentFixture<LensDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LensDetailsComponent]
    });
    fixture = TestBed.createComponent(LensDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the contact lens catalog and renders its products', () => {
    expect(component.products.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelectorAll('.product-card').length).toBe(component.products.length);
  });

  it('opens the selected contact lens details', () => {
    const productCard: HTMLButtonElement | null = fixture.nativeElement.querySelector('.product-card button');
    const product = component.products[0];

    productCard?.click();
    fixture.detectChanges();

    expect(component.selectedProduct?.id).toBe(product.id);
    expect(component.isDetailsView).toBeTrue();
    expect(fixture.nativeElement.querySelector('.main-image').getAttribute('alt')).toBe(product.name);
    expect(fixture.nativeElement.querySelector('form')).not.toBeNull();
  });
});

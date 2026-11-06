import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ProductExplorerComponent } from './product-explorer.component';

describe('ProductExplorerComponent', () => {
  let component: ProductExplorerComponent;
  let fixture: ComponentFixture<ProductExplorerComponent>;
  let routeParamMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(() => {
    routeParamMap = new BehaviorSubject(convertToParamMap({
      category: 'all-products',
      searchQuery: 'no-product-can-match-this'
    }));
    TestBed.configureTestingModule({
      imports: [ProductExplorerComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: routeParamMap.asObservable() } }
      ]
    });
    fixture = TestBed.createComponent(ProductExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks a product thumbnail loaded without relying on its current list index', () => {
    const product = component.categories[0].products[0];

    component.onImageLoaded(product);

    expect(product.variants[0].imagesLoaded).toBeTrue();
  });

  it('releases the loading placeholder when a product image fails', () => {
    const product = component.categories[0].products[0];
    const imageUrl = product.variants[0].images[0];

    component.onProductImageError(product);

    expect(product.variants[0].imagesLoaded).toBeTrue();
    expect(component.failedImageUrls.has(imageUrl)).toBeTrue();
  });

  it('shows every product when no search query is set', () => {
    expect(component.filteredProducts.length).toBe(0);
    routeParamMap.next(convertToParamMap({ category: 'all-products' }));
    fixture.detectChanges();

    expect(component.filteredProducts.length).toBe(
      component.categories.reduce((total, category) => total + category.products.length, 0)
    );
  });

  it('shows a sale-focused banner instead of the legacy sale image', async () => {
    routeParamMap.next(convertToParamMap({ category: 'bumper-discount' }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isBumperDiscountView).toBeTrue();
    expect(component.selectedProduct).toBeNull();
    expect(fixture.nativeElement.querySelector('.sale-banner')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.category-banner')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sale-banner-cta').getAttribute('href')).toBe('#sale-products');
  });

  it('offers live try-on for an eyewear product without opening the camera automatically', async () => {
    routeParamMap.next(convertToParamMap({ category: 'all-products' }));
    await fixture.whenStable();
    fixture.detectChanges();

    const productCard: HTMLButtonElement | null = fixture.nativeElement.querySelector('.product-card');
    productCard?.click();
    fixture.detectChanges();

    expect(component.supportsVirtualTryOn).toBeTrue();
    expect(fixture.nativeElement.querySelector('.mDiv')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.try-on-trigger')).not.toBeNull();
    expect(component.isTryOnOpen).toBeFalse();

    const selectedProduct = component.selectedProduct!;
    const selectedVariant = selectedProduct.variants[1];
    component.selectVariant(selectedVariant);

    expect(component.currentMainImage).toBe(selectedVariant.images[0]);
  });

  it('does not request the camera when the selected variant has no transparent cutout', () => {
    const getUserMedia = spyOn(navigator.mediaDevices, 'getUserMedia');
    component.selectProduct(component.categories[0].products[0]);

    component.openTryOn();
    fixture.detectChanges();

    expect(getUserMedia).not.toHaveBeenCalled();
    expect(component.isTryOnOpen).toBeTrue();
    expect(component.tryOnError).toContain('transparent try-on image is not available');
  });

  it('shows actionable feedback when camera permission is denied', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(
      Promise.reject(new DOMException('Permission denied', 'NotAllowedError'))
    );
    component.selectProduct(component.categories[0].products[0]);
    component.selectedVariant = {
      ...component.selectedVariant,
      tryOnImage: '/assets/Images/try-on/test-frame.png'
    };
    fixture.detectChanges();

    component.openTryOn();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.tryOnError).toContain('Camera permission was blocked');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Allow camera access');
  });

  it('shows the discounted price immediately when a product is opened', () => {
    const product = component.categories[0].products[0];

    component.selectProduct(product);

    expect(component.getDiscountedPrice(product)).toBe(
      product.basePrice - product.basePriceWithDiscount
    );
    expect(component.discountPercent).toBeGreaterThan(0);
  });

  it('toggles filter chips and clears them when filters are reset', () => {
    component.filterByDiscount(20);
    expect(component.isFilterSelected('20% or more')).toBeTrue();

    component.filterByDiscount(20);
    expect(component.isFilterSelected('20% or more')).toBeFalse();

    component.filterByColor('Black');
    component.resetFilters();
    expect(component.selectedFilters).toEqual([]);
  });
});

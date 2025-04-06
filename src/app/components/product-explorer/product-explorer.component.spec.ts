import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExplorerComponent } from './product-explorer.component';

describe('ProductExplorerComponent', () => {
  let component: ProductExplorerComponent;
  let fixture: ComponentFixture<ProductExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductExplorerComponent]
    });
    fixture = TestBed.createComponent(ProductExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

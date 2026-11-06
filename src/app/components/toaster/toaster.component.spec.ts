import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToasterComponent } from './toaster.component';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToasterComponent]
    });
    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('styles success and error messages by their content', () => {
    component.title = 'Success!';
    component.message = 'Product added to cart';
    expect(component.type).toBe('success');

    component.title = 'Order Failed';
    component.message = 'Unable to place order';
    expect(component.type).toBe('error');
  });

  it('presents legacy danger notifications as an error with the useful message', () => {
    component.title = 'Please log in to continue';
    component.message = 'danger';

    expect(component.type).toBe('error');
    expect(component.displayTitle).toBe('Something went wrong');
    expect(component.displayMessage).toBe('Please log in to continue');
  });

  it('emits a dismiss event when the notification is closed', () => {
    const dismissSpy = jasmine.createSpy('dismiss');
    component.dismiss.subscribe(dismissSpy);

    component.hide();

    expect(dismissSpy).toHaveBeenCalled();
    expect(component.show).toBeFalse();
  });
});

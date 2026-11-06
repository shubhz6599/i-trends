import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows six featured eyewear cards that lead to all products', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigation = spyOn(router, 'navigateByUrl').and.resolveTo(true);

    expect(component.featuredStyles.length).toBe(6);
    expect(fixture.nativeElement.querySelectorAll('.featured-card.showcase-3d').length).toBe(6);
    component.navigate('all-products');

    expect(navigation).toHaveBeenCalledWith('category/all-products');
  });

  it('renders three interactive eyewear showcase cards', () => {
    expect(component.motionCards.length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.motion-card').length).toBe(3);
  });

  it('keeps the existing hero and adds two responsive 3D spotlight cards', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('See the worldin your own style.');
    expect(component.spotlightCards.length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.spotlight-card').length).toBe(2);

    const categories = [
      ...component.spotlightCards.map(card => card.category),
      ...component.motionCards.map(card => card.category),
      ...component.featuredStyles.map(style => style.category)
    ];
    expect(new Set(categories).size).toBe(categories.length);
  });
});

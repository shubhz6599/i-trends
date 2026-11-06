import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { LayoutComponent } from './layout.component';

@Component({
  standalone: true,
  template: ''
})
class TestPageComponent {}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([{ path: 'test', component: TestPageComponent }])]
    });
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('scrolls the window to the top after route navigation', async () => {
    const scrollTo = spyOn(window, 'scrollTo');
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/test');

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

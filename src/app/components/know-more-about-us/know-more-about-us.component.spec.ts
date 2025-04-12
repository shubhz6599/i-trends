import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowMoreAboutUsComponent } from './know-more-about-us.component';

describe('KnowMoreAboutUsComponent', () => {
  let component: KnowMoreAboutUsComponent;
  let fixture: ComponentFixture<KnowMoreAboutUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KnowMoreAboutUsComponent]
    });
    fixture = TestBed.createComponent(KnowMoreAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

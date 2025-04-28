import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LensDetailsComponent } from './lens-details.component';

describe('LensDetailsComponent', () => {
  let component: LensDetailsComponent;
  let fixture: ComponentFixture<LensDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LensDetailsComponent]
    });
    fixture = TestBed.createComponent(LensDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

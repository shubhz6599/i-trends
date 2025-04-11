import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineConsultationComponent } from './online-consultation.component';

describe('OnlineConsultationComponent', () => {
  let component: OnlineConsultationComponent;
  let fixture: ComponentFixture<OnlineConsultationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineConsultationComponent]
    });
    fixture = TestBed.createComponent(OnlineConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingGuideComponent } from './buying-guide.component';

describe('BuyingGuideComponent', () => {
  let component: BuyingGuideComponent;
  let fixture: ComponentFixture<BuyingGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BuyingGuideComponent]
    });
    fixture = TestBed.createComponent(BuyingGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

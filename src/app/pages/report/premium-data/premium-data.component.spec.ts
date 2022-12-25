import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumDataComponent } from './premium-data.component';

describe('PremiumDataComponent', () => {
  let component: PremiumDataComponent;
  let fixture: ComponentFixture<PremiumDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
